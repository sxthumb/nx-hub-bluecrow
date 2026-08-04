# Atoms e Containers

## `Atom`: a unidade base de UI

`Atom` é a classe abstrata que todo elemento de UI da lib estende (`AtomButton`, `AtomTextField`, `AtomCheckable`, `AtomSelect`, `AtomLink`, `AtomTextual`, `AtomScrollable`, `AtomImage`). Ela expõe o `ElementRef` nativo e um `id` como Angular `input()` (signal-based):

```ts
@Directive()
export abstract class Atom<TElement extends HTMLElement = HTMLElement> implements AtomProps<TElement> {
  protected readonly elementRef = inject<ElementRef<TElement>>(ElementRef);
  readonly id = input('', { alias: 'id' });
  ...
}
```

Cada variação concreta (`AtomButton`, `AtomTextField`...) adiciona getters/setters específicos do elemento HTML que ela representa — `AtomButton.disabled` reflete `HTMLButtonElement.disabled`, `AtomCheckable.checked` reflete `HTMLInputElement.checked`, e assim por diante. É uma camada fina de tipagem sobre a API nativa do DOM, não uma reimplementação.

## Composições de eventos por variação

Cada tipo de átomo precisa de um conjunto diferente de directivas de evento hospedadas (`ClickableEvent`, `FocusableEvent`, `KeyboardEventDirective`...). Essas combinações vivem como constantes exportadas, por exemplo:

```ts
export const ATOM_BUTTON_HOST_DIRECTIVES = [
  RippleDirective,
  ClickableEvent,
  FocusableEvent,
  MouseMotionEvent,
  KeyboardEventDirective, // Enter/Espaço ativam o botão via teclado
] as const;
```

### Por que isso não está dentro da classe abstrata

`hostDirectives` **não é herdado** entre classes no Angular — é comportamento oficial confirmado pelo core team ([angular/angular#51203](https://github.com/angular/angular/issues/51203)), não um bug do projeto. Por isso as constantes `ATOM_*_HOST_DIRECTIVES` existem separadas: elas precisam ser espalhadas manualmente (`...ATOM_BUTTON_HOST_DIRECTIVES`) no `hostDirectives` do `@Component` **concreto**, não da classe abstrata que ele estende.

### `focusin`/`focusout`, não `focus`/`blur`

Por padrão, as composições usam `on:focusin`/`on:focusout` em vez de `on:focus`/`on:blur`. Motivo: `focus`/`blur` não fazem bubbling. Se o elemento real (`<button hlmBtn>`, `<input hlmInput>`) está dentro do template do componente enquanto o `hostDirectives` escuta no host externo, o evento puro nunca chegaria. `focusin`/`focusout` fazem bubbling e resolvem isso de forma genérica, independente da estrutura interna do template.

## `Container`: o contexto pai

```ts
@Directive()
export abstract class Container implements UIContext {
  private readonly children = viewChildren(Atom);
  private _id: string = crypto.randomUUID();

  get id() { return this._id; }

  atom<T extends Atom = Atom>(id: string): T | undefined {
    return this.children().find(el => el.id() === id) as T | undefined;
  }

  atoms(): readonly Atom[] {
    return this.children();
  }
}
```

Um `Container` gera um `id` único (`crypto.randomUUID()`) automaticamente no momento da construção — não precisa ser passado manualmente. Esse `id` é o que forma a primeira metade do `channelId` do broker (`${containerId}:${atomId}`).

`children` usa `viewChildren(Atom)` — a API baseada em signals do Angular, que popula reativamente conforme o template renderiza. Isso significa que `container.atoms()` reflete o estado atual da view em tempo real, sem precisar de `AfterViewInit` manual ou `QueryList.changes.subscribe()`.

### Implicação prática

Como `viewChildren` é populado *depois* da view inicializar, existe uma janela entre o primeiro render e o `ngAfterViewInit` (implícito no signal) onde `container.atoms()` pode não refletir o total final de filhos ainda. Isso raramente importa para o fluxo de eventos (que depende do broker, não de `atoms()`), mas é relevante se você usa `container.atom(id)` para acessar um átomo específico imperativamente logo na inicialização.