import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RippleDirective } from './ripple.directive';

@Component({
  selector: 'test-ripple-host',
  template: '<button sxRipple>Click me</button>',
  standalone: true,
  imports: [RippleDirective],
})
class RippleHostComponent {}

describe('RippleDirective', () => {
  let fixture: ComponentFixture<RippleHostComponent>;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RippleHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RippleHostComponent);
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  });

  it('should replace an existing ripple element with a new one when clicked repeatedly', () => {
    const originalRect = {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect;

    vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(originalRect);

    button.dispatchEvent(new MouseEvent('click', { clientX: 20, clientY: 10, bubbles: true }));
    button.dispatchEvent(new MouseEvent('click', { clientX: 30, clientY: 20, bubbles: true }));

    const ripples = button.querySelectorAll('.ripple');
    expect(ripples).toHaveLength(1);

    const ripple = ripples[0] as HTMLElement;
    expect(ripple.style.width).toBe('0px');
    expect(ripple.style.height).toBe('0px');
    expect(ripple.style.left).toBe('0px');
    expect(ripple.style.top).toBe('0px');

    ripple.dispatchEvent(new AnimationEvent('animationend'));
    expect(button.querySelector('.ripple')).toBeNull();
  });
});
