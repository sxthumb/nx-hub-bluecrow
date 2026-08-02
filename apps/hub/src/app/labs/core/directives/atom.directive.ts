import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  signal
} from '@angular/core';
import { globalBroker } from '../decorators';

export interface DOMNodeMetadata {
  tagName: string;
  id?: string;
  className?: string;
}

export type AtomElementName = keyof HTMLElementTagNameMap;

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

export interface AtomProps<TElement extends HTMLElement = HTMLElement> {
  readonly nativeElement: TElement;
  readonly tagName: AtomElementName;
  readonly className: string;
  readonly text: string;
}

@Directive()
export abstract class Atom<TElement extends HTMLElement = HTMLElement> implements AtomProps<TElement> {
  private readonly elementRef = inject<ElementRef<TElement>>(ElementRef);

  readonly id = input('', { alias: 'id' });
  private readonly textContent = signal("I'm an Atom!");

  get nativeElement(): TElement {
    return this.elementRef.nativeElement;
  }

  get tagName(): AtomElementName {
    return this.nativeElement.tagName.toLowerCase() as AtomElementName;
  }

  get className(): string {
    return this.nativeElement.className;
  }

  set text(value: string) {
    this.nativeElement.textContent = value;
    this.textContent.set(value);
  }

  get text(): string {
    return this.nativeElement.textContent ?? this.textContent();
  }

  updateTextContent(value: string): void {
    this.nativeElement.textContent = value;
    this.textContent.set(value);
  }

  getTextContent(): string {
    return this.textContent();
  }

  protected publishEvent<TEventName extends AtomEventName>(
    eventName: TEventName,
    data: AtomEventPayload<TEventName>
  ): void {
    globalBroker.create(this.id()).publish({
      event: `on:${eventName}`,
      nodeTree: this.getParentNodeTree(),
      data
    });
  }

  private getParentNodeTree(): DOMNodeMetadata[] {
    const tree: DOMNodeMetadata[] = [];
    let current: Node | null = this.nativeElement;

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

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.publishEvent('click', event);
  }

  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: MouseEvent): void {
    this.publishEvent('dblclick', event);
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    this.publishEvent('contextmenu', event);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    this.publishEvent('mousedown', event);
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    this.publishEvent('mouseup', event);
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent): void {
    this.publishEvent('mouseenter', event);
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent): void {
    this.publishEvent('mouseleave', event);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.publishEvent('mousemove', event);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    this.publishEvent('keydown', event);
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    this.publishEvent('keyup', event);
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    this.publishEvent('keypress', event);
  }

  @HostListener('focus', ['$event'])
  onFocus(event: FocusEvent): void {
    this.publishEvent('focus', event);
  }

  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent): void {
    this.publishEvent('blur', event);
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    this.publishEvent('input', event);
  }

  @HostListener('change', ['$event'])
  onChange(event: Event): void {
    this.publishEvent('change', event);
  }

  @HostListener('submit', ['$event'])
  onSubmit(event: SubmitEvent): void {
    this.publishEvent('submit', event);
  }

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    this.publishEvent('pointerdown', event);
  }

  @HostListener('pointerup', ['$event'])
  onPointerUp(event: PointerEvent): void {
    this.publishEvent('pointerup', event);
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    this.publishEvent('pointermove', event);
  }

  @HostListener('pointerenter', ['$event'])
  onPointerEnter(event: PointerEvent): void {
    this.publishEvent('pointerenter', event);
  }

  @HostListener('pointerleave', ['$event'])
  onPointerLeave(event: PointerEvent): void {
    this.publishEvent('pointerleave', event);
  }

  @HostListener('pointercancel', ['$event'])
  onPointerCancel(event: PointerEvent): void {
    this.publishEvent('pointercancel', event);
  }
}