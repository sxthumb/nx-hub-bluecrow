import {
  Directive,
  ElementRef,
  inject,
  input,
  Injector
} from '@angular/core';

import { AtomButtonType, AtomFormElement, AtomProps, ElementName } from '../../types';
import {
  ClickableEvent,
  ClipboardEventDirective,
  DragDropEventDirective,
  FocusableEvent,
  FormInputEventDirective,
  KeyboardEventDirective,
  MouseMotionEvent,
  PointerEventDirective,
  ScrollableEventDirective,
  SelectedEvent,
} from '../events/event';
import { RippleDirective } from '../ripple/ripple.directive';

// ---------------------------------------------------------------------------
// COMPOSIÇÕES DE EVENTOS POR VARIAÇÃO DE ATOM
// ---------------------------------------------------------------------------
// IMPORTANTE: hostDirectives NÃO é herdado entre classes no Angular (é
// comportamento oficial, não bug — confirmado pelo core team em
// https://github.com/angular/angular/issues/51203). Por isso essas listas
// não são declaradas aqui nas classes abstratas: elas só servem de
// referência reutilizável para você espalhar (`...ATOM_X_HOST_DIRECTIVES`)
// no `hostDirectives` do `@Component` CONCRETO que estende cada Atom.
//
// Também por padrão usamos sempre `on:focusin`/`on:focusout` no lugar de
// `on:focus`/`on:blur` puro — `focus`/`blur` não fazem bubbling, então se o
// elemento real (ex: <button hlmBtn>, <input hlmInput>) estiver dentro do
// template do componente e o hostDirectives estiver no host externo, o
// evento nunca chega. `focusin`/`focusout` resolvem isso de forma genérica
// pra qualquer estrutura de template.
// ---------------------------------------------------------------------------

/** button, [atom-button] */
export const ATOM_BUTTON_HOST_DIRECTIVES = [
  RippleDirective,
  ClickableEvent,
  FocusableEvent,
  MouseMotionEvent,
  KeyboardEventDirective, // Enter/Espaço ativam o botão via teclado
] as const;

/** input[type=text|email|password...], textarea */
export const ATOM_TEXT_FIELD_HOST_DIRECTIVES = [
  FormInputEventDirective, // input/change
  FocusableEvent,
  ClickableEvent,
  KeyboardEventDirective,
  ClipboardEventDirective, // copy/cut/paste
] as const;

/** input[type=checkbox|radio] */
export const ATOM_CHECKABLE_HOST_DIRECTIVES = [
  FormInputEventDirective, // change
  ClickableEvent,
  FocusableEvent,
  KeyboardEventDirective, // Espaço marca/desmarca
] as const;

/** select */
export const ATOM_SELECT_HOST_DIRECTIVES = [
  FormInputEventDirective, // change
  FocusableEvent,
  ClickableEvent,
  KeyboardEventDirective,
] as const;

/** a, [atom-link] */
export const ATOM_LINK_HOST_DIRECTIVES = [
  ClickableEvent,
  FocusableEvent,
  KeyboardEventDirective,
  PointerEventDirective,
] as const;

/** span, p, div, label — texto estático/selecionável, sem foco por padrão */
export const ATOM_TEXTUAL_HOST_DIRECTIVES = [
  ClickableEvent,
  SelectedEvent, // seleção de texto pelo usuário
  PointerEventDirective,
] as const;

/** div com overflow, painéis roláveis */
export const ATOM_SCROLLABLE_HOST_DIRECTIVES = [
  ScrollableEventDirective,
  PointerEventDirective,
] as const;

/** elementos arrastáveis / dropzones (upload, reorder, etc) */
export const ATOM_DRAGGABLE_HOST_DIRECTIVES = [
  DragDropEventDirective,
  PointerEventDirective,
  ClickableEvent,
] as const;

/** img */
export const ATOM_IMAGE_HOST_DIRECTIVES = [
  ClickableEvent,
  PointerEventDirective,
  DragDropEventDirective, // arrastar imagem (ex: reorder de galeria)
] as const;

@Directive()
export abstract class Atom<TElement extends HTMLElement = HTMLElement> implements AtomProps<TElement> {
  protected readonly elementRef = inject<ElementRef<TElement>>(ElementRef);
  readonly id = input('', { alias: 'id' });
  protected readonly injector = inject(Injector);

  get nativeElement(): TElement {
    return this.elementRef.nativeElement;
  }

  get tagName(): ElementName {
    return this.nativeElement.tagName.toLowerCase() as ElementName;
  }

  get className(): string {
    return this.nativeElement.className;
  }
}

@Directive({
  hostDirectives: [...ATOM_BUTTON_HOST_DIRECTIVES]
})
export abstract class AtomButton extends Atom<HTMLButtonElement> {

  get text(): string {
    return this.nativeElement.textContent ?? '';
  }

  set text(val: string) {
    this.nativeElement.textContent = val;
  }

  get disabled(): boolean {
    return this.nativeElement.disabled;
  }

  set disabled(val: boolean) {
    this.nativeElement.disabled = val;
  }

  get type(): AtomButtonType {
    return (this.nativeElement.type as any) ?? 'button';
  }

