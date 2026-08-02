import { Directive, signal } from '@angular/core';
import { Atom } from './atom.directive';

export type AtomButtonType = 'button' | 'submit' | 'reset';

@Directive()
export abstract class AtomButton extends Atom<HTMLButtonElement> {
  private readonly disabledState = signal(false);
  private readonly typeState = signal<AtomButtonType>('button');
  private readonly nameState = signal('');
  private readonly valueState = signal('');

  set disabled(value: boolean) {
    this.nativeElement.disabled = value;
    this.disabledState.set(value);
  }

  get disabled(): boolean {
    return this.nativeElement.disabled ?? this.disabledState();
  }

  set type(value: AtomButtonType) {
    this.nativeElement.type = value;
    this.typeState.set(value);
  }

  get type(): AtomButtonType {
    return (this.nativeElement.type as AtomButtonType) ?? this.typeState();
  }

  set name(value: string) {
    this.nativeElement.name = value;
    this.nameState.set(value);
  }

  get name(): string {
    return this.nativeElement.name || this.nameState();
  }

  set value(value: string) {
    this.nativeElement.value = value;
    this.valueState.set(value);
  }

  get value(): string {
    return this.nativeElement.value || this.valueState();
  }

  toggleDisabled(): void {
    this.disabled = !this.disabled;
  }
}