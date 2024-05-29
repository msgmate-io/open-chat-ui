import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useApi } from "../api/client2";
import { updateNewestMessage } from "../store/chats";
import { getChatPartialMessage, getMessagesByChatId, insertMessage } from "../store/messages";
import { RootState } from "../store/store";
import { MessageInput } from "./MessageInput";
import { MessageItem } from "./message";

export function MessageScrollView({ chatId, chat }) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const messages = useSelector((state: RootState) => getMessagesByChatId(state, chatId))
    const partialMessage = useSelector((state: RootState) => getChatPartialMessage(state, chatId))
    const user = useSelector((state: RootState) => state.user.value)
    const isLoading = chatId && !messages
    const inputRef = useRef<HTMLTextAreaElement>(null)

    const [sendIsLoading, setSendIsLoading] = useState(false)

    const api = useApi()
    const dispatch = useDispatch()

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, partialMessage])

    const onSendMessage = () => {
        setSendIsLoading(true)
        api.messagesSendCreate(chat.uuid, { text: inputRef.current?.value }).then((res) => {
            dispatch(insertMessage({ chatId: chat.uuid, message: res }))
            dispatch(updateNewestMessage({ chatId: chat.uuid, message: res }))
            setTimeout(() => {
                scrollToBottom()
                setSendIsLoading(false)
            }, 50)
        }).catch((err) => {
            setSendIsLoading(false)
            toast.error(`Failed to send message: ${err}`)
        })
    }

    return <div className="flex flex-col h-full w-full lg:max-w-[900px] relativ">
        <div ref={scrollRef} className="flex flex-col flex-grow gap-2 items-center content-center overflow-y-scroll">
            {chatId}
            {isLoading && <div>Loading...</div>}
            {messages && messages.results.map((message) => <MessageItem key={`msg_${message.uuid}`} message={message} chat={chat} selfIsSender={user?.uuid === message.sender} />).reverse()}
            {partialMessage && <MessageItem key={`msg_${partialMessage.uuid}`} message={partialMessage} chat={chat} selfIsSender={user?.uuid === partialMessage.sender} />}
        </div>
        <MessageInput isLoading={sendIsLoading || isLoading} onSendMessage={onSendMessage} ref={inputRef} />
    </div>
}
