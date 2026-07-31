import { a as attr } from "../../chunks/index.js";
import { i as initial_base, b as base } from "../../chunks/server.js";
import { r as resolve_route, a as add_data_suffix } from "../../chunks/routing.js";
import "../../chunks/url.js";
import { try_get_request_store } from "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
function resolve(id, params) {
  if (!id.startsWith("/")) {
    throw new Error(
      `Cannot use \`resolve(...)\` with a non-absolute pathname or route ID (got "${id}"). \`resolve\` is only for internal pathnames and route IDs; external URLs should be used directly.`
    );
  }
  const resolved = resolve_route(
    id,
    /** @type {Record<string, string>} */
    params
  );
  {
    const store = try_get_request_store();
    if (store && !store.state.prerendering?.fallback) {
      const pathname = store.event.isDataRequest ? add_data_suffix(store.event.url.pathname) : store.event.url.pathname;
      const after_base = pathname.slice(initial_base.length);
      const segments = after_base.split("/").slice(2);
      const prefix = segments.map(() => "..").join("/") || ".";
      return prefix + resolved;
    }
  }
  return base + resolved;
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    $$renderer2.push(`<nav><ul><li><a${attr("href", resolve("/"))}>Home</a></li></ul></nav> `);
    children($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
export {
  _layout as default
};
