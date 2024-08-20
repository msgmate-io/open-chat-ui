
import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context';
import { Button } from '../ui/button';
import { ServerSettings } from './LoginSection';

function useNativeConfig() {
    const [nativeConfig, setNativeConfig] = useState({});
    const { hostUrl, setHostUrl } = useContext(GlobalContext);
    const updateNativeConfig = () => {
        let newNativeConfig = {}
        try {
            newNativeConfig = window.electronAPI.getClientConfig()
            setNativeConfig(newNativeConfig)
            console.log("newNativeConfig", newNativeConfig, hostUrl, newNativeConfig?.hosts[0].host)
            if (newNativeConfig?.hosts[0].host !== hostUrl) {
                setHostUrl(newNativeConfig?.hosts[0].host)
            }
        } catch (e) { }
    }

    useEffect(() => {
        updateNativeConfig()
    }, [])

    return { nativeConfig, updateNativeConfig }
}

export function useIsNativeClientAuthorized() {
    const [isClientAuthorized, setIsClientAuthorized] = useState(false)
    const { nativeConfig } = useNativeConfig()

    const updateIsClientAuthorized = () => {
        let isClientAuthorized = false
        try {
            isClientAuthorized = window.electronAPI.isClientAuthorized(null)
            setIsClientAuthorized(isClientAuthorized)
        } catch (e) { }
    }

    useEffect(() => {
        updateIsClientAuthorized()
    }, [])

    return isClientAuthorized
}

export function ClientSettings() {
    const { nativeConfig, updateNativeConfig } = useNativeConfig()
    const { navigate } = useContext(GlobalContext);

    return <div className="w-full h-full flex flex-col items-center justify-center content-center">
        <div className='w-1/3 flex flex-col gap-2'>
            Native Page
            Current native config: {JSON.stringify(nativeConfig)}
            <ServerSettings updateNativeConfig={updateNativeConfig} />
            <Button variant="outline" className="rounded-full py-2 w-full border-2 text-bold text-xl" onClick={() => {
                navigate("/login")
            }}>Back to login</Button>
        </div>
    </div>
}