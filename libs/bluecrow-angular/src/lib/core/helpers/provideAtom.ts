import { Provider, Type, AbstractType, forwardRef } from '@angular/core';
import { Atom } from '../directives';

/**
 * Registra o componente no contexto do Atom (ou sub-classes abstratas como AtomButton).
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