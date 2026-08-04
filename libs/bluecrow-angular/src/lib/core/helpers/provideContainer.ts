import { Provider, Type, forwardRef } from '@angular/core';
import { Container } from '../directives';
import { provideUIContext } from './provideUIContext';

/**
 * Registers the component class as the Container provider for child injection context.
 */
export function provideContainer<T extends Container>(component: Type<T>): Provider {
  return provideUIContext(component);
}