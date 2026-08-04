import { DestroyRef, inject, Injector, runInInjectionContext } from '@angular/core';
import { Subject, isObservable } from 'rxjs';
import { CommandType } from '../../types';
import { COMMAND_EVENT_MAP, EventDirective } from '../../directives/events/event';

export function AsyncCommand(command: CommandType) {
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
        console.warn(`[AsyncCommand Decorator] (No event binding found for command "${command}")`);
        return;
      }

      const injector: Injector | null = this.injector || this.__injector;
      if (!injector) {
        console.warn(
          `[AsyncCommand Decorator] (Unable to resolve Injector for "${target.constructor.name}")`
        );
        return;
      }

      runInInjectionContext(injector, () => {
        const directiveInstance = inject<EventDirective>(binding.directive, { optional: true });
        const destroyRef = inject(DestroyRef);

        const atomId = this.id ? (typeof this.id === 'function' ? this.id() : this.id) : null;
        if (directiveInstance && atomId) {
          directiveInstance.childId = atomId;
        }

        if (!directiveInstance) {
          console.warn(
            `[AsyncCommand Decorator] (Directive "${binding.directive.name}" was not injected for command "${command}" in component "${this.constructor.name}")`
          );
          return;
        }

        const eventSubject$ = new Subject<any>();
        const outputObservable$ = originalMethod.call(this, eventSubject$.asObservable());

        if (isObservable(outputObservable$)) {
          const subscription = outputObservable$.subscribe({
            next: (processedPayload) => {
              // Regra de Guarda: Só dispara se o stream emitir algo válido
              if (processedPayload !== false && processedPayload !== null && processedPayload !== undefined) {
                directiveInstance.dispatchUIEvent(command, processedPayload);
              }
            },
            error: (err) => console.error(`[AsyncCommand Decorator] Erro no stream do comando "${command}":`, err)
          });

          destroyRef.onDestroy(() => subscription.unsubscribe());
        } else {
          console.warn(`[AsyncCommand Decorator] O método "${String(propertyKey)}" deve retornar um Observable.`);
        }

        // Registra o interceptador no mapa universal da diretiva
        directiveInstance.registerCommandInterceptor(command, (nativeEvent: any) => {
          if (atomId && !directiveInstance.childId) {
            directiveInstance.childId = atomId;
          }

          eventSubject$.next(nativeEvent);
        });
      });
    };

    return descriptor;
  };
}