import React from 'react';
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ChatItem, ChatItemCompact, CompactPendingChatItem, PendingChatItem } from "./ChatItem";
import { ProfileCard } from "./ChatsProfileCard";
import { NewChatCard } from "./NewChatCard";

const STYLE = "compact"; // default

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

function isYesterday(date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();
}

function isWithinLast7Days(date) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return date >= sevenDaysAgo;
}

export function ChatsList({
    leftPannelCollapsed,
    onToggleCollapse
}) {
    const chats = useSelector((state: RootState) => state.chats.value?.results);
    const chatId = useSelector((state: RootState) => state.pageProps.search?.chat);

    const ChatItm = STYLE === "compact" ? ChatItemCompact : ChatItem;
    const PendingItm = STYLE == "compact" ? CompactPendingChatItem : PendingChatItem;

    const renderDivider = (label) => (
        <div className="text-gray-500 font-bold my-2" key={label}>{label}</div>
    );

    const renderChatItems = () => {
        if (!chats) {
            return Array.from({ length: 30 }).map((_, i) => <PendingItm key={`chat_${i}`} />);
        }

        let lastDivider = null;

        return chats.flatMap((chat) => {
            const chatDate = new Date(chat.newest_message.created);
            let divider = null;

            if (isToday(chatDate)) {
                if (lastDivider !== 'Today') {
                    divider = renderDivider('Today');
                    lastDivider = 'Today';
                }
            } else if (isYesterday(chatDate)) {
                if (lastDivider !== 'Yesterday') {
                    divider = renderDivider('Yesterday');
                    lastDivider = 'Yesterday';
                }
            } else if (isWithinLast7Days(chatDate)) {
                if (lastDivider !== 'Previous 7 Days') {
                    divider = renderDivider('Previous 7 Days');
                    lastDivider = 'Previous 7 Days';
                }
            }

            return [divider, <ChatItm chat={chat} key={`chat_${chat.uuid}`} isSelected={chat.uuid === chatId} />].filter(Boolean);
        });
    };

    return (
        <div className="flex flex-col gap-0 h-full relative w-full">
            <NewChatCard onToggleCollapse={onToggleCollapse} leftPannelCollapsed={leftPannelCollapsed} />
            <div className="flex flex-col flex-grow gap-1 overflow-y-scroll pl-2 pr-2 relative w-full max-w-full">
                {renderChatItems()}
            </div>
            <ProfileCard />
        </div>
    );
}