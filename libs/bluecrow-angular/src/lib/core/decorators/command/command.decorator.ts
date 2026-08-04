import { inject, Injector, runInInjectionContext } from '@angular/core';
import { CommandType } from '../../types';
import { COMMAND_EVENT_MAP, EventDirective } from '../../directives/events/event';

export function Command(command: CommandType) {
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

      const binding = COMMAND_EVENT_MAP[command];
      if (!binding) {
        console.warn(`[Command Decorator] Nenhum mapeamento encontrado para o comando "${command}".`);
        return;
      }

      const injector: Injector | null = this.injector || this.__injector;
      if (!injector) {
        console.warn(
          `[Command Decorator] Não foi possível obter o Injector em "${target.constructor.name}".`
        );
        return;
      }

      runInInjectionContext(injector, () => {
        const directiveInstance = inject<EventDirective>(binding.directive, { optional: true });

        console.log(`[Command Decorator] Injetando diretiva "${binding.directive.name}" para o comando "${command}" no componente "${this.constructor.name}".`);

        const atomId = this.id ? (typeof this.id === 'function' ? this.id() : this.id) : null;
        if (directiveInstance && atomId) {
          directiveInstance.childId = atomId;
        }

        if (!directiveInstance) {
          console.warn(
            `[Command Decorator] A diretiva "${binding.directive.name}" para o comando "${command}" não foi injetada no componente "${this.constructor.name}".`
          );
          return;
        }

        // Registra o interceptador no mapa universal da diretiva
        directiveInstance.registerCommandInterceptor(command, (nativeEvent: any) => {
          if (atomId && !directiveInstance.childId) {
            directiveInstance.childId = atomId;
          }

          // Executa o método da classe do átomo
          const result = originalMethod ? originalMethod.call(this, nativeEvent) : nativeEvent;

          // Regra de Guarda: Cancela se retornar null, false ou undefined
          if (result === null || result === false || result === undefined) {
            return;
          }

          // Dispara para o UIBroker
          directiveInstance.dispatchUIEvent(command, result);
        });
      });
    };

    return descriptor;
  };
}