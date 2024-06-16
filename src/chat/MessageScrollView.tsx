import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useApi } from "../api/client2";
import { SocketContext, buildMessage } from '../context/WebsocketBridge';
import { updateNewestMessage } from "../store/chats";
import { getChatPartialMessage, getMessagesByChatId, insertMessage, replaceMessage } from "../store/messages";
import { RootState } from "../store/store";
import { MessageInput } from "./MessageInput";
import { MessageItem } from "./message";

export function MessageScrollView({ chatId, chat, hideInput = false }) {
    const { sendMessage, dataMessages, removeDataMessage } = useContext(SocketContext)

    const [text, setText] = useState("");


    const [isBotResponding, setIsBotResponding] = useState(false)

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

    const sendDataMessage = (text, dataMessage, isPartial = false, tmpId = null) => {
        const message = {
            chat_id: chatId,
            recipient_id: chat?.partner?.uuid,
            text: text,
            data_message: dataMessage
        }
        if (isPartial && tmpId) {
            message['tmp_id'] = tmpId;
        }
        const payloadMessage = buildMessage(message, isPartial ? 'partial_message' : 'send_message');
        sendMessage(payloadMessage);
    }


    useEffect(() => {
        // Bot-chat specific signal message processing
        if (!chat?.partner?.is_bot) return;

        if (dataMessages.length > 0) {
            const newSignals = dataMessages.filter(segment => segment.data_message.data_type === 'signal');

            if (newSignals.length > 0) {
                let isResponding = newSignals.some(signal => signal.data_message.data.signal === 'start-generating-response');
                let doneResponding = newSignals.some(signal => signal.data_message.data.signal === 'finished-generating-response');

                if (isResponding) {
                    setIsBotResponding(true);
                }

                if (doneResponding) {
                    setIsBotResponding(false);
                }

                for (const dataMsg of newSignals) {
                    removeDataMessage(dataMsg.uuid);
                }
            }
        }
    }, [dataMessages, chat, removeDataMessage]);

    useEffect(() => {
        scrollToBottom()
    }, [messages, partialMessage])

    const onSendMessage = () => {
        setSendIsLoading(true)
        let tmp_msg_id = `temp_${new Date().getTime()}`
        dispatch(insertMessage({
            chatId: chat.uuid,
            message: {
                sender: user.uuid,
                text: inputRef.current?.value,
                created_at: new Date().toISOString(),
                uuid: tmp_msg_id,
            }
        }))
        api.messagesSendCreate(chat.uuid, { text: inputRef.current?.value }).then((res) => {
            dispatch(updateNewestMessage({ chatId: chat.uuid, message: res }))
            dispatch(replaceMessage({
                chatId: chat.uuid,
                message: res
            }))
            setTimeout(() => {
                scrollToBottom()
                setSendIsLoading(false)
            }, 50)
        }).catch((err) => {
            setSendIsLoading(false)
            toast.error(`Failed to send message: ${err}`)
        })
    }

    const onStopBotResponse = () => {
        console.log('Sending stop-generating-response signal')
        sendDataMessage(`Signal: Stopping bot response`, {
            hide_message: true,
            data_type: 'signal',
            data: {
                signal: 'stop-generating-response'
            }
        }, true);
    }

    return <div className="flex flex-col h-full w-full lg:max-w-[900px] relative">
        <div ref={scrollRef} className="flex flex-col flex-grow gap-2 items-center content-center overflow-y-scroll relative">
            {chatId}
            {isLoading && <div>Loading...</div>}
            {messages && messages.results.map((message) => <MessageItem key={`msg_${message.uuid}`} message={message} chat={chat} selfIsSender={user?.uuid === message.sender} />).reverse()}
            {partialMessage && <MessageItem key={`msg_${partialMessage.uuid}`} message={partialMessage} chat={chat} selfIsSender={user?.uuid === partialMessage.sender} />}
        </div>
        {!hideInput && <MessageInput text={text} setText={setText} isLoading={sendIsLoading || isLoading} isBotResponding={isBotResponding} stopBotResponse={onStopBotResponse} onSendMessage={onSendMessage} ref={inputRef} />}
    </div>
}
