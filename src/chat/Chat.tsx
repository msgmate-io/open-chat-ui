import React, { useRef, useState } from 'react';
import { useSelector } from "react-redux";
import { AudioChatBase } from "../audio_chat/AudioChat";
import { ChatsList } from "../chat/ChatsList";
import { MessagesView } from "../chat/MessageView";
import { WebsocketBridge } from "../context/WebsocketBridge";
import { RootState } from "../store/store";
import { Toaster } from "../ui/sonner";
import { NewChatOverview } from "./NewChatOverview";
import { ResizableChatLayout } from "./ResizableChatLayout";
import { StartChatCard } from "./StartChatCard";

const chatMessageViews = ["new", "create"]

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
                    {chatId === "create" && <StartChatCard userId={userId} leftPannelCollapsed={leftPannelCollapsed} onToggleCollapse={onToggleCollapse} />}
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
