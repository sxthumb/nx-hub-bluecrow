import * as benny from 'benny';
import { broker } from './ui-broker';
import * as fs from 'node:fs';
import path from 'node:path';

const message = {
    command: 'on:click' as const,
    eventName: 'click' as const,
    nodeTree: [],
    payload: { target: null, type: 'click' },
    timestamp: Date.now(),
};

// Isolated channels: each benchmark affects only its own channel, so
// no measurement can contaminate the state used by another, regardless
// of the order in which benny/Benchmark.js decides to execute them.
const PUBLISH_CHANNEL = 'benchmark:channel:publish';
const REGISTER_CHANNEL = 'benchmark:channel:register';

// Scale array: each value is a point that becomes a full benchmark
// round. This is where you "raise the bar"—add or remove values
// to plot the cost curve relative to the number of handlers.
const SCALES = [64, 500, 2000, 5000, 10000];

const registerHeavyLoad = (channelId: string, count: number) => {
    for (let index = 0; index < count; index += 1) {
        broker.register(channelId, 'on:click', () => undefined); 
    }
};

interface ScalePoint {
    scale: number; 
    publishOpsPerSec: number; 
    publishMarginPercent: number; 
    registerOpsPerSec: number; 
    registerMarginPercent: number;
}

/**
* Runs a complete suite (publish + register) for a single value of N.
* Each call is isolated: channels are cleared before and after, so
* different scales never leak state into one another. 
*/
const runForScale = async (scale: number): Promise<ScalePoint> => {
  broker.unregisterAll(PUBLISH_CHANNEL);
  broker.unregisterAll(REGISTER_CHANNEL);

// Fixed state for the publish benchmark: registered once,
// outside the measured function, ensuring the same N subscribers
// throughout the suite for this scale point. 
registerHeavyLoad(PUBLISH_CHANNEL, scale);
 
  const point: ScalePoint = {
    scale,
    publishOpsPerSec: 0,
    publishMarginPercent: 0,
    registerOpsPerSec: 0,
    registerMarginPercent: 0,
  };
 
  await benny.suite(
    `UIBrokerMessenger benchmark (scale=${scale})`,
    benny.add(`publish with ${scale} subscribers`, () => {
      broker.publish(PUBLISH_CHANNEL, message as any);
    }),
    benny.add(`register ${scale} handlers`, () => {
    // Explicit reset on each measured iteration: without this, the Set of handlers
    // grows indefinitely with each benny call, inflating the measured cost
    // and producing artificial ops/s and margin of error figures.
    broker.unregisterAll(REGISTER_CHANNEL);
      registerHeavyLoad(REGISTER_CHANNEL, scale);
    }),
    benny.cycle(),
    benny.complete((summary) => {
      const publishResult = summary.results.find((result) => result.name.startsWith('publish'));
      const registerResult = summary.results.find((result) => result.name.startsWith('register'));
 
      point.publishOpsPerSec = publishResult?.ops ?? 0;
      point.publishMarginPercent = publishResult?.margin ?? 0;
      point.registerOpsPerSec = registerResult?.ops ?? 0;
      point.registerMarginPercent = registerResult?.margin ?? 0;
    }),
// Individual report for this scale, in the same format/location used
// previously — useful if you want to inspect a specific scale. 
benny.save({ file: `ui-broker-benchmark-scale-${scale}`, version: '1.0.0', format: 'json' }),
  );
 
  broker.unregisterAll(PUBLISH_CHANNEL);
  broker.unregisterAll(REGISTER_CHANNEL);
 
  return point;
};
 
const runBenchmark = async () => {
  const points: ScalePoint[] = [];

// Sequential by design: each run must complete before the next one
// begins, since PUBLISH_CHANNEL and REGISTER_CHANNEL are shared
// across runs—running in parallel would mix up the channel state. 
for (const scale of SCALES) {
    const point = await runForScale(scale);
    points.push(point);
 
    console.log(
      `[scale=${point.scale}] publish: ${point.publishOpsPerSec.toFixed(0)} ops/s (±${point.publishMarginPercent}%) | ` +
      `register: ${point.registerOpsPerSec.toFixed(0)} ops/s (±${point.registerMarginPercent}%)`,
    );
  }

// Consolidated summary containing all scale points in a single file,
// ready to be turned into a chart (X-axis = scale, Y-axis = opsPerSec). 
const summaryPath = path.resolve(__dirname, 'ui-broker-benchmark-scale-summary.json');
  fs.writeFileSync(
    summaryPath,
    JSON.stringify(
      {
        name: 'UIBrokerMessenger scale benchmark',
        date: new Date().toISOString(),
        scales: SCALES,
        points,
      },
      null,
      2,
    ),
  );
 
  console.log(`\nResumo consolidado salvo em: ${summaryPath}`);
};
 
void runBenchmark();