import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useApi } from "../api/client2";
import { ChatMessagesLoader } from "../loaders/MessagesLoader";
import { getChatByChatId, markChatAsRead } from "../store/chats";
import { markChatMessagesAsRead } from "../store/messages";
import { RootState } from "../store/store";
import { MessageScrollView } from "./MessageScrollView";
import { CollapseIndicator } from './NewChatCard';

export function MessagesView({ chatId, leftPannelCollapsed, onToggleCollapse }) {
    const chat = useSelector((state: RootState) => getChatByChatId(state, chatId))
    const api = useApi()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!chatId) {
            return
        }
        api.messagesReadCreate(chatId).then((res) => {
            dispatch(markChatMessagesAsRead({ chatId }))
            dispatch(markChatAsRead({ chatId }))
        }).catch((err) => {
            toast.error(`Failed to mark messages as read: ${JSON.stringify(err)}`)
        })
    }, [chatId])

    return <>
        <ChatMessagesLoader chatId={chatId} />
        <div className="flex flex-col h-full w-full content-center items-center">
            {leftPannelCollapsed && <div className="w-full flex items-center content-center justify-left">
                <div className="absolute top-0 mt-2 ml-2 z-40">
                    <CollapseIndicator leftPannelCollapsed={leftPannelCollapsed} onToggleCollapse={onToggleCollapse} />
                </div>
            </div>}
            <MessageScrollView chatId={chatId} chat={chat} />
        </div>
    </>
}