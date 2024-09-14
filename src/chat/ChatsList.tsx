import React, { useContext } from 'react';
import { useSelector } from "react-redux";
import { LoadingSpinner } from '../atoms/LoadingSpinnter';
import { GlobalContext } from '../context/GlobalContext';
import { cn } from '../lib/utils';
import { useChats } from '../loaders/ChatsLoader';
import { RootState } from "../store/store";
import {
    Card
} from "../ui/card";
import { ChatItem, ChatItemCompact } from "./ChatItem";
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

export const ExploreChatsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="icon-md">
        <path
            fill="currentColor"
            fillRule="evenodd"
            d="M6.75 4.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5M2.5 6.75a4.25 4.25 0 1 1 8.5 0 4.25 4.25 0 0 1-8.5 0M17.25 4.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5M13 6.75a4.25 4.25 0 1 1 8.5 0 4.25 4.25 0 0 1-8.5 0M6.75 15a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5M2.5 17.25a4.25 4.25 0 1 1 8.5 0 4.25 4.25 0 0 1-8.5 0M17.25 15a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5M13 17.25a4.25 4.25 0 1 1 8.5 0 4.25 4.25 0 0 1-8.5 0"
            clipRule="evenodd"
        />
    </svg>
);

export function DefaultChatButtons() {
    const { logoUrl, navigate } = useContext(GlobalContext);

    return <>
        <Card className={cn(
            "bg-base-200 hover:bg-base-300 p-2 border-0")}
            onClick={() => {
                navigate(null, { chat: "createAudio", userName: "hal" })
            }}
        >
            <div className="p-0">
                <div className="flex flex-row text-nowrap text-lg whitespace-nowrap overflow-x-hidden">
                    <div className='flex items-center content-center justify-start'>
                        <img src={logoUrl} className="h-8 w-auto" alt="logo" />
                        <div className="ml-2">Hal Audio Chat</div>
                    </div>
                </div>
            </div>
        </Card>
        <Card className={cn(
            "bg-base-200 hover:bg-base-300 p-2 border-0")}
            onClick={() => {
                navigate(null, { chat: "create", userName: "hal" })
            }}
        >
            <div className="p-0">
                <div className="flex flex-row text-nowrap text-lg whitespace-nowrap overflow-x-hidden">
                    <div className='flex items-center content-center justify-start'>
                        <img src={logoUrl} className="h-8 w-auto" alt="logo" />
                        <div className="ml-2">Msgmate Hal Bot</div>
                    </div>
                </div>
            </div>
        </Card>
        <Card className={cn(
            "bg-base-200 hover:bg-base-300 p-2 border-0")}
            onClick={() => {
                navigate(null, { chat: "new" })
            }}
        >
            <div className="p-0">
                <div className="flex text-nowrap text-lg whitespace-nowrap overflow-x-hidden items-center content-center justify-start">
                    <div className='flex items-center content-center justify-start'>
                        <div className="h-8 w-8 flex items-center content-center justify-center"><ExploreChatsIcon /></div>
                        <div className="ml-2">Bots & Users Overview</div>
                    </div>
                </div>
            </div>
        </Card>
    </>
}

export function ChatsList({
    leftPannelCollapsed,
    onToggleCollapse
}) {
    const { chats } = useChats()
    const chatId = useSelector((state: RootState) => state.pageProps.search?.chat);

    const ChatItm = STYLE === "compact" ? ChatItemCompact : ChatItem;

    const renderDivider = (label) => (
        <div className="text-gray-500 font-bold my-2" key={label}>{label}</div>
    );

    const renderChatItems = () => {
        if (!chats) {
            return <div className='flex flex-grow w-full h-full items-center content-center justify-center'>
                <LoadingSpinner />
            </div>
        }

        let lastDivider = null;

        return chats?.results.flatMap((chat) => {
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
            <div className="flex flex-col flex-grow gap-1 overflow-y-auto pl-2 pr-2 relative w-full max-w-full">
                <DefaultChatButtons />
                {renderChatItems()}
            </div>
            <ProfileCard />
        </div>
    );
}