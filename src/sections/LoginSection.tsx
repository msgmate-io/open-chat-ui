import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LoginInfo } from "../api/api";
import { ErrorResult } from "../api/apiTypes";
import { useApi } from "../api/client2";
import { GlobalContext } from "../context";
import LoginHero from "../hero/login";
import { fetchUser } from "../store/user";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Toaster } from "../ui/sonner";

const SHOW_SERVER_SETTINGS = true;

export function ServerSettings({
    updateNativeConfig = () => { }
}) {
    const { hostUrl, setHostUrl } = useContext(GlobalContext);
    const [host, setHost] = useState(hostUrl)

    useEffect(() => {
        setHost(hostUrl)
    }, [hostUrl])

    return <div className="flex flex-col items-center content-center justify-center pb-2 w-full">
        Server Host:
        <Input type="text" className="w-full" value={host} onChange={(e) => setHost(e.target.value)} />
        <Button variant="outline" className="rounded-full py-2 w-full border-2 text-bold text-xl" onClick={() => {
            console.log("setHostUrl", host)
            setHostUrl(host)
            updateNativeConfig()
        }} >Save</Button>
    </div>
}

export function LoginSection({
    sectionId = "login",
    servicesList = [],
}) {
    const api = useApi();
    const [error, setError] = useState<ErrorResult>(null)
    const [isFetching, setIsFetching] = useState(false)
    const dispatch = useDispatch()
    const { navigate } = useContext(GlobalContext);

    const onSubmit = async (data: any) => {
        setIsFetching(true)
        const loginData: LoginInfo = {
            ...data
        }
        try {
            const user = await api.userLoginCreate(loginData)
            await dispatch(fetchUser(user))
            console.log("Logged in as", user)
            //toast.success("Logged in as " + data.username)
            Cookies.set("clientAuthorized", true)
            setTimeout(() => {
                setIsFetching(false)
                navigate("/chat")
            }, 400)
        } catch (e) {
            setError(e.error)
            //toast.error("Error: " + JSON.stringify(e.error))
            setIsFetching(false)
        }
    };

    return <div className="container py-24 sm:py-32 flex flex-col flex-grow items-center content-center justify-center" id={sectionId}>
        <div className="flex flex-col items-center content-center justify-center pb-2">
            <h1 className="text-2xl font-bold text-center">Welcome back!</h1>
            <p className="text-lg text-center">To Open-Chat! Login:</p>
        </div>
        <Button variant="outline" className="rounded-full py-8 w-full border-2 text-bold text-xl" onClick={() => navigate("/register")} >
            Login With Google
        </Button>
        or
        <LoginHero
            title="Msgmate.io Open Chat Interface"
            description="Please login to continue"
            isFetching={isFetching}
            onSubmit={onSubmit}
            error={error}
        />
        <Toaster />
    </div>
}