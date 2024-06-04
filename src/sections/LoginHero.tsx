import Cookies from "js-cookie";
import React from 'react';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { LoginInfo } from "../api/api";
import { ErrorResult } from "../api/apiTypes";
import { useApi } from "../api/client2";
import { navigate } from "../atoms/Link";
import { LOGIN_AS_GUEST } from "../constants";
import LoginHero from "../hero/login";
import { fetchUser } from "../store/user";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Toaster } from "../ui/sonner";

export function LoginSection({
    sectionId = "login",
    servicesList = [],
}) {
    const api = useApi();
    const [error, setError] = useState<ErrorResult>(null)
    const [isFetching, setIsFetching] = useState(false)
    const dispatch = useDispatch()

    const onSubmit = async (data: any) => {
        setIsFetching(true)
        const loginData: LoginInfo = {
            ...data
        }
        try {
            const user = await api.userLoginCreate(loginData)
            await dispatch(fetchUser(user))
            toast.success("Logged in as " + data.username)
            Cookies.set("clientAuthorized", true)
            setTimeout(() => {
                setIsFetching(false)
                navigate("/chat")
            }, 400)
        } catch (e) {
            setError(e.error)
            toast.error("Error: " + JSON.stringify(e.error))
            setIsFetching(false)
        }
    };

    console.log("GUEST", LOGIN_AS_GUEST)

    return <section className="container py-24 sm:py-32 flex flex-col flex-grow items-center content-center justify-center" id={sectionId}>
        <div className="grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
            <div>
                {""}

                <p className="text-muted-foreground text-xl mt-4 mb-8 ">
                    {""}
                </p>

                <div className="flex flex-col gap-8">
                    {servicesList.map(({ icon, title, description }) => (
                        <Card key={title}>
                            <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                                <div className="mt-1 p-1 rounded-2xl max-w-40 min-w-20">
                                    {icon}
                                </div>
                                <div>
                                    <CardTitle>{title}</CardTitle>
                                    <CardDescription className="text-md mt-2">
                                        {description}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>

            <LoginHero
                title="Msgmate.io Open Chat Interface"
                description="Please login to continue"
                isFetching={isFetching}
                onSubmit={onSubmit}
                error={error}
            />

        </div>
        <Toaster />
    </section>
}