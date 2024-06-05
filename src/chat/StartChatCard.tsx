import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useApi } from "../api/client2";
import { MobileBackButton } from "../atoms/MobileBackButton";
import { OnlineIndicator } from "../atoms/OnlineIndicator";
import { GlobalContext } from "../context/GlobalContext";
import { insertChat } from "../store/chats";
import { insertMessage } from "../store/messages";
import { RootState } from "../store/store";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    Card,
} from "../ui/card";
import { Input } from "../ui/input";

export function PassKeyRequiredIndicator({
    is_required
}) {
    return <Badge variant="outline" className={`ml-1 border-${is_required ? "error" : "success"} text-accent h-4`}>{is_required ? "requires passkey" : "no passkey required"}</Badge>
}

export function StartChatCard({ userId }) {
    const { logoUrl } = useContext(GlobalContext);
    const api = useApi()
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true)
    const [profile, setProfile] = useState(null)
    const revealSecret = useSelector((state: RootState) => state.pageProps.search?.reveal)
    const key = useSelector((state: RootState) => state.pageProps.search?.key)
    const { navigate } = useContext(GlobalContext);


    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setIsLoading(true)
        api.profileRetrieve({
            userUuid: userId,
            reveal_secret: revealSecret
        }).then((res) => {
            console.log("PROFILE", res)
            setProfile(res)
            setIsLoading(false)
        }).catch((err) => {
            toast.error(`Failed to fetch profile: ${JSON.stringify(err)}`)
        });
    }, []);

    const [password, setPassword] = useState("")
    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const onCreateChat = (text) => {
        api.profileCreateChatCreate({
            userUuid: userId,
            contact_secret: password,
            reveal_secret: revealSecret
        }, { text }).then((res) => {
            dispatch(insertChat({
                chat: res.chat,
            }))
            dispatch(insertMessage({
                chatId: res.chat.uuid,
                message: res.message
            }))

            setTimeout(() => {
                navigate(null, { chat: res.chat.uuid })
            }, 50)
        }).catch((err) => {
            toast.error(`Failed to create chat: ${JSON.stringify(err)}`)
        })
    }

    return <>
        <div className="flex flex-col h-full w-full content-center items-center">
            <div className="w-full flex items-center content-center justify-left">
                <div className="absolute top-0 mt-2 ml-2">
                    <Card className="bg-base-200 hover:bg-base-300 p-0 flex" key={"chatListHeader"}>
                        <div className="flex">
                        </div>
                        <div className="flex flex-grow items-center content-center justify-start pr-2">
                            <div>
                                👾
                            </div>
                        </div>
                    </Card>
                </div>
                <MobileBackButton />
            </div>
            <div className="flex flex-col h-full w-full lg:max-w-[900px] relativ">
                <div className="flex flex-col flex-grow gap-2 items-center content-center overflow-y-scroll">

                    <div className="w-full flex items-center content-center justify-left">
                        <MobileBackButton />
                    </div>
                    <main className="flex flex-col w-full text-3xl md:text-4xl lg:w-8/12 font-bold content-center justify-center items-center p-6">
                        <h1 className="inline">
                            Start Chat With{" "}
                            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                                {userId}
                            </span>{" "}
                        </h1>
                    </main>
                    <OnlineIndicator is_online={profile?.is_online} />
                    {isLoading && <div>Loading...</div>}
                    <h2 className="text-xl font-bold py-2">
                        {profile?.first_name} {profile?.second_name}
                    </h2>
                    <h2 className="text-xl font-bold py-2">
                        {profile?.description_title}
                    </h2>
                    <p className="text-lg">
                        {profile?.description}
                    </p>
                    <PassKeyRequiredIndicator is_required={profile?.reqires_contact_password} />
                    <Input defaultValue={key} onChange={onChangePassword} placeholder={profile?.reqires_contact_password ? "Enter Password" : "No password required"} disabled={!profile?.reqires_contact_password} className="max-w-80" />
                </div>
                <Card className="bg-base-200 hover:bg-base-300 p-0 flex" key={"chatListHeader"}>
                    <div className="flex">
                        <img src={logoUrl} className="h-12" alt="logo" />
                    </div>
                    <div className="flex flex-grow items-center content-center justify-start pr-2">
                        <div className="p-2 flex flex-grow">
                            <Input ref={inputRef} placeholder="Type a message..." disabled={false} />
                        </div>
                        <Button onClick={() => {
                            onCreateChat(inputRef.current?.value)
                        }} disabled={false}  >
                            <div>✍️</div>
                            Send
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    </>
}

