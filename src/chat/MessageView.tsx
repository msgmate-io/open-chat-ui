import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useApi } from "../api/client2";
import { useChat } from '../loaders';
import { markChatAsRead } from "../store/chats";
import { markChatMessagesAsRead } from "../store/messages";
import { MessageScrollView } from "./MessageScrollView";
import { CollapseIndicator } from './NewChatCard';

export function MessagesView({ chatId, leftPannelCollapsed, onToggleCollapse }) {
    //const chat = useSelector((state: RootState) => getChatByChatId(state, chatId))
    const api = useApi()
    const { chat } = useChat({ chatId })
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
        <div className="flex flex-col h-full w-full content-center items-center">
            {leftPannelCollapsed && <div className="w-full flex items-center content-center justify-left">
                <div className="absolute top-0 mt-2 ml-2 z-40">
                    <CollapseIndicator leftPannelCollapsed={leftPannelCollapsed} onToggleCollapse={onToggleCollapse} />
                </div>
            </div>}
            <div className="absolute left-0 p-2 flex items-center content-center justify-left z-30">
                was
            </div>
            <MessageScrollView chatId={chatId} chat={chat} />
        </div>
    </>
}