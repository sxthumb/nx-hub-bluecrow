import {
  Component,
} from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { AtomButton, RippleDirective } from '../../../core/directives';

@Component({
  selector: 'sx-button',
  imports: [HlmButtonImports, RippleDirective],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  providers: [
    { provide: AtomButton, useExisting: Button }
  ]
})
export class Button extends AtomButton {
  override onClick(event: MouseEvent): void {
    if (this.disabled) {
      return;
    }
    super.onClick(event);
  }
}