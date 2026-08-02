import { 
  Component,
} from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { Atom, RippleDirective } from '../../../core/directives';

@Component({
  selector: 'sx-button',
  imports: [HlmButtonImports, RippleDirective],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  providers: [
    { provide: Atom, useExisting: Button }
  ]
})
export class Button extends Atom {
  override onClick(btn: PointerEvent): void {
    super.onClick(btn);
  }
}