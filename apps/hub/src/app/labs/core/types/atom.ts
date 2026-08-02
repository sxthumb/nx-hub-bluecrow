export interface DOMNodeMetadata {
  tagName: string;
  id?: string;
  className?: string;
}

export interface AtomEventPayloadMap {
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
  input: Event;
  change: Event;
  submit: SubmitEvent;
  pointerdown: PointerEvent;
  pointerup: PointerEvent;
  pointermove: PointerEvent;
  pointerenter: PointerEvent;
  pointerleave: PointerEvent;
  pointercancel: PointerEvent;
}

export type AtomEventName = keyof AtomEventPayloadMap;
export type AtomEventPayload<TEventName extends AtomEventName> = AtomEventPayloadMap[TEventName];

/**
 * Nome do comando publicado/assinado no broker para cada evento do Atom.
 * Derivado de AtomEventName, então cobre automaticamente todos os eventos
 * suportados: 'on:click' | 'on:dblclick' | 'on:keydown' | ... | 'on:pointercancel'.
 */
export type CommandType = `on:${AtomEventName}`;

export interface AtomEventMessage<TEventName extends AtomEventName = AtomEventName> {
  event: `on:${TEventName}`;
  nodeTree: DOMNodeMetadata[];
  data: AtomEventPayload<TEventName>;
}

/**
 * Envelope real devolvido pelo `@morgan-stanley/message-broker` no `subscribe`.
 * A lib não expõe esse shape publicamente, então tipamos aqui: o payload
 * publicado (no nosso caso, um AtomEventMessage) sempre vem dentro de `data`,
 * junto com metadados do próprio broker (canal, id, timestamp).
 */
export interface BrokerEnvelope<TPayload> {
  channelName: string;
  data: TPayload;
  id: string;
  timestamp: number;
  type?: string;
}

export type AtomBrokerEnvelope = BrokerEnvelope<AtomEventMessage>;