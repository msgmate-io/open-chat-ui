import React from 'react';
import Markdown from 'react-markdown';
import { ChatResult, Message } from "../api/api";

export function MessageItem({
    message,
    chat,
    selfIsSender = false
}: {
    message: Message,
    chat: ChatResult,
    selfIsSender?: boolean
}) {
    return <div key={message.uuid} className="flex flex-row px-4 w-full relativ max-w-full">
        <div className="flex">
            <div className="w-8 m-2 hidden md:flex">
                {selfIsSender ? <div>🙂</div> : <div>👾</div>}{/** TODO: fill icon from api in future */}
            </div>
        </div>
        <div className="w-full flex flex-col flex-grow relative">
            <div className="flex flex-row font-bold w-full">
                {selfIsSender ? "You" : `${chat?.partner?.first_name} ${chat?.partner?.second_name}`}
            </div>
            <div className="article prose w-95 overflow-x-scroll">
                <Markdown>{message.text}</Markdown>
            </div>
        </div>
    </div>
}