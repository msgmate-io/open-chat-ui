import { useApi } from '@msgmate-io/open-chat-typescript-client';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import { AudioChatBase } from "../audio_chat/AudioChat";
import { ChatsList } from "../chat/ChatsList";
import { MessagesView } from "../chat/MessageView";
import { WebsocketBridge } from "../context/WebsocketBridge";
import { cn } from "../lib/utils";
import { RootState } from "../store/store";
import { Toaster } from "../ui/sonner";
import { models } from "./HalBotSelector";
import { NewChatOverview } from "./NewChatOverview";
import { ResizableChatLayout } from "./ResizableChatLayout";
import { StartChatCard } from "./StartChatCard";

const chatMessageViews = ["new", "create", "createAudio"]

const audioChatModels = ["gpt-4o", "phi-3.1-mini-4k-instruct"]

export const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <div>
                <div
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                        {children}
                    </p>
                </div>
            </div>
        </li>
    )
})
ListItem.displayName = "ListItem"

function CreateAudioChatCard() {

    const api = useApi()
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedModel, setSelectedModel] = useState("gpt-4o");
    const filteredModels = models.filter((model) => audioChatModels.indexOf(model.title) !== -1);

    useEffect(() => {
        setIsLoading(true)
        api.profileNameRetrieve({
            username: "hal",
            reveal_secret: "hal"
        }).then((res) => {
            console.log("PROFILE", res)
            setProfile(res)
            setIsLoading(false)
        }).catch((err) => {
            toast.error(`Failed to fetch profile: ${JSON.stringify(err)}`)
        })
    }, []);

    const onStartAudioChat = () => {
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
                chat_settings: botConfig
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

    return <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Create Audio Chat</h1>
        <div className="flex flex-row space-x-4 mt-4">
            <div>
                <div>
                    <div className="focus:bg-base-200">
                        <div>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {filteredModels.map((model) => (
                                    <ListItem
                                        className={cn("hover:bg-base-200 hover:text-content-neutral", {
                                            "bg-base-200": selectedModel === model.title,
                                        })}
                                        onClick={() => setSelectedModel(model.title)}
                                        key={model.title}
                                        title={model.title}
                                        href={model.href}
                                    >
                                        {model.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

}

function ChatBase() {
    const chatId = useSelector((state: RootState) => state.pageProps.search?.chat)
    const userId = useSelector((state: RootState) => state.pageProps.search?.userId)
    const _chatType = useSelector((state: RootState) => state.pageProps.search?.chatType)
    const chatType = _chatType === "audio" ? "audio" : "text";

    const [leftPannelCollapsed, setLeftCollapsed] = useState(false);

    const leftPannelRef = useRef();
    const rightPannelRef = useRef();

    const onToggleCollapse = () => {
        const isCollapsed = leftPannelRef.current.isCollapsed();
        if (isCollapsed) {
            leftPannelRef.current.expand();
        } else {
            leftPannelRef.current.collapse();
        }
        setLeftCollapsed(!isCollapsed);
    };


    return <>
        <div className="flex h-screen">
            <ResizableChatLayout
                leftPannelRef={leftPannelRef}
                rightPannelRef={rightPannelRef}
                setLeftCollapsed={setLeftCollapsed}
                left={<ChatsList leftPannelCollapsed={leftPannelCollapsed} onToggleCollapse={onToggleCollapse} />}
                right={<>
                    {chatType === "audio" && <AudioChatBase />}
                    {!chatId && <StartChatCard userId={userId} initUserName={"hal"} leftPannelCollapsed={leftPannelCollapsed} onToggleCollapse={onToggleCollapse} />}
                    {(chatId && (chatType === "text") && !(chatMessageViews.indexOf(chatId) !== -1)) && <MessagesView
                        chatId={chatId}
                        leftPannelCollapsed={leftPannelCollapsed}
                        onToggleCollapse={onToggleCollapse} />}
                    {chatId === "new" && <NewChatOverview leftPannelCollapsed={leftPannelCollapsed} onToggleCollapse={onToggleCollapse} />}
                    {chatId === "create" && <StartChatCard initUserName={null} userId={userId} leftPannelCollapsed={leftPannelCollapsed} onToggleCollapse={onToggleCollapse} />}
                    {chatId === "createAudio" && <CreateAudioChatCard />}
                </>}
            />
        </div>
    </>

}

export function Chat() {
    return <WebsocketBridge>
        <ChatBase />
        <Toaster />
    </WebsocketBridge>
}
