import Cookies from "js-cookie";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { GlobalContext } from "../context";
import { Api } from "./api";

interface GetApiParamTypes {
  cookie: string;
  xcsrfToken: string;
  hostUrl: string
}

export function getApi(props: GetApiParamTypes): typeof Api.prototype.api {
  const isServer = typeof window === "undefined";
  let headers: any = {
    "X-CSRFToken": props.xcsrfToken,
  }
  if (props.cookie) {
    headers = {
      ...headers,
      cookie: props.cookie,
    }
  }
  const api = new Api({
    baseUrl: isServer ? "http://backend:8000" : props.hostUrl,
    baseApiParams: {
      headers
    },
  });
  return api.api;
}

export function getApiClient(pageContext: any) {
  return getApi({
    cookie: pageContext.cookie,
    xcsrfToken: pageContext.xcsrfToken,
    hostUrl: ""
  });
}

export function getApiServer(pageContext: any) {
  return getApi({
    cookie: pageContext.requestHeaders.cookie,
    xcsrfToken: pageContext.xcsrfToken,
    hostUrl: ""
  });
}

export function useApi() {
  const frontend = useSelector((state: any) => state.frontend);
  const isServer = typeof window === "undefined";
  const { hostUrl } = useContext(GlobalContext);
  console.log("useApi", frontend, hostUrl)

  const api = isServer ? getApi({
    cookie: frontend.cookie,
    xcsrfToken: frontend.xcsrfToken,
    hostUrl
  }) : getApi({
    xcsrfToken: Cookies.get("csrftoken") || "",
    cookie: null,
    hostUrl
  })

  return api
}
