import {
  Component,
} from '@angular/core';
import { AtomButton, Command, provideAtom } from '@bluecrow-angular/core';
import { AsyncCommandShortcut } from '@bluecrow-angular/core/decorators/command/async-shortcut-command.decorator';
import { CommandShortcut } from '@bluecrow-angular/core/decorators/command/shortcut-command.decorator';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { debounceTime, map, Observable } from 'rxjs';

@Component({
  selector: 'sx-button',
  imports: [HlmButtonImports],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  providers: [provideAtom(Button, AtomButton)]
})
export class Button extends AtomButton {

  @Command('on:focusin')
  onFocus(event: FocusEvent) {
    console.log('Button focused:', event);
    return event;
  }

  @Command('on:mouseenter')
  onMouseEnter(event: MouseEvent) {
    console.log('Mouse entered button:', event);
    return event;
  }
  
  // Dispara ao CLICAR com o mouse OU ao apertar ALT+M (de qualquer lugar)
  @CommandShortcut('alt+m', 'on:click')
  onClick(event: MouseEvent | KeyboardEvent) {
    console.log('Disparado por clique ou atalho Alt+M:', event);
    return event;
  }

  // Funciona do mesmo jeito para o fluxo reativo (RxJS)
  @AsyncCommandShortcut('alt+s', 'on:click')
  onClickAsync(events$: Observable<MouseEvent | KeyboardEvent>): Observable<any> {
    return events$.pipe(
      debounceTime(300),
      map(event => ({ type: event.type, target: event.target }))
    );
  }
}