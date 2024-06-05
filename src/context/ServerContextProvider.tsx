import React from 'react';
import { Provider } from "react-redux";
import { getStore } from "../store/store";

interface ServerSideData {
    theme?: string
    sessionIdExists?: boolean
    xcsrfToken?: string
    resizableLayout?: any
    children: any | null
    location: string // 'client' | 'server'
    routeParams: any
    searchParams: any
}

let globalStore: null | any = null;


const defaultProps = {
    theme: 'light',
    sessionIdExists: false,
    xcsrfToken: '',
    children: <></>,
    resizableLayout: {},
    location: 'client',
    routeParams: {},
    searchParams: {}
}

export function getInitalReduxState(props: ServerSideData) {
    return {
        frontend: {
            theme: props.theme,
            sessionId: props.sessionIdExists,
            xcsrfToken: props.xcsrfToken,
            routeParams: props.routeParams,
            resizableLayout: props.resizableLayout,
        },
        pageProps: {
            routeParams: props.routeParams,
            search: props.searchParams
        }
    }
}

export function ServerContextProvider(props: ServerSideData = defaultProps) {
    if (props.location === 'server') {
        const initalReduxServerState = getInitalReduxState(props);
        const store = getStore(initalReduxServerState);
        return <Provider store={store}>
            {props.children}
        </Provider>
    } else if (props.location === 'client') {
        if (!globalStore) {
            // TODO: possibly need to add some 'initalReduxStoreOverwrite'
            globalStore = getStore({
                ...getInitalReduxState(props)
            });
        } else {
            if (typeof window !== "undefined") {
                // on client side navigation always update 'pageProps'
                globalStore = getStore({
                    ...globalStore.getState(),
                    pageProps: {
                        routeParams: props.routeParams,
                        search: props.searchParams
                    }
                });
            }
        }
        return <Provider store={globalStore}>
            {props.children}
        </Provider>
    } else {
        return <>Unkown render location {props.location}</>
    }
}