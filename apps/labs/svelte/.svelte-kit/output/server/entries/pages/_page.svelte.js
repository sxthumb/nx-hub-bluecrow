import { a5 as attributes, a6 as clsx, a7 as ensure_array_like, a8 as element, a9 as spread_props, e as escape_html, a4 as derived } from "../../chunks/index.js";
import { cva } from "class-variance-authority";
import { clsx as clsx$1 } from "clsx";
import { twMerge } from "tailwind-merge";
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function Icon($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const {
      name,
      color = "currentColor",
      size = 24,
      strokeWidth = 2,
      absoluteStrokeWidth = false,
      iconNode = [],
      children,
      $$slots,
      $$events,
      ...props
    } = $$props;
    $$renderer2.push(`<svg${attributes(
      {
        ...defaultAttributes,
        ...props,
        width: size,
        height: size,
        stroke: color,
        "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        class: clsx(["lucide-icon lucide", name && `lucide-${name}`, props.class])
      },
      void 0,
      void 0,
      void 0,
      3
    )}><!--[-->`);
    const each_array = ensure_array_like(iconNode);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [tag, attrs] = each_array[$$index];
      element($$renderer2, tag, () => {
        $$renderer2.push(`${attributes({ ...attrs }, void 0, void 0, void 0, 3)}`);
      });
    }
    $$renderer2.push(`<!--]-->`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></svg>`);
  });
}
function Arrow_right($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M5 12h14" }],
      ["path", { "d": "m12 5 7 7-7 7" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "arrow-right" },
      /**
       * @component @name ArrowRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KICA8cGF0aCBkPSJtMTIgNSA3IDctNyA3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/arrow-right
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function cn(...inputs) {
  return twMerge(clsx$1(inputs));
}
function Button($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50", {
      variants: {
        variant: {
          default: "bg-slate-900 text-white hover:bg-slate-800",
          secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
          outline: "border border-slate-300 bg-transparent hover:bg-slate-100",
          ghost: "hover:bg-slate-100 hover:text-slate-900"
        },
        size: {
          default: "h-10 px-4 py-2",
          sm: "h-9 rounded-md px-3",
          lg: "h-11 rounded-md px-8",
          icon: "size-10"
        }
      },
      defaultVariants: { variant: "default", size: "default" }
    });
    let {
      children,
      class: className = "",
      variant = "default",
      size = "default",
      $$slots,
      $$events,
      ...rest
    } = $$props;
    $$renderer2.push(`<button${attributes({
      class: clsx(cn(buttonVariants({ variant, size }), className)),
      ...rest
    })}>`);
    children?.($$renderer2);
    $$renderer2.push(`<!----></button>`);
  });
}
function _page($$renderer) {
  let count = 0;
  let statusText = derived(() => count > 10 ? "Meta atingida!" : "Em progresso...");
  function increment() {
    count += 1;
  }
  function reset() {
    count = 0;
  }
  $$renderer.push(`<div class="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 antialiased"><div class="w-full max-w-3xl space-y-6 rounded-xl border bg-card p-6 shadow-sm"><div class="space-y-2"><span class="w-fit rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">shadcn + tailwindcss</span> <h3 class="text-2xl font-semibold leading-none tracking-tight">Painel Bluecrow</h3> <p class="text-sm text-muted-foreground">Demonstração de estado reativo com Svelte 5 Runes e Shadcn.</p></div> <div class="rounded-lg border bg-muted/40 p-4 text-center space-y-1"><span class="text-xs font-medium uppercase text-muted-foreground tracking-wider">Contador</span> <div class="text-4xl font-extrabold tracking-tight">${escape_html(count)}</div> <p class="text-xs text-muted-foreground font-medium pt-1">${escape_html(statusText())}</p></div> <div class="flex flex-wrap items-center gap-3">`);
  Button($$renderer, {
    variant: "default",
    onclick: increment,
    children: ($$renderer2) => {
      $$renderer2.push(`<!---->Incrementar`);
    },
    $$slots: { default: true }
  });
  $$renderer.push(`<!----> `);
  Button($$renderer, {
    variant: "outline",
    onclick: reset,
    children: ($$renderer2) => {
      $$renderer2.push(`<!---->Resetar`);
    },
    $$slots: { default: true }
  });
  $$renderer.push(`<!----> `);
  Button($$renderer, {
    variant: "ghost",
    size: "icon",
    "aria-label": "Go to next step",
    children: ($$renderer2) => {
      Arrow_right($$renderer2, { class: "size-4" });
    },
    $$slots: { default: true }
  });
  $$renderer.push(`<!----></div></div></div>`);
}
export {
  _page as default
};
