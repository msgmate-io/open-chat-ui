import React, { useContext } from 'react';
import Markdown from 'react-markdown';
import { ChatResult, Message } from "../api/api";
import { CinematicLogo } from '../atoms/CinematicLogo';
import { GlobalContext } from '../context';

export function UserMessageItem({
    message,
    chat,
    selfIsSender = false
}: {
    message: Message,
    chat: ChatResult,
    selfIsSender?: boolean
}) {

    const isBotChat = chat?.partner?.is_bot
    return <div key={message.uuid} className="flex flex-row px-4 w-full relativ max-w-full">
        <div className="flex">
            <div className="w-8 m-2 hidden md:flex">
                {selfIsSender ? <div>🙂</div> : <div>👾</div>}
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

export function BotMessageItem({
    message,
    chat,
    selfIsSender = false
}: {
    message: Message,
    chat: ChatResult,
    selfIsSender?: boolean
}) {

    const { logoUrl } = useContext(GlobalContext)

    const isBotChat = chat?.partner?.is_bot
    return <div key={message.uuid} className="flex flex-row px-4 w-full relativ max-w-full">
        <div className="flex p-2 hidden md:flex">
            <img className="h-9 m-3 rounded-full ring-2 ring-base-300 dark:ring-gray-500 filter grayscale" src={logoUrl} />
        </div>
        <div className="w-full flex flex-col flex-grow relative">
            <div className="article prose w-95 pt-3 pl-1 overflow-x-scroll">
                <Markdown>{message.text}</Markdown>
            </div>
        </div>
    </div>
}




const ShinyText = ({ children }) => {
    return (
        <span className="shiny-text" data-content={children}>
            {children}
        </span>
    );
};

export function PendingMessageItem({
}) {

    const { logoUrl } = useContext(GlobalContext)

    return <div key={"pending"} className="flex flex-row px-4 w-full relativ max-w-full">
        <div className="flex p-2 hidden md:flex">
            <CinematicLogo className="h-9 m-3 rounded-full ring-2 ring-base-300 dark:ring-gray-500" size={30} />
        </div>
        <div className="w-full flex flex-col flex-grow relative">
            <div className="article prose w-95 pt-3 overflow-x-scroll">
                <ShinyText>Thinking...</ShinyText>
            </div>
        </div>
    </div>
}

function BotChatSelfMessageItem({
    message,
    chat,
    selfIsSender = false
}: {
    message: Message,
    chat: ChatResult,
    selfIsSender?: boolean
}) {
    return <div key={message.uuid} className="flex flex-row px-4 w-full relativ max-w-full">
        <div className="flex grow content-center items-end justify-end">
            <div className="article prose w-95 overflow-x-scroll p-2 px-4 rounded-2xl bg-base-200">
                <Markdown>{message.text}</Markdown>
            </div>
        </div>
    </div>
}

export function MessageItem({
    message,
    chat,
    selfIsSender = false
}: {
    message: Message,
    chat: ChatResult,
    selfIsSender?: boolean
}) {
    const isBotChat = chat?.partner?.is_bot
    if (!isBotChat) {
        return <UserMessageItem message={message} chat={chat} selfIsSender={selfIsSender} />
    }

    if (selfIsSender) {
        return <BotChatSelfMessageItem message={message} chat={chat} selfIsSender={selfIsSender} />
    } else {
        return <BotMessageItem message={message} chat={chat} selfIsSender={selfIsSender} />
    }
}