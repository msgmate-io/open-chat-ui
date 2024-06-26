import React from 'react';
import { useSelector } from "react-redux";
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

    return <>
        <div className="flex h-screen">
            <ResizableChatLayout
                left={<ChatsList />}
                right={<>
                    {!(chatMessageViews.indexOf(chatId) !== -1) && <MessagesView chatId={chatId} />}
                    {chatId === "new" && <NewChatOverview />}
                    {chatId === "create" && <StartChatCard userId={userId} />}
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
