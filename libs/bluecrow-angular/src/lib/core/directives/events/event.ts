import { Type, Directive, ElementRef, inject, isDevMode } from '@angular/core';
import { createUIEventMessage } from '../../helpers/ui-event.factory';
import { UIContext } from '../ui-context';
import { CommandType, EventFromCommand, UIEventPayloadMap } from '../../types';
import { broker } from '../../providers/ui-broker';

export type EventInterceptor = (nativeEvent: any) => void;

@Directive()
export abstract class EventDirective {
  protected readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly parentContext = inject(UIContext, { optional: true });

  protected id!: string;

  /**
   * Registro genérico de interceptadores injetados via @Command e @AsyncCommand
   */
  private readonly __commandInterceptors = new Map<CommandType, EventInterceptor>();

  get contextId(): string | null {
    if (!this.parentContext) return null;
    const rawId = this.parentContext.id;
    return typeof rawId === 'function' ? rawId() : rawId;
  }

  get childId(): string {
    return this.id;
  }

  set childId(value: string) {
    this.id = value;
  }

  /**
   * Ponto de entrada ÚNICO para qualquer evento do DOM capturado pelas diretivas host.
   */
  public emitNativeEvent(command: CommandType, nativeEvent: any): void {
    const interceptor = this.__commandInterceptors.get(command);
    if (interceptor) {
      interceptor(nativeEvent);
    }
  }

  /**
   * Registra o pipeline do @Command ou @AsyncCommand
   */
  public registerCommandInterceptor(command: CommandType, interceptor: EventInterceptor): void {
    this.__commandInterceptors.set(command, interceptor);
  }

  /**
   * Lê o interceptor atualmente registrado para um comando, sem removê-lo.
   * Usado por decorators que precisam ENCADEAR no interceptor existente em
   * vez de sobrescrevê-lo (ex: múltiplos @CommandShortcut escutando
   * "on:keydown" no mesmo componente).
   */
  public getCommandInterceptor(command: CommandType): EventInterceptor | undefined {
    return this.__commandInterceptors.get(command);
  }

  public dispatchUIEvent<TCmd extends CommandType>(
    command: TCmd,
    // Permite tanto o payload nativo quanto um payload customizado retornado pelos @Command / @AsyncCommand
    payload: UIEventPayloadMap[EventFromCommand<TCmd>] | any
  ): void {
    const parentId = this.contextId;

    if (!parentId) {
      if (isDevMode()) {
        console.warn(
          `[UIBroker] (Event "${command}" cancelled because atom "${this.childId}" is not under a valid UIContext)`
        );
      }
      return;
    }

    const channelId = `${parentId}:${this.childId}`;

    if (!broker.hasSubscribers(channelId, command)) {
      return;
    }

    const message = createUIEventMessage(
      command,
      payload,
      this.getParentNodeTree()
    );

    broker.publish(channelId, message);
  }

  private getParentNodeTree() {
    const tree = [];
    let current: Node | null = this.elementRef.nativeElement;

    while (current && current instanceof HTMLElement) {
      tree.push({
        tagName: current.tagName.toLowerCase(),
        id: current.id || undefined,
        className: current.className || undefined
      });
      current = current.parentNode;
    }

    return tree;
  }
}

// ---- TODAS AS DIRETIVAS DE EVENTO SEGUEM RIGOROSAMENTE O MESMO PADRÃO ----

@Directive({
  host: {
    '(focus)': 'emitNativeEvent("on:focus", $event)',
    '(blur)': 'emitNativeEvent("on:blur", $event)',
    '(focusin)': 'emitNativeEvent("on:focusin", $event)',
    '(focusout)': 'emitNativeEvent("on:focusout", $event)'
  }
})
export class FocusableEvent extends EventDirective {}

@Directive({
  host: {
    '(click)': 'emitNativeEvent("on:click", $event)',
    '(dblclick)': 'emitNativeEvent("on:dblclick", $event)',
    '(contextmenu)': 'emitNativeEvent("on:contextmenu", $event)'
  }
})
export class ClickableEvent extends EventDirective {}

@Directive({
  host: {
    '(keydown)': 'emitNativeEvent("on:keydown", $event)',
    '(keyup)': 'emitNativeEvent("on:keyup", $event)',
    '(keypress)': 'emitNativeEvent("on:keypress", $event)'
  }
})
export class KeyboardEventDirective extends EventDirective {}

@Directive({
  host: {
    '(mousedown)': 'emitNativeEvent("on:mousedown", $event)',
    '(mouseup)': 'emitNativeEvent("on:mouseup", $event)',
    '(mouseenter)': 'emitNativeEvent("on:mouseenter", $event)',
    '(mouseleave)': 'emitNativeEvent("on:mouseleave", $event)',
    '(mousemove)': 'emitNativeEvent("on:mousemove", $event)'
  }
})
export class MouseMotionEvent extends EventDirective {}

@Directive({
  host: {
    '(input)': 'emitNativeEvent("on:input", $event)',
    '(change)': 'emitNativeEvent("on:change", $event)',
    '(submit)': 'emitNativeEvent("on:submit", $event)'
  }
})
export class FormInputEventDirective extends EventDirective {}

