import { DestroyRef, inject, isDevMode, runInInjectionContext } from '@angular/core';
import { CommandType, UIEventMessage } from '../../types';
import { broker } from '../../providers/ui-broker';

export function Listener(command: CommandType, atomId: string) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): TypedPropertyDescriptor<any> | void {
    const originalMethod = descriptor.value;
    const originalOnInit = target.ngOnInit;

    target.ngOnInit = function (this: any, ...args: any[]) {
      if (originalOnInit) {
        originalOnInit.apply(this, args);
      }

      // 1. Resolve o ID do Container/Contexto (o próprio Hero/Container possui o this.id)
      let containerId: string | null = null;

      if (this.id !== undefined) {
        const idVal = this.id;
        containerId = typeof idVal === 'function' ? idVal() : idVal;
      }

      if (!containerId && isDevMode()) {
        console.warn(
          `[Listener] (@Listener('${command}', '${atomId}') on "${String(propertyKey)}" in "${target.constructor.name}" could not resolve a context id)`
        );
      }

      // 2. Monta o canal exatamente no formato `${containerId}:${atomId}`
      const channelId = containerId ? `${containerId}:${atomId}` : atomId;

      if (isDevMode()) {
        // console.log(`[Listener] Registrando listener para comando "${command}" no canal "${channelId}".`);
      }

      // 3. Ouve o Broker (Apenas subscreve no Set de manipuladores do broker)
      const subscriptionToken = broker.register(
        channelId,
        command,
        (message: UIEventMessage) => {
          originalMethod.call(this, message);
        }
      );

      // 4. Teardown / Limpeza reativa
      const injector = this.injector || this.__injector;
      if (injector) {
        try {
          runInInjectionContext(injector, () => {
            const destroyRef = inject(DestroyRef);
            destroyRef.onDestroy(() => subscriptionToken.unsubscribe());
          });
          return;
        } catch {
          // Caso ocorra fora do ciclo do Angular, usa fallback para o ngOnDestroy
        }
      }

      bindCleanupOnDestroy(this, subscriptionToken);
    };

    return descriptor;
  };
}

function bindCleanupOnDestroy(instance: any, subscriptionToken: { unsubscribe: () => void }) {
  const originalOnDestroy = instance.ngOnDestroy;
  instance.ngOnDestroy = function (...args: any[]) {
    subscriptionToken.unsubscribe();
    if (originalOnDestroy) {
      originalOnDestroy.apply(instance, args);
    }
  };
}