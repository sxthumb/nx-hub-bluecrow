jest.mock('@angular/core', () => ({
  forwardRef: (fn: () => unknown) => fn,
}));

jest.mock('../directives', () => ({
  Atom: class Atom {},
  Container: class Container {},
  UIContext: class UIContext {},
}));

jest.mock('./provideUIContext', () => ({
  provideUIContext: jest.fn((component: unknown) => ({
    provide: 'UIContext',
    useExisting: component,
  })),
}));

import { Atom, Container, UIContext } from '../directives';
import { provideAtom, provideContainer, provideUIContext } from './index';
import { createUIEventMessage } from './ui-event.factory';

describe('core helpers', () => {
  it('should create an Atom provider that resolves to the component class', () => {
    class TestAtom extends Atom {}

    const provider = provideAtom(TestAtom);

    expect(provider.provide).toBe(Atom);
    expect(provider.useExisting).toEqual(expect.any(Function));
  });

  it('should create a Container provider using the UI context bridge', () => {
    class TestContainer extends Container {}

    const provider = provideContainer(TestContainer);

    expect(provider.provide).toBe('UIContext');
    expect(provider.useExisting).toBe(TestContainer);
  });

  it('should create a UI context provider mapping', () => {
    class TestContext extends UIContext {}

    const provider = provideUIContext(TestContext);

    expect(provider.provide).toBe('UIContext');
    expect(provider.useExisting).toBe(TestContext);
  });

  it('should normalize command payloads into UI event messages', () => {
    const message = createUIEventMessage('on:click', { target: null } as unknown as MouseEvent, [
      { tagName: 'button', id: 'save', className: 'primary' },
    ]);

    expect(message.command).toBe('on:click');
    expect(message.eventName).toBe('click');
    expect(message.nodeTree).toEqual([
      { tagName: 'button', id: 'save', className: 'primary' },
    ]);
    expect(message.timestamp).toEqual(expect.any(Number));
  });
});
