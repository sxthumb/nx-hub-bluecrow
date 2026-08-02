import { Directive, HostListener, signal } from '@angular/core';
import { Atom } from './atom.directive';

export type AtomImageLoading = 'eager' | 'lazy';

@Directive()
export abstract class AtomImage extends Atom<HTMLImageElement> {
  private readonly srcState = signal('');
  private readonly altState = signal('');
  private readonly widthState = signal(0);
  private readonly heightState = signal(0);
  private readonly loadingState = signal<AtomImageLoading>('eager');
  private readonly loaded = signal(false);
  private readonly errored = signal(false);

  set src(value: string) {
    this.nativeElement.src = value;
    this.srcState.set(value);
    this.loaded.set(false);
    this.errored.set(false);
  }

  get src(): string {
    return this.nativeElement.src || this.srcState();
  }

  set alt(value: string) {
    this.nativeElement.alt = value;
    this.altState.set(value);
  }

  get alt(): string {
    return this.nativeElement.alt || this.altState();
  }

  set width(value: number) {
    this.nativeElement.width = value;
    this.widthState.set(value);
  }

  get width(): number {
    return this.nativeElement.width || this.widthState();
  }

  set height(value: number) {
    this.nativeElement.height = value;
    this.heightState.set(value);
  }

  get height(): number {
    return this.nativeElement.height || this.heightState();
  }

  set loading(value: AtomImageLoading) {
    this.nativeElement.loading = value;
    this.loadingState.set(value);
  }

  get loading(): AtomImageLoading {
    return (this.nativeElement.loading as AtomImageLoading) ?? this.loadingState();
  }

  get isLoaded(): boolean {
    return this.loaded();
  }

  get hasError(): boolean {
    return this.errored();
  }

  get naturalWidth(): number {
    return this.nativeElement.naturalWidth;
  }

  get naturalHeight(): number {
    return this.nativeElement.naturalHeight;
  }

  @HostListener('load')
  onLoad(): void {
    this.loaded.set(true);
  }

  @HostListener('error')
  onError(): void {
    this.errored.set(true);
  }
}