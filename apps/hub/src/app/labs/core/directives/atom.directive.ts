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

@Directive()
export abstract class Atom {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly id = input('', { alias: 'id' });
  private textContent = signal("I'm an Atom!");

  get nativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  updateTextContent(value: string) {
    this.textContent.set(value);
  }

  getTextContent() {
    return this.textContent();
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
    onClick(btn: PointerEvent): void {
      globalBroker.create(this.id()).publish({
        event: 'on:click',
        nodeTree: this.getParentNodeTree(),
        data: btn
      });
    }
}