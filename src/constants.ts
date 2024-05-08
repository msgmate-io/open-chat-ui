// Vike allows bundeling env params or dynamicly loading them
// In order to assure this also works in the packages version we provide sensible defaults, that can be overwritten by the bundler

function metaOrDefault(meta: any, defaultValue: any) {
  try {
    if (typeof meta === "function") {
      meta = meta()
    }
  } catch (e) {
    console.error(e)
    meta = ""
  }
  return (meta && (meta !== "")) ? meta : defaultValue
}

export const LOGIN_AS_GUEST = {
  allowed: metaOrDefault(() => { return import.meta.env.PUBLIC_ENV__GUEST_LOGIN_ALLOWED }, true),
  username: metaOrDefault(() => { return import.meta.env.PUBLIC_ENV__GUEST_USERNAME }, "guest"),
  password: metaOrDefault(() => { return import.meta.env.PUBLIC_ENV__GUEST_PASSWORD }, "guest"),
}

export enum BT {
  CAPACITOR = "capacitor",
  DOCS = "docs",
  WEB = "web",
}
export const BUILD_TYPE: BT = metaOrDefault(() => { return import.meta.env.PUBLIC_ENV__BUILD_TYPE }, BT.WEB);
export const STATIC_EXPORT = BUILD_TYPE !== BT.WEB;
export const LOGIN_ROUTE = metaOrDefault(() => { return import.meta.env.PUBLIC_ENV__LOGIN_ROUTE }, "/login");

// 'ROUTE_PREFIX' is added on 'navigate' and 'Link' from `@/components/atoms/Link`
export const ROUTE_PREFIX = metaOrDefault(() => { return import.meta.env.PUBLIC_ENV__ROUTE_PREFIX }, "");

// 'FRONTNED_BACKEND_ROUTE' is used for client side requests
export const FRONTNED_BACKEND_ROUTE = metaOrDefault(() => { return import.meta.env.PUBLIC_ENV__FRONTNED_BACKEND_ROUTE }, "");

// 'WEBSOCKET_URL' constructed client websocket url
export const WEBSOCKET_PROTOCOLL = metaOrDefault(() => { return import.meta.env.PUBLIC_ENV__WEBSOCKET_PROTOCOLL }, "ws://");
export const WEBSOCKET_HOST = metaOrDefault(() => { return import.meta.env.PUBLIC_ENV__WEBSOCKET_HOST }, "localhost:8000");
export const WEBSOCKET_PATH = metaOrDefault(() => { return import.meta.env.PUBLIC_ENV__WEBSOCKET_PATH }, "/ws/chat/");
export const WEBSOCKET_URL = `${WEBSOCKET_PROTOCOLL}${WEBSOCKET_HOST}${WEBSOCKET_PATH}`;

export const BASE_PAGE_TITLE = metaOrDefault(() => { return import.meta.env.PUBLIC_ENV__BASE_PAGE_TITLE }, "Open Chat Interface")
