import { Provider, Type, AbstractType, forwardRef } from '@angular/core';
import { Atom } from '../directives';

/**
 * Registers the component as the provider for the Atom token in the current DI context.
 */
export function provideAtom<T extends Atom>(
  component: Type<T>,
  token?: Type<Atom> | AbstractType<Atom>
): Provider {
  return {
    provide: token || Atom,
    useExisting: forwardRef(() => component),
  };
}