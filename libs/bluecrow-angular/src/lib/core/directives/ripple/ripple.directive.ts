import {  
  Directive, 
  ElementRef, 
  inject, 
  Renderer2, 
} from '@angular/core';

@Directive({
  selector: '[sxRipple]',
  host: {
    '(click)': 'onHostClick($event)'
  }
})
export class RippleDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  onHostClick(event: MouseEvent) {
    const button = this.elementRef.nativeElement;

    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
      this.renderer.removeChild(button, existingRipple);
    }

    const rect = button.getBoundingClientRect();
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    const x = event.clientX - rect.left - radius;
    const y = event.clientY - rect.top - radius;

    const circle = this.renderer.createElement('span');
    this.renderer.addClass(circle, 'ripple');
    this.renderer.setStyle(circle, 'width', `${diameter}px`);
    this.renderer.setStyle(circle, 'height', `${diameter}px`);
    this.renderer.setStyle(circle, 'left', `${x}px`);
    this.renderer.setStyle(circle, 'top', `${y}px`);

    this.renderer.appendChild(button, circle);
    
    circle.addEventListener('animationend', () => {
      this.renderer.removeChild(button, circle);
    }, { once: true });
  }
}