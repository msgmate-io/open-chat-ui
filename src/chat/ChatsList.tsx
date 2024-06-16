import React from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ChatItem, ChatItemCompact, CompactPendingChatItem, PendingChatItem } from "./ChatItem";
import { ProfileCard } from "./ChatsProfileCard";
import { NewChatCard } from "./NewChatCard";

const STYLE = "compact" // default

export function ChatsList() {
    const chats = useSelector((state: RootState) => state.chats.value?.results)
    const chatId = useSelector((state: RootState) => state.pageProps.search?.chat)

    const ChatItm = STYLE === "compact" ? ChatItemCompact : ChatItem
    const PendingItm = STYLE == "compact" ? CompactPendingChatItem : PendingChatItem
    return <div className="flex flex-col gap-0 h-full relative w-full">
        <NewChatCard />
        <div className="flex flex-col flex-grow gap-1 overflow-y-scroll py-2 pl-2 pr-2 relative w-full max-w-full">{
            chats ? chats.map(chat =>
                <ChatItm chat={chat} key={`chat_${chat.uuid}`} isSelected={chat.uuid === chatId} />)
                : Array.from({ length: 30 }).map((_, i) => <PendingItm key={`chat_${i}`} />)
        }</div>
        <ProfileCard />
    </div>
}
