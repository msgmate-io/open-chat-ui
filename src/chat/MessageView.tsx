import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useApi } from "../api/client2";
import { MobileBackButton } from "../atoms/MobileBackButton";
import { ChatMessagesLoader } from "../loaders/MessagesLoader";
import { getChatByChatId, markChatAsRead } from "../store/chats";
import { markChatMessagesAsRead } from "../store/messages";
import { RootState } from "../store/store";
import {
    Card,
} from "../ui/card";
import { MessageScrollView } from "./MessageScrollView";

export function MessagesView({ chatId }) {
    const chat = useSelector((state: RootState) => getChatByChatId(state, chatId))
    const api = useApi()
    const dispatch = useDispatch()

    useEffect(() => {
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
            <div className="w-full flex items-center content-center justify-left">
                <div className="absolute top-0 mt-2 ml-2">
                    <Card className="bg-base-200 hover:bg-base-300 p-0 flex" key={"chatListHeader"}>
                        <div className="flex">
                        </div>
                        {!chatId && <div className="flex flex-grow items-center content-center justify-start pr-2">
                            <div className="p-2 flex flex-grow">Model Select</div>
                            <div>
                                👾
                            </div>
                        </div>}
                    </Card>
                </div>
                <MobileBackButton />
            </div>
            <MessageScrollView chatId={chatId} chat={chat} />
        </div>
    </>
}