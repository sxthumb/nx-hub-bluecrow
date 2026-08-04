import { Directive, viewChildren } from '@angular/core';
import { Atom } from '../atoms';
import { UIContext } from '../ui-context';

@Directive()
export abstract class Container implements UIContext {
  private readonly children = viewChildren(Atom);
  private _id: string = crypto.randomUUID();

  get id() {
    return this._id;
  }

  atom<T extends Atom = Atom>(id: string): T | undefined {
    return this.children().find(el => el.id() === id) as T | undefined;
  }

  atoms(): readonly Atom[] {
    return this.children();
  }
}