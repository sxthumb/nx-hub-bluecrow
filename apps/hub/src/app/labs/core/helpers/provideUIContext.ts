import { ExistingProvider, Type, forwardRef } from '@angular/core';
import { UIContext } from '../directives/ui-context';

export function provideUIContext<T extends UIContext>(component: Type<T>): ExistingProvider {
  return {
    provide: UIContext,
    useExisting: forwardRef(() => component),
  };
}