export interface DOMNodeMetadata {
  tagName: string;
  id?: string;
  className?: string;
}

export interface UIEventPayloadMap {
  click: MouseEvent;
  dblclick: MouseEvent;
  contextmenu: MouseEvent;
  mousedown: MouseEvent;
  mouseup: MouseEvent;
  mouseenter: MouseEvent;
  mouseleave: MouseEvent;
  mousemove: MouseEvent;
  keydown: KeyboardEvent;
  keyup: KeyboardEvent;
  keypress: KeyboardEvent;
  focus: FocusEvent;
  blur: FocusEvent;
  focusin: FocusEvent;
  focusout: FocusEvent;
  input: Event;
  change: Event;
  submit: SubmitEvent;
  select: Event;
  copy: ClipboardEvent;
  cut: ClipboardEvent;
  paste: ClipboardEvent;
  pointerdown: PointerEvent;
  pointerup: PointerEvent;
  pointermove: PointerEvent;
  pointerenter: PointerEvent;
  pointerleave: PointerEvent;
  pointercancel: PointerEvent;
  scroll: Event;
  wheel: WheelEvent;
  dragstart: DragEvent;
  dragover: DragEvent;
  dragleave: DragEvent;
  drop: DragEvent;
}

export type UIEventName = keyof UIEventPayloadMap;
export type UIEventPayload<TEventName extends UIEventName> = UIEventPayloadMap[TEventName];

export type CommandToEventMap = {
  [K in UIEventName as `on:${K}`]: K;
};

export type CommandType = keyof CommandToEventMap;
export type EventFromCommand<TCmd extends CommandType> = CommandToEventMap[TCmd];

export interface UIEventMessage<TCmd extends CommandType = CommandType> {
  command: TCmd;
  eventName: EventFromCommand<TCmd>;
  nodeTree: DOMNodeMetadata[];
  payload: UIEventPayload<EventFromCommand<TCmd>>;
  timestamp: number;
}

export type MessageHandler<TMessage extends UIEventMessage = UIEventMessage> = (
  message: TMessage
) => void | TMessage | null;