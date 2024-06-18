import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useApi } from "../api/client2";
import { LoadingSpinner } from '../atoms/LoadingSpinnter';
import { MobileBackButton } from "../atoms/MobileBackButton";
import { OnlineIndicator } from "../atoms/OnlineIndicator";
import { GlobalContext } from "../context/GlobalContext";
import { cn } from '../lib/utils';
import { insertChat } from "../store/chats";
import { insertMessage } from "../store/messages";
import { RootState } from "../store/store";
import { Badge } from "../ui/badge";
import { Button } from '../ui/button';
import { Input } from "../ui/input";
import { Textarea } from '../ui/textarea';
import { HalBotSelector } from './HalBotSelector';
import { MessageInput } from './MessageInput';
import { NewBotChatCard } from './NewBotChatCard';
import { CollapseIndicator } from './NewChatCard';

export function PassKeyRequiredIndicator({
    is_required
}) {
    return <Badge variant="outline" className={`ml-1 border-${is_required ? "error" : "success"} text-accent h-4`}>{is_required ? "requires passkey" : "no passkey required"}</Badge>
}

function UserChatCard({
    userId,
    isLoading,
    profile,
    onChangePassword
}) {
    return <>
        <div className="w-full flex items-center content-center justify-left">
            <MobileBackButton />
        </div>
        <main className="flex flex-col w-full text-3xl font-bold content-center justify-center items-center p-6">
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
        <Input defaultValue={""} onChange={onChangePassword} placeholder={profile?.reqires_contact_password ? "Enter Password" : "No password required"} disabled={!profile?.reqires_contact_password} className="max-w-80" />
    </>
}

const DEFAULT_BOT_CONFIG = {
    "model": "",
    "context": 5,
    "systemPrompt": "Your are the advanced AI Agent, Hal. Her to fulfill any of the users requests."
}

export function AdvancedChatSettings({
    model,
    context, setContext,
    systemPrompt, setSystemPrompt
}) {

    const handleTextChange = (e) => {
        setSystemPrompt(e.target.value);
    };

    return <div className="flex flex-col gap-2 w-full p-2">
        <div className="flex w-full text-3xl font-bold content-center justify-center items-center p-2">
            <h1 className="inline">
                Configure your{" "}
                <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                    Hal Bot
                </span>
            </h1>
        </div>
        <div className="flex flex-col w-full">
            Hals Chat Message Context Size
        </div>
        <div className="flex flex-col gap-2 w-full">
            <Input placeholder="Context size" className="w-full" value={context} onChange={(e) => setContext(e.target.value)} />
        </div>
        <div className="flex flex-col w-full">
            Hals System Prompt
        </div>
        <div className='w-full'>
            <Textarea placeholder="System Promprt for the Bot" className="w-full h-[80px] bg-base-200 p-2" value={systemPrompt} onChange={handleTextChange} />
        </div>
        <div className="flex flex-col w-full">
            Hals AI Model / Backend
        </div>
        <div className="flex flex-col w-full">
            {model}
        </div>
    </div>
}


export function StartChatCard({
    userId,
    leftPannelCollapsed,
    onToggleCollapse
}) {
    const userName = useSelector((state: RootState) => state.pageProps.search?.userName)
    const [advancedOpen, setAdvancedOpen] = useState(false)
    const useUserIdLookup = userName ? false : true

    const [text, setText] = useState("");

    // Bot config
    const [selectedModel, setSelectedModel] = useState("llama3-70b-8192")
    const [systemPrompt, setSystemPrompt] = useState(DEFAULT_BOT_CONFIG.systemPrompt)
    const [context, setContext] = useState(DEFAULT_BOT_CONFIG.context)


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
        if (useUserIdLookup) {
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
        } else {
            api.profileNameRetrieve({
                username: userName,
                reveal_secret: revealSecret
            }).then((res) => {
                console.log("PROFILE", res)
                setProfile(res)
                setIsLoading(false)
            }).catch((err) => {
                toast.error(`Failed to fetch profile: ${JSON.stringify(err)}`)
            })
        }
    }, []);

    const [password, setPassword] = useState("")
    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const onCreateChat = (text) => {
        let createChatPost: any = {
            text
        }

        if (profile?.is_bot) {
            createChatPost = {
                ...createChatPost,
                data_message: {
                    hide_message: false,
                    data_type: "signal",
                    data: {
                        signal: "start-text-chat"
                    }
                },
                chat_settings: {
                    model: selectedModel,
                    systemPrompt,
                    context
                }
            }
        }
        const createChatQuery = {
            userUuid: profile?.uuid,
            contact_secret: password,
            reveal_secret: revealSecret
        }
        api.profileCreateChatCreate(createChatQuery, createChatPost).then((res) => {
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
            <div className="absolute left-0 p-2 flex items-center content-center justify-left z-30">
                {leftPannelCollapsed && <>
                    <CollapseIndicator leftPannelCollapsed={leftPannelCollapsed} onToggleCollapse={onToggleCollapse} />
                    <HalBotSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
                </>}
                {!leftPannelCollapsed && <>
                    <HalBotSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
                </>}
            </div>
            <div className="absolute right-0 p-2 flex items-center content-center justify-left z-10">
                <div>
                    <Button variant='outline' className={cn('hover:bg-base-100 hover:text-base-content rounded-3xl', {
                        'bg-base-200': advancedOpen,
                    })} onClick={() => {
                        console.log('clicked')
                        setAdvancedOpen(!advancedOpen)
                    }}>Advanced</Button>
                </div>
            </div>
            <div className="flex flex-col h-full w-full lg:max-w-[900px] relativ">
                <div className="flex flex-col flex-grow gap-2 items-center content-center overflow-y-scroll justify-center">
                    {isLoading && <LoadingSpinner size={48} className="text-content" />}
                    {!isLoading && <>
                        {!profile?.is_bot && <UserChatCard onChangePassword={onChangePassword} userId={userId} isLoading={isLoading} profile={profile} />}
                        {profile?.is_bot && <>
                            {!advancedOpen && <NewBotChatCard />}
                            {advancedOpen && <AdvancedChatSettings model={selectedModel} systemPrompt={systemPrompt} setSystemPrompt={setSystemPrompt} context={context} setContext={setContext} />}
                        </>}
                    </>}
                </div>
                <MessageInput ref={inputRef} onSendMessage={() => {
                    onCreateChat(text)
                }} text={text} setText={setText} />
            </div>
        </div>
    </>
}

