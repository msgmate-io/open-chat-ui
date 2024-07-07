import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { DataTypeEnum } from '../api/api';
import { useApi } from "../api/client2";
import { SocketContext, buildMessage } from '../context/WebsocketBridge';
import { updateNewestMessage } from "../store/chats";
import { getChatPartialMessage, getMessagesByChatId, insertMessage, replaceMessage } from "../store/messages";
import { RootState } from "../store/store";
import { Button } from '../ui/button';
import { MessageInput } from "./MessageInput";
import { MessageItem, PendingMessageItem } from "./message";

const SHOW_DEBUG_PANEL = false;

function DebugBar({
    debugPannel,
    setDebugPannel,
    isBotThinking,
    isBotResponding
}) {
    return <div className='fixed top-0'>
        <div className="flex flex-row px-4 w-full max-w-full">
            DEBUG:
            <Button onClick={() => {
                setDebugPannel(null)
            }}>View Chat</Button>
            <Button onClick={() => {
                setDebugPannel("data_messages")
            }}>Show processed data messages</Button>
            Bot is thinking: {isBotThinking ? 'Yes' : 'No'}
            Bot is responding: {isBotResponding ? 'Yes' : 'No'}
        </div>
    </div>
}

function DebugPannel({
    processedDataMessages
}) {
    return <div className="flex flex-col gap-2">
        {processedDataMessages.map((msg) => <div key={msg.uuid} className="flex flex-row gap-2">
            <div className='w-[100px]'>{msg.data_message.data.signal}</div>
            <div className='max-w-[400px]'>{JSON.stringify(msg)}</div>
        </div>)}
    </div>
}

export function MessageScrollView({ chatId, chat, hideInput = false }) {
    const { sendMessage, dataMessages, processedDataMessages, removeDataMessage } = useContext(SocketContext)
    const [debugPannel, setDebugPannel] = useState(null)

    const [text, setText] = useState("");


    const [isBotResponding, setIsBotResponding] = useState(false)
    const [isBotThinking, setIsBotThinking] = useState(false)

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
            const newSignals = dataMessages.filter(segment => (segment.data_message.data_type === 'signal' && segment.chat === chatId));

            if (newSignals.length > 0) {
                let startResponding = newSignals.some(signal => signal.data_message.data.signal === 'start-generating-response');
                let isBotResponding = newSignals.some(signal => signal.data_message.data.signal === 'generating-response');
                let doneResponding = newSignals.some(signal => signal.data_message.data.signal === 'finished-generating-response');

                if (startResponding) {
                    scrollToBottom();
                    setIsBotThinking(true);
                }

                if (isBotResponding) {
                    setIsBotResponding(true);
                    setIsBotThinking(false);
                }

                if (doneResponding) {
                    setIsBotResponding(false);
                    setIsBotThinking(false);
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
        const insertNewMessage = (message) => {
            dispatch(updateNewestMessage({ chatId: chat.uuid, message: message }))
            dispatch(replaceMessage({
                chatId: chat.uuid,
                message: message
            }))
            setTimeout(() => {
                scrollToBottom()
                setSendIsLoading(false)
            }, 50)
        }

        if (chat.partner.is_bot) {
            api.messagesSendDataCreate(chat.uuid, {
                text: inputRef.current?.value,
                hide_message: false,
                data_type: DataTypeEnum.Signal,
                data: {
                    signal: "start-text-chat"
                }
            }).then((res) => {
                insertNewMessage(res)
            }).catch((err) => {
                setSendIsLoading(false)
                toast.error(`Failed to send message: ${err}`)
            })
        } else {
            api.messagesSendCreate(chat.uuid, { text: inputRef.current?.value }).then((res) => {
                insertMessage(res)
            }).catch((err) => {
                setSendIsLoading(false)
                toast.error(`Failed to send message: ${err}`)
            })
        }

    }

    const onStopBotResponse = () => {
        console.log('Sending stop-generating-response signal')
        sendDataMessage(`Signal: Stopping bot response`, {
            hide_message: true,
            data_type: 'signal',
            data: {
                signal: 'stop-generating-response'
            }
        }, false);
    }

    return <div className="flex flex-col h-full w-full lg:max-w-[900px] relative">
        <div ref={scrollRef} className="flex flex-col flex-grow gap-2 items-center content-center overflow-y-scroll relative pb-4 pt-2">
            {SHOW_DEBUG_PANEL && <DebugBar debugPannel={debugPannel} setDebugPannel={setDebugPannel} isBotThinking={isBotThinking} isBotResponding={isBotResponding} />}
            {debugPannel === "data_messages" && <DebugPannel processedDataMessages={processedDataMessages} />}
            {!debugPannel && <>
                {isLoading && <div>Loading...</div>}
                {messages && messages.results.map((message) => <MessageItem key={`msg_${message.uuid}`} message={message} chat={chat} selfIsSender={user?.uuid === message.sender} />).reverse()}
                {isBotThinking && <PendingMessageItem />}
                {/*isBotResponding && <PendingMessageItem text="Responding..." />*/}
                {partialMessage && <MessageItem key={`msg_${partialMessage.uuid}`} message={partialMessage} chat={chat} selfIsSender={user?.uuid === partialMessage.sender} />}
            </>}
        </div>
        {!hideInput && <MessageInput text={text} setText={setText} isLoading={sendIsLoading || isLoading} isBotResponding={isBotResponding} stopBotResponse={onStopBotResponse} onSendMessage={onSendMessage} ref={inputRef} />}
    </div>
}
