import { ExistingProvider, Type, forwardRef } from '@angular/core';
import { UIContext } from '../directives/ui-context';

/**
 * Creates an existing-provider mapping that exposes the UI context token through the component.
 */
export function provideUIContext<T extends UIContext>(component: Type<T>): ExistingProvider {
  return {
    provide: UIContext,
    useExisting: forwardRef(() => component),
  };
}