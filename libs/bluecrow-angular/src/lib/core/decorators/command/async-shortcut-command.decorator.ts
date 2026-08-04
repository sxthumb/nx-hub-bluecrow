import { DestroyRef, inject, Injector, runInInjectionContext } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject, isObservable, Observable } from 'rxjs';
import { CommandType } from '../../types';
import { COMMAND_EVENT_MAP, EventDirective } from '../../directives/events/event';

type ShortcutModifier = 'ctrl' | 'shift' | 'alt' | 'meta';

interface ParsedShortcut {
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
}

const MODIFIER_ALIASES: Record<string, ShortcutModifier> = {
  ctrl: 'ctrl',
  control: 'ctrl',
  shift: 'shift',
  alt: 'alt',
  option: 'alt',
  meta: 'meta',
  cmd: 'meta',
  command: 'meta',
  win: 'meta',
};

const KEY_ALIASES: Record<string, string> = {
  esc: 'escape',
  del: 'delete',
  space: ' ',
  spacebar: ' ',
  return: 'enter',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
};

function parseShortcut(shortcut: string): ParsedShortcut {
  const parts = shortcut
    .split('+')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  const parsed: ParsedShortcut = { key: '', ctrl: false, shift: false, alt: false, meta: false };

  for (const part of parts) {
    const modifier = MODIFIER_ALIASES[part];
    if (modifier) {
      parsed[modifier] = true;
      continue;
    }
    parsed.key = KEY_ALIASES[part] ?? part;
  }

  if (!parsed.key) {
    throw new Error(`[AsyncCommandShortcut Decorator] (Invalid shortcut "${shortcut}": it does not define a primary key)`);
  }

  return parsed;
}

function matchesShortcut(event: KeyboardEvent, shortcut: ParsedShortcut): boolean {
  const key = event.key?.toLowerCase();

  return (
    key === shortcut.key &&
    event.ctrlKey === shortcut.ctrl &&
    event.shiftKey === shortcut.shift &&
    event.altKey === shortcut.alt &&
    event.metaKey === shortcut.meta
  );
}

/**
 * Registra um atalho de teclado GLOBAL e um stream de comando nativo assíncrono.
 * Redireciona tanto o evento nativo (ex: mouse click) quanto a tecla para o mesmo Observable.
 */
export function AsyncCommandShortcut(
  shortcut: string,
  command: CommandType,
  keyEvent: 'keydown' | 'keyup' = 'keydown'
) {
  const parsedShortcut = parseShortcut(shortcut);

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
        console.warn(`[AsyncCommandShortcut Decorator] (No event binding found for command "${command}")`);
        return;
      }

      const injector: Injector | null = this.injector || this.__injector;
      if (!injector) {
        console.warn(
          `[AsyncCommandShortcut Decorator] (Unable to resolve Injector for "${target.constructor.name}")`
        );
        return;
      }

      runInInjectionContext(injector, () => {
        const documentRef = inject(DOCUMENT);
        const destroyRef = inject(DestroyRef);
        const directiveInstance = inject<EventDirective>(binding.directive, { optional: true });

        if (!directiveInstance) {
          console.warn(
            `[AsyncCommandShortcut Decorator] (Directive "${binding.directive.name}" was not injected for command "${command}" in component "${this.constructor.name}")`
          );
          return;
        }

        const atomId = this.id ? (typeof this.id === 'function' ? this.id() : this.id) : null;
        if (atomId) {
          directiveInstance.childId = atomId;
        }

        // Subject unificado (recebe MouseEvent | KeyboardEvent)
        const eventSubject$ = new Subject<any>();

        const outputObservable$ = originalMethod.call(this, eventSubject$.asObservable());

        if (isObservable(outputObservable$)) {
          const subscription = outputObservable$.subscribe({
            next: (processedPayload) => {
              if (processedPayload !== false && processedPayload !== null && processedPayload !== undefined) {
                directiveInstance.dispatchUIEvent(command, processedPayload);
              }
            },
            error: (err) =>
              console.error(`[AsyncCommandShortcut Decorator] (Shortcut/command stream failed for "${shortcut}")`, err),
          });

          destroyRef.onDestroy(() => subscription.unsubscribe());
        } else {
          console.warn(
            `[AsyncCommandShortcut Decorator] O método "${String(propertyKey)}" deve retornar um Observable.`
          );
        }

        // 1. REGISTRA NA DIRETIVA NATIVA DO COMANDO (ex: para capturar mouse click)
        directiveInstance.registerCommandInterceptor(command, (nativeEvent: any) => {
          if (atomId && !directiveInstance.childId) {
            directiveInstance.childId = atomId;
          }
          eventSubject$.next(nativeEvent);
        });

        // 2. REGISTRA NO DOCUMENT (para capturar o atalho global)
        const handleGlobalKeyboardEvent = (nativeEvent: KeyboardEvent) => {
          if (!matchesShortcut(nativeEvent, parsedShortcut)) {
            return;
          }

          nativeEvent.preventDefault();

          if (atomId && !directiveInstance.childId) {
            directiveInstance.childId = atomId;
          }

          eventSubject$.next(nativeEvent);
        };

        documentRef.addEventListener(keyEvent, handleGlobalKeyboardEvent);

        destroyRef.onDestroy(() => {
          documentRef.removeEventListener(keyEvent, handleGlobalKeyboardEvent);
          eventSubject$.complete();
        });
      });
    };

    return descriptor;
  };
}