@Directive({
  host: {
    '(copy)': 'emitNativeEvent("on:copy", $event)',
    '(cut)': 'emitNativeEvent("on:cut", $event)',
    '(paste)': 'emitNativeEvent("on:paste", $event)'
  }
})
export class ClipboardEventDirective extends EventDirective {}

@Directive({
  host: {
    '(select)': 'emitNativeEvent("on:select", $event)'
  }
})
export class SelectedEvent extends EventDirective {}

@Directive({
  host: {
    '(dragstart)': 'emitNativeEvent("on:dragstart", $event)',
    '(dragover)': 'emitNativeEvent("on:dragover", $event)',
    '(dragleave)': 'emitNativeEvent("on:dragleave", $event)',
    '(drop)': 'emitNativeEvent("on:drop", $event)'
  }
})
export class DragDropEventDirective extends EventDirective {}

@Directive({
  host: {
    '(pointerdown)': 'emitNativeEvent("on:pointerdown", $event)',
    '(pointerup)': 'emitNativeEvent("on:pointerup", $event)',
    '(pointermove)': 'emitNativeEvent("on:pointermove", $event)',
    '(pointerenter)': 'emitNativeEvent("on:pointerenter", $event)',
    '(pointerleave)': 'emitNativeEvent("on:pointerleave", $event)',
    '(pointercancel)': 'emitNativeEvent("on:pointercancel", $event)'
  }
})
export class PointerEventDirective extends EventDirective {}

@Directive({
  host: {
    '(scroll)': 'emitNativeEvent("on:scroll", $event)',
    '(wheel)': 'emitNativeEvent("on:wheel", $event)'
  }
})
export class ScrollableEventDirective extends EventDirective {}

export interface EventBindingMeta {
  directive: Type<EventDirective>;
  handlerMethod: string;
}

export const COMMAND_EVENT_MAP: Record<CommandType, EventBindingMeta> = {
  'on:click': { directive: ClickableEvent, handlerMethod: 'onClick' },
  'on:dblclick': { directive: ClickableEvent, handlerMethod: 'onDoubleClick' },
  'on:contextmenu': { directive: ClickableEvent, handlerMethod: 'onContextMenu' },
  'on:focus': { directive: FocusableEvent, handlerMethod: 'onFocus' },
  'on:blur': { directive: FocusableEvent, handlerMethod: 'onBlur' },
  'on:keydown': { directive: KeyboardEventDirective, handlerMethod: 'onKeydown' },
  'on:keyup': { directive: KeyboardEventDirective, handlerMethod: 'onKeyup' },
  'on:input': { directive: FormInputEventDirective, handlerMethod: 'onInput' },
  'on:change': { directive: FormInputEventDirective, handlerMethod: 'onChange' },
  'on:mousedown': { directive: MouseMotionEvent, handlerMethod: 'onMouseDown' },
  'on:mouseup': { directive: MouseMotionEvent, handlerMethod: 'onMouseUp' },
  'on:mouseenter': { directive: MouseMotionEvent, handlerMethod: 'onMouseEnter' },
  'on:mouseleave': { directive: MouseMotionEvent, handlerMethod: 'onMouseLeave' },
  'on:mousemove': { directive: MouseMotionEvent, handlerMethod: 'onMouseMove' },
  'on:keypress': { directive: KeyboardEventDirective, handlerMethod: 'onKeypress' },
  'on:focusin': { directive: FocusableEvent, handlerMethod: 'onFocusIn' },
  'on:focusout': { directive: FocusableEvent, handlerMethod: 'onFocusOut' },
  'on:submit': { directive: FormInputEventDirective, handlerMethod: 'onSubmit' },
  'on:select': { directive: SelectedEvent, handlerMethod: 'onSelection' },
  'on:copy': { directive: ClipboardEventDirective, handlerMethod: 'onCopy' },
  'on:cut': { directive: ClipboardEventDirective, handlerMethod: 'onCut' },
  'on:paste': { directive: ClipboardEventDirective, handlerMethod: 'onPaste' },
  'on:pointerdown': { directive: PointerEventDirective, handlerMethod: 'onPointerDown' },
  'on:pointerup': { directive: PointerEventDirective, handlerMethod: 'onPointerUp' },
  'on:pointermove': { directive: PointerEventDirective, handlerMethod: 'onPointerMove' },
  'on:pointerenter': { directive: PointerEventDirective, handlerMethod: 'onPointerEnter' },
  'on:pointerleave': { directive: PointerEventDirective, handlerMethod: 'onPointerLeave' },
  'on:pointercancel': { directive: PointerEventDirective, handlerMethod: 'onPointerCancel' },
  'on:scroll': { directive: ScrollableEventDirective, handlerMethod: 'onScroll' },
  'on:wheel': { directive: ScrollableEventDirective, handlerMethod: 'onWheel' },
  'on:dragstart': { directive: DragDropEventDirective, handlerMethod: 'onDragStart' },
  'on:dragover': { directive: DragDropEventDirective, handlerMethod: 'onDragOver' },
  'on:dragleave': { directive: DragDropEventDirective, handlerMethod: 'onDragLeave' },
  'on:drop': { directive: DragDropEventDirective, handlerMethod: 'onDrop' },
};