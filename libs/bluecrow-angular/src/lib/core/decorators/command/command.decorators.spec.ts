jest.mock('@angular/core', () => ({
  inject: jest.fn(),
  runInInjectionContext: (_injector: unknown, fn: () => void) => fn(),
  DestroyRef: class DestroyRef {},
  Injector: class Injector {},
}));

jest.mock('@angular/common', () => ({
  DOCUMENT: Symbol('DOCUMENT'),
}));

jest.mock('../../directives/events/event', () => ({
  COMMAND_EVENT_MAP: {
    'on:click': { directive: class ClickDirective {}, handlerMethod: 'onClick' },
  },
  EventDirective: class EventDirective {},
}));

import { DOCUMENT } from '@angular/common';
import { DestroyRef } from '@angular/core';
import { of } from 'rxjs';
import { Command } from './command.decorator';
import { AsyncCommand } from './async-command.decorator';
import { CommandShortcut } from './shortcut-command.decorator';
import { AsyncCommandShortcut } from './async-shortcut-command.decorator';
import { COMMAND_EVENT_MAP } from '../../directives/events/event';

describe('command decorators', () => {
  const directiveInstance = {
    childId: '',
    registerCommandInterceptor: jest.fn(),
    dispatchUIEvent: jest.fn(),
  };

  const destroyRef = {
    onDestroy: jest.fn(),
  };

  const documentRef = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (require('@angular/core').inject as jest.Mock).mockImplementation((token: unknown) => {
      if (token === DOCUMENT) {
        return documentRef;
      }

      if (token === DestroyRef) {
        return destroyRef;
      }

      if (token === COMMAND_EVENT_MAP['on:click'].directive) {
        return directiveInstance;
      }

      return directiveInstance;
    });
  });

  it('should register a command interceptor and dispatch the result for @Command', () => {
    class TestHost {
      injector = {};
      id = () => 'atom-1';
      ngOnInit() {}
      handle(nativeEvent: unknown) {
        return { ok: true, nativeEvent };
      }
    }

    const descriptor = {
      value: TestHost.prototype.handle,
    } as TypedPropertyDescriptor<(nativeEvent: unknown) => unknown>;

    const decorated = Command('on:click')(TestHost.prototype, 'handle', descriptor);
    const instance = new TestHost();
    instance.ngOnInit();

    const interceptor = directiveInstance.registerCommandInterceptor.mock.calls[0][1];
    interceptor({ type: 'click' });

    expect(directiveInstance.registerCommandInterceptor).toHaveBeenCalledWith('on:click', expect.any(Function));
    expect(directiveInstance.dispatchUIEvent).toHaveBeenCalledWith('on:click', { ok: true, nativeEvent: { type: 'click' } });
    expect((decorated as TypedPropertyDescriptor<any>)?.value).toBe(descriptor.value);
  });

  it('should handle async command output and route valid values to the broker', () => {
    class TestHost {
      injector = {};
      id = () => 'atom-1';
      ngOnInit() {}
      handle() {
        return of({ ok: true });
      }
    }

    const descriptor = {
      value: TestHost.prototype.handle,
    } as TypedPropertyDescriptor<() => unknown>;

    AsyncCommand('on:click')(TestHost.prototype, 'handle', descriptor);
    const instance = new TestHost();
    instance.ngOnInit();

    const interceptor = directiveInstance.registerCommandInterceptor.mock.calls[0][1];
    interceptor({ type: 'click' });

    expect(directiveInstance.registerCommandInterceptor).toHaveBeenCalledWith('on:click', expect.any(Function));
    expect(directiveInstance.dispatchUIEvent).toHaveBeenCalledWith('on:click', { ok: true });
  });

  it('should parse a shortcut and bind both native and keyboard flows', () => {
    (require('@angular/core').inject as jest.Mock).mockImplementation((token: unknown) => {
      if (token === DOCUMENT) {
        return documentRef;
      }

      if (token === DestroyRef) {
        return destroyRef;
      }

      return directiveInstance;
    });

    class TestHost {
      injector = {};
      id = () => 'atom-1';
      ngOnInit() {}
      handle() {
        return { ok: true };
      }
    }

    const descriptor = {
      value: TestHost.prototype.handle,
    } as TypedPropertyDescriptor<() => unknown>;

    CommandShortcut('ctrl+k', 'on:click')(TestHost.prototype, 'handle', descriptor);
    const instance = new TestHost();
    instance.ngOnInit();

    expect(documentRef.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(directiveInstance.registerCommandInterceptor).toHaveBeenCalledWith('on:click', expect.any(Function));
  });

  it('should register a shortcut stream and dispatch its observable payload', () => {
    (require('@angular/core').inject as jest.Mock).mockImplementation((token: unknown) => {
      if (token === DOCUMENT) {
        return documentRef;
      }

      if (token === DestroyRef) {
        return destroyRef;
      }

      return directiveInstance;
    });

    class TestHost {
      injector = {};
      id = () => 'atom-1';
      ngOnInit() {}
      handle() {
        return of({ shortcut: true });
      }
    }

    const descriptor = {
      value: TestHost.prototype.handle,
    } as TypedPropertyDescriptor<() => unknown>;

    AsyncCommandShortcut('ctrl+k', 'on:click')(TestHost.prototype, 'handle', descriptor);
    const instance = new TestHost();
    instance.ngOnInit();

    expect(documentRef.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(directiveInstance.registerCommandInterceptor).toHaveBeenCalledWith('on:click', expect.any(Function));
    expect(directiveInstance.dispatchUIEvent).toHaveBeenCalledWith('on:click', { shortcut: true });
  });
});
