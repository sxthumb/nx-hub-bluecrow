import { Provider, Type, forwardRef } from '@angular/core';
import { Container } from '../directives';

/**
 * Registra a classe do componente como o provedor do token Container
 * para o contexto de injeção dos elementos filhos.
 */
export function provideContainer<T extends Container>(component: Type<T>): Provider {
  return {
    provide: Container,
    useExisting: forwardRef(() => component),
  };
}