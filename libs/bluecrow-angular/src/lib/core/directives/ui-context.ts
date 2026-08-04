import { Directive, Signal } from '@angular/core';

@Directive()
export abstract class UIContext {
  /**
   * Identificador do contexto pai (ex: 'user-form', 'header-container')
   */
  abstract readonly id: string | Signal<string>;
}