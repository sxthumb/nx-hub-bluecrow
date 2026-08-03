import { Component } from '@angular/core';
import { Button } from '../../ixd/atoms/button/button';
import { Command } from '../../core/decorators';
import { Container } from '../../core/directives';
import { provideContainer } from '../../core/helpers';

@Component({
  imports: [Button],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  providers: [provideContainer(Hero)],
})
export class Hero extends Container {
  ngAfterViewInit(): void {
    this.atom('button-outline')?.updateTextContent("I'm a button now!");
  }

  @Command('on:click', 'button-outline')
  buttonClick(message: any) {
    console.log('Clicou em mim! Dados da mensagem:', message);
  }
}
