import { Component } from '@angular/core';
import { Button } from '../../ixd/atoms/button/button';
import { Listener } from '../../core/decorators';
import { Container } from '../../core/directives';
import { provideContainer } from '../../core/helpers';
import { UIEventMessage } from '../../core/types';

@Component({
  imports: [Button],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  providers: [provideContainer(Hero)],
})
export class Hero extends Container {

  @Listener('on:click', 'button-outline')
  onSaveClicked(message: UIEventMessage) {
    console.log('Hero recebeu o evento pós-debounce:', message.payload);
  }

  @Listener('on:mouseenter', 'button-outline')
  onMouseEnter(message: UIEventMessage) {
    console.log('Hero recebeu o evento de mouse enter:', message.payload);
  }
}