  set type(val: AtomButtonType) {
    this.nativeElement.type = val;
  }
}

/**
 * span, p, div, label — texto estático/selecionável
 * Use com ATOM_TEXTUAL_HOST_DIRECTIVES no componente concreto.
 */
@Directive()
export abstract class AtomTextual<TText extends HTMLElement = HTMLElement> extends Atom<TText> {

  get text(): string {
    return this.nativeElement.textContent ?? '';
  }

  set text(val: string) {
    this.nativeElement.textContent = val;
  }

  get innerHTML(): string {
    return this.nativeElement.innerHTML;
  }

  set innerHTML(val: string) {
    this.nativeElement.innerHTML = val;
  }
}

@Directive()
export abstract class AtomControl<TControl extends AtomFormElement = HTMLInputElement> extends Atom<TControl> {

  get value(): string {
    return this.nativeElement.value ?? '';
  }

  set value(val: string) {
    this.nativeElement.value = val;
  }

  get disabled(): boolean {
    return this.nativeElement.disabled;
  }

  set disabled(val: boolean) {
    this.nativeElement.disabled = val;
  }

  clear(): void {
    this.value = '';
  }

  focus(): void {
    this.nativeElement.focus();
  }
}

/**
 * input[type=text|email|password|search|number|url|tel], textarea
 * Use com ATOM_TEXT_FIELD_HOST_DIRECTIVES no componente concreto.
 */
@Directive()
export abstract class AtomTextField<
  TField extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement
> extends AtomControl<TField> {

  get placeholder(): string {
    return this.nativeElement.placeholder ?? '';
  }

  set placeholder(val: string) {
    this.nativeElement.placeholder = val;
  }

  get readonly(): boolean {
    return this.nativeElement.readOnly;
  }

  set readonly(val: boolean) {
    this.nativeElement.readOnly = val;
  }

  get maxLength(): number {
    return this.nativeElement.maxLength;
  }

  set maxLength(val: number) {
    this.nativeElement.maxLength = val;
  }

  select(): void {
    this.nativeElement.select();
  }
}

/**
 * input[type=checkbox|radio]
 * Use com ATOM_CHECKABLE_HOST_DIRECTIVES no componente concreto.
 */
@Directive()
export abstract class AtomCheckable extends AtomControl<HTMLInputElement> {

  get checked(): boolean {
    return this.nativeElement.checked;
  }

  set checked(val: boolean) {
    this.nativeElement.checked = val;
  }

  get indeterminate(): boolean {
    return this.nativeElement.indeterminate;
  }

  set indeterminate(val: boolean) {
    this.nativeElement.indeterminate = val;
  }

  toggle(): void {
    this.checked = !this.checked;
  }
}

/**
 * select
 * Use com ATOM_SELECT_HOST_DIRECTIVES no componente concreto.
 */
@Directive()
export abstract class AtomSelect extends AtomControl<HTMLSelectElement> {

  get selectedIndex(): number {
    return this.nativeElement.selectedIndex;
  }

  set selectedIndex(val: number) {
    this.nativeElement.selectedIndex = val;
  }

  get multiple(): boolean {
    return this.nativeElement.multiple;
  }

  set multiple(val: boolean) {
    this.nativeElement.multiple = val;
  }
}

/**
 * a, [atom-link]
 * Use com ATOM_LINK_HOST_DIRECTIVES no componente concreto.
 */
@Directive()
export abstract class AtomLink extends Atom<HTMLAnchorElement> {

  get text(): string {
    return this.nativeElement.textContent ?? '';
  }

  set text(val: string) {
    this.nativeElement.textContent = val;
  }

  get href(): string {
    return this.nativeElement.href;
  }

  set href(val: string) {
    this.nativeElement.href = val;
  }

  get target(): string {
    return this.nativeElement.target;
  }

  set target(val: string) {
    this.nativeElement.target = val;
  }
}

/**
 * div/section com overflow, painéis roláveis, listas virtualizadas
 * Use com ATOM_SCROLLABLE_HOST_DIRECTIVES no componente concreto.
 */
@Directive()
export abstract class AtomScrollable<TScroll extends HTMLElement = HTMLDivElement> extends Atom<TScroll> {

  get scrollTop(): number {
    return this.nativeElement.scrollTop;
  }

  set scrollTop(val: number) {
    this.nativeElement.scrollTop = val;
  }

  get scrollLeft(): number {
    return this.nativeElement.scrollLeft;
  }

  set scrollLeft(val: number) {
    this.nativeElement.scrollLeft = val;
  }

  scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
    this.nativeElement.scrollTo({ top: 0, behavior });
  }
}

/**
 * img
 * Use com ATOM_IMAGE_HOST_DIRECTIVES no componente concreto.
 */
@Directive()
export abstract class AtomImage extends Atom<HTMLImageElement> {

  get src(): string {
    return this.nativeElement.src;
  }

  set src(val: string) {
    this.nativeElement.src = val;
  }

  get alt(): string {
    return this.nativeElement.alt;
  }

  set alt(val: string) {
    this.nativeElement.alt = val;
  }
}