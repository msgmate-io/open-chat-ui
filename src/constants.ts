export const LOGIN_AS_GUEST = {
  allowed: false,
  username: "",
  password: ""
}

export enum BT {
  CAPACITOR = "capacitor",
  DOCS = "docs",
  WEB = "web",
}
export const BUILD_TYPE: BT = BT.WEB;
export const STATIC_EXPORT = BUILD_TYPE !== BT.WEB;
export const LOGIN_ROUTE = "/login";

// 'ROUTE_PREFIX' is added on 'navigate' and 'Link' from `@/components/atoms/Link`
export const ROUTE_PREFIX = ""

// 'FRONTNED_BACKEND_ROUTE' is used for client side requests
export const FRONTNED_BACKEND_ROUTE = ""

// 'WEBSOCKET_URL' constructed client websocket url
export const WEBSOCKET_PROTOCOLL = "ws://";
export const WEBSOCKET_HOST = "localhost:8000";
export const WEBSOCKET_PATH = "/ws/chat/";
export const WEBSOCKET_URL = `${WEBSOCKET_PROTOCOLL}${WEBSOCKET_HOST}${WEBSOCKET_PATH}`;

export const BASE_PAGE_TITLE = "Open Chat Interface"
