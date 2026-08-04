import { DestroyRef, inject, Injector, runInInjectionContext } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { isObservable, Observable } from 'rxjs';
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
    throw new Error(`[CommandShortcut Decorator] Atalho inválido: "${shortcut}" não define uma tecla principal.`);
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
 * Registra um atalho de teclado GLOBAL e também se vincula ao comando nativo alvo
 * (ex: "on:click"). Permite responder tanto ao evento do DOM quanto ao atalho.
 */
export function CommandShortcut(
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
        console.warn(`[CommandShortcut Decorator] Nenhum mapeamento encontrado para o comando "${command}".`);
        return;
      }

      const injector: Injector | null = this.injector || this.__injector;
      if (!injector) {
        console.warn(
          `[CommandShortcut Decorator] Não foi possível obter o Injector em "${target.constructor.name}".`
        );
        return;
      }

      runInInjectionContext(injector, () => {
        const documentRef = inject(DOCUMENT);
        const destroyRef = inject(DestroyRef);

        // Diretiva DONA do comando alvo (ex: ClickableEvent para "on:click")
        const targetDirective = inject<EventDirective>(binding.directive, { optional: true });

        if (!targetDirective) {
          console.warn(
            `[CommandShortcut Decorator] A diretiva "${binding.directive.name}" para o comando "${command}" não foi injetada no componente "${this.constructor.name}".`
          );
          return;
        }

        const atomId = this.id ? (typeof this.id === 'function' ? this.id() : this.id) : null;
        if (atomId) {
          targetDirective.childId = atomId;
        }

        // Função comum de execução do método e disparo no Broker
        const executePipeline = (event: any) => {
          if (atomId && !targetDirective.childId) {
            targetDirective.childId = atomId;
          }

          const result = originalMethod.call(this, event);

          if (isObservable(result)) {
            (result as Observable<any>).subscribe({
              next: (value) => {
                if (value !== false && value !== null && value !== undefined) {
                  targetDirective.dispatchUIEvent(command, value);
                }
              },
              error: (err) =>
                console.error(`[CommandShortcut Decorator] Erro no stream do comando/atalho "${shortcut}":`, err),
            });
            return;
          }

          if (result === null || result === false || result === undefined) {
            return;
          }

          targetDirective.dispatchUIEvent(command, result);
        };

        // 1. REGISTRA NA DIRETIVA NATIVA DO COMANDO (ex: responde a clicks de mouse)
        targetDirective.registerCommandInterceptor(command, (nativeEvent: any) => {
          executePipeline(nativeEvent);
        });

        // 2. REGISTRA NO DOCUMENT (responde ao atalho global de teclado)
        const handleGlobalKeyboardEvent = (nativeEvent: KeyboardEvent) => {
          if (!matchesShortcut(nativeEvent, parsedShortcut)) {
            return;
          }

          nativeEvent.preventDefault();
          executePipeline(nativeEvent);
        };

        documentRef.addEventListener(keyEvent, handleGlobalKeyboardEvent);

        destroyRef.onDestroy(() => {
          documentRef.removeEventListener(keyEvent, handleGlobalKeyboardEvent);
        });
      });
    };

    return descriptor;
  };
}