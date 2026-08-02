import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Atom } from './atom.directive';
import { globalBroker } from '../../decorators';

@Component({
  selector: 'test-atom',
  template: '<span class="inner">atomic</span>',
  standalone: true,
})
class TestAtom extends Atom {}

@Component({
  selector: 'test-atom-host',
  template: `
    <section id="parent-node" class="parent-node">
      <test-atom id="edge-atom" class="node-class"></test-atom>
    </section>
  `,
  standalone: true,
  imports: [TestAtom],
})
class TestAtomHostComponent {}

describe('Atom', () => {
  let fixture: ComponentFixture<TestAtomHostComponent>;
  let component: TestAtom;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAtomHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestAtomHostComponent);
    fixture.detectChanges();
    component = fixture.debugElement.query(By.directive(TestAtom)).componentInstance;
  });

  it('should expose the default text content and allow updating it', () => {
    expect(component.getTextContent()).toBe("I'm an Atom!");

    component.updateTextContent('edge-case text');

    expect(component.getTextContent()).toBe('edge-case text');
  });

  it('should publish click metadata using the parent-node tree and payload from the event', () => {
    const receivedMessages: any[] = [];
    const subscription = globalBroker.get('edge-atom' as any).subscribe((message) => receivedMessages.push(message));

    const hostElement = fixture.nativeElement.querySelector('test-atom') as HTMLElement;
    const pointerEvent = new PointerEvent('click', {
      clientX: 30,
      clientY: 40,
      bubbles: true,
    });

    hostElement.dispatchEvent(pointerEvent);

    expect(receivedMessages).toHaveLength(1);
    expect(receivedMessages[0]).toMatchObject({
      event: 'on:click',
      data: pointerEvent,
    });
    expect(receivedMessages[0].nodeTree).toEqual([
      expect.objectContaining({ tagName: 'test-atom', id: 'edge-atom', className: 'node-class' }),
      expect.objectContaining({ tagName: 'section', id: 'parent-node', className: 'parent-node' }),
    ]);

    subscription.unsubscribe();
  });
});
