import { Directive, signal } from '@angular/core';
import { Atom } from './atom.directive';

export type AtomFormMethod = 'get' | 'post' | 'dialog';
export type AtomFormEncType =
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'text/plain';
export type AtomFormTarget = '_self' | '_blank' | '_parent' | '_top' | (string & {});

@Directive()
export abstract class AtomForm extends Atom<HTMLFormElement> {
  private readonly actionState = signal('');
  private readonly methodState = signal<AtomFormMethod>('get');
  private readonly nameState = signal('');
  private readonly encTypeState = signal<AtomFormEncType>('application/x-www-form-urlencoded');
  private readonly targetState = signal<AtomFormTarget>('_self');
  private readonly noValidateState = signal(false);

  set action(value: string) {
    this.nativeElement.action = value;
    this.actionState.set(value);
  }

  get action(): string {
    return this.nativeElement.action || this.actionState();
  }

  set method(value: AtomFormMethod) {
    this.nativeElement.method = value;
    this.methodState.set(value);
  }

  get method(): AtomFormMethod {
    return (this.nativeElement.method as AtomFormMethod) ?? this.methodState();
  }

  set name(value: string) {
    this.nativeElement.name = value;
    this.nameState.set(value);
  }

  get name(): string {
    return this.nativeElement.name || this.nameState();
  }

  set encType(value: AtomFormEncType) {
    this.nativeElement.enctype = value;
    this.encTypeState.set(value);
  }

  get encType(): AtomFormEncType {
    return (this.nativeElement.enctype as AtomFormEncType) ?? this.encTypeState();
  }

  set target(value: AtomFormTarget) {
    this.nativeElement.target = value;
    this.targetState.set(value);
  }

  get target(): AtomFormTarget {
    return (this.nativeElement.target as AtomFormTarget) || this.targetState();
  }

  set noValidate(value: boolean) {
    this.nativeElement.noValidate = value;
    this.noValidateState.set(value);
  }

  get noValidate(): boolean {
    return this.nativeElement.noValidate ?? this.noValidateState();
  }

  checkValidity(): boolean {
    return this.nativeElement.checkValidity();
  }

  reportValidity(): boolean {
    return this.nativeElement.reportValidity();
  }

  reset(): void {
    this.nativeElement.reset();
  }

  submitForm(): void {
    this.nativeElement.requestSubmit();
  }
}