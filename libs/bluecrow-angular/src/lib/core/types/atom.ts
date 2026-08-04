import { ElementName } from ".";

export interface AtomProps<TElement extends HTMLElement = HTMLElement> {
  readonly nativeElement: TElement;
  readonly tagName: ElementName;
  readonly className: string;
}
export type AtomButtonType = 'button' | 'submit' | 'reset';
export type AtomFormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;