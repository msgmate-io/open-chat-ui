import React from 'react';
import { Provider } from "react-redux";
import { getStore } from "../store/store";
import { GlobalContext, defaultGlobalContext } from './GlobalContext';

interface ServerSideData {
    theme?: string
    sessionIdExists?: boolean
    xcsrfToken?: string
    resizableLayout?: any
    children: any | null
    location: string // 'client' | 'server'
    routeParams: any
    searchParams: any
    globalContext: any
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
    searchParams: {},
    globalContext: defaultGlobalContext
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

export function ContextBase({ store, children, globalContext }) {
    const [hostUrl, setHostUrl] = React.useState(defaultGlobalContext.hostUrl);

    return <GlobalContext.Provider value={{
        ...globalContext,
        hostUrl,
        setHostUrl: (url) => {
            setHostUrl(url)
            try {
                // TODO: try only in native
                window.electronAPI.setDefaultOrigin(url);
            } catch (e) { }
        }
    }}>
        <Provider store={store}>
            {children}
        </Provider>
    </GlobalContext.Provider>

}

export function ServerContextProvider(props: ServerSideData = defaultProps) {
    if (props.location === 'server') {
        const initalReduxServerState = getInitalReduxState(props);
        const store = getStore(initalReduxServerState);
        return <ContextBase store={store} globalContext={props.globalContext}>
            {props.children}
        </ContextBase>
    } else if (props.location === 'client') {
        if (!globalStore) {
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
        return <ContextBase store={globalStore} globalContext={props.globalContext}>
            {props.children}
        </ContextBase>
    } else {
        return <>Unkown render location {props.location}</>
    }
}