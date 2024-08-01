// @ts-nocheck
// Vike allows bundeling env params or dynamicly loading them
// In order to assure this also works in the packages version we provide sensible defaults, 
// that can be overwritten by the bundler

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

export const LOGIN_ROUTE = metaOrDefault(() => { return import.meta.env.PUBLIC_ENV__LOGIN_ROUTE }, "/login");
export const ROUTE_PREFIX = metaOrDefault(() => { return import.meta.env.PUBLIC_ENV__ROUTE_PREFIX }, "");
export const DEBUG = metaOrDefault(() => { return import.meta.env.PUBLIC_ENV__DEBUG }, false);
export const DOCS_AT_INTEX = metaOrDefault(() => { return import.meta.env.DOCS_AT_INTEX }, false);
export const IS_NATIVE = metaOrDefault(() => { return import.meta.env.PUBLIC_ENV__IS_NATIVE }, false);