import { DestroyRef, Injector, TestBed } from '@angular/core';
import { Listener, broker } from './listener.decorator';

class HostWithInjector {
  public receivedMessage: any;
  public initCallCount = 0;
  public destroyCallCount = 0;
  public injector?: Injector;

  ngOnInit(): void {
    this.initCallCount += 1;
  }

  ngOnDestroy(): void {
    this.destroyCallCount += 1;
  }

  @Listener('on:click', 'host-with-injector')
  handle(message: any): void {
    this.receivedMessage = message;
  }
}

class HostWithoutInjector {
  public receivedMessage: any;
  public initCallCount = 0;
  public destroyCallCount = 0;

  ngOnInit(): void {
    this.initCallCount += 1;
  }

  ngOnDestroy(): void {
    this.destroyCallCount += 1;
  }

  @Listener('on:click', 'host-without-injector')
  handle(message: any): void {
    this.receivedMessage = message;
  }
}

describe('Listener', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should preserve ngOnInit and react to the broker message when an injector is available', () => {
    const host = new HostWithInjector();
    host.injector = TestBed.inject(Injector);

    host.ngOnInit();
    broker.create('host-with-injector').publish({ event: 'on:click', payload: { edge: true } });

    expect(host.initCallCount).toBe(1);
    expect(host.receivedMessage).toEqual({ event: 'on:click', payload: { edge: true } });

    host.ngOnDestroy();
    broker.create('host-with-injector').publish({ event: 'on:click', payload: { afterDestroy: true } });

    expect(host.destroyCallCount).toBe(1);
    expect(host.receivedMessage).toEqual({ event: 'on:click', payload: { edge: true } });
  });

  it('should fallback to manual destroy cleanup when no injector is present', () => {
    const host = new HostWithoutInjector();

    host.ngOnInit();
    broker.create('host-without-injector').publish({ event: 'on:click', payload: { edge: true } });

    expect(host.initCallCount).toBe(1);
    expect(host.receivedMessage).toEqual({ event: 'on:click', payload: { edge: true } });

    host.ngOnDestroy();
    broker.create('host-without-injector').publish({ event: 'on:click', payload: { afterDestroy: true } });

    expect(host.destroyCallCount).toBe(1);
    expect(host.receivedMessage).toEqual({ event: 'on:click', payload: { edge: true } });
  });
});
