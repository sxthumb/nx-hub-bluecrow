import {
  DestroyRef,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { messageBroker } from '@morgan-stanley/message-broker';
import { AtomBrokerEnvelope, AtomEventMessage, CommandType } from '../types';
import { Container } from '../directives'; // ajuste o path

export const globalBroker = messageBroker<AtomEventMessage>();

export function Command(command: CommandType, atomId: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const originalOnInit = target.ngOnInit;

    target.ngOnInit = function (this: any, ...args: any[]) {
      if (originalOnInit) {
        originalOnInit.apply(this, args);
      }

      const containerId = this instanceof Container || this.id ? this.id : null;
      const channelId = containerId ? `${containerId}:${atomId}` : atomId;

      const subscription = globalBroker.get(channelId as any).subscribe((envelope: AtomBrokerEnvelope) => {
        if (envelope?.data?.event !== command) {
          return;
        }

        originalMethod.call(this, envelope.data);
      });

      try {
        const injector = this.injector || this.__injector;

        if (injector) {
          runInInjectionContext(injector, () => {
            const destroyRef = inject(DestroyRef);
            destroyRef.onDestroy(() => subscription.unsubscribe());
          });
        } else {
          bindCleanupOnDestroy(this, subscription);
        }
      } catch {
        bindCleanupOnDestroy(this, subscription);
      }
    };

    return descriptor;
  };
}

function bindCleanupOnDestroy(instance: any, subscription: any) {
  const originalOnDestroy = instance.ngOnDestroy;
  instance.ngOnDestroy = function (...args: any[]) {
    subscription.unsubscribe();
    if (originalOnDestroy) {
      originalOnDestroy.apply(instance, args);
    }
  };
}