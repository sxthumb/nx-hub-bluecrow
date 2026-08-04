import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Atom } from './atom.directive';
import { Container } from '../container.directive';

@Component({
  selector: 'test-atom',
  template: '<span class="inner">atomic</span>',
  standalone: true,
})
class TestAtom extends Atom {}

@Component({
  selector: 'test-container-host',
  template: `
    <test-atom id="first"></test-atom>
    <test-atom id="second"></test-atom>
  `,
  standalone: true,
  imports: [TestAtom],
})
class TestContainerHostComponent extends Container {}

describe('Container', () => {
  let fixture: ComponentFixture<TestContainerHostComponent>;
  let component: TestContainerHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestContainerHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestContainerHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return a child atom by id and expose all children in order', () => {
    const first = component.atom('first');
    const second = component.atom('second');
    const all = component.atoms();

    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
    expect(all).toHaveLength(2);
    expect(all[0]).toBe(first);
    expect(all[1]).toBe(second);
  });

  it('should return undefined when the requested id does not exist', () => {
    expect(component.atom('missing-id')).toBeUndefined();
  });
});
