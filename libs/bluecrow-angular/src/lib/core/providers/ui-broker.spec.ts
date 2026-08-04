import { jest, test, expect, describe, beforeEach } from '@jest/globals';

jest.mock('@angular/core', () => ({
  isDevMode: () => false,
}));

import { broker } from './ui-broker';
import { UIEventMessage } from '../types';

const createMessage = (): UIEventMessage<'on:click'> => ({
  command: 'on:click',
  eventName: 'click',
  nodeTree: [],
  payload: { target: null } as unknown as MouseEvent,
  timestamp: Date.now(),
});

describe('UIBrokerMessenger', () => {
  beforeEach(() => {
    broker.unregisterAll('leak-scan');
    broker.unregisterAll('scale-scan');
  });

  it('should publish only to the matching command channel and avoid leaking state', () => {
    const received: UIEventMessage[] = [];
    const leakingSpy = jest.fn();

    const token = broker.register('leak-scan', 'on:click', (message) => {
      received.push(message);
    });

    broker.register('leak-scan', 'on:keydown', leakingSpy);

    broker.publish('leak-scan', createMessage());

    expect(received).toHaveLength(1);
    expect(leakingSpy).not.toHaveBeenCalled();

    token.unsubscribe();
    expect(broker.hasSubscribers('leak-scan', 'on:click')).toBe(false);
    expect(broker.hasSubscribers('leak-scan', 'on:keydown')).toBe(true);
  });

  it('should scale with many subscribers without cross-command contamination', () => {
    const subscribers = Array.from({ length: 24 }, () => {
      const stub = jest.fn();
      broker.register('scale-scan', 'on:click', stub);
      return stub;
    });

    broker.publish('scale-scan', createMessage());

    expect(subscribers).toHaveLength(24);
    subscribers.forEach((stub) => {
      expect(stub).toHaveBeenCalledTimes(1);
    });

    broker.unregisterAll('scale-scan');
    expect(broker.hasSubscribers('scale-scan', 'on:click')).toBe(false);
  });

  it('should tolerate handler exceptions without breaking the rest of the publish loop', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const healthySpy = jest.fn();
    const failingSpy = jest.fn(() => {
      throw new Error('handler failure');
    });

    broker.register('scale-scan', 'on:click', failingSpy);
    broker.register('scale-scan', 'on:click', healthySpy);

    broker.publish('scale-scan', createMessage());

    expect(failingSpy).toHaveBeenCalledTimes(1);
    expect(healthySpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
