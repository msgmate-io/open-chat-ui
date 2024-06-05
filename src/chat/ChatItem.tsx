import React, { useContext } from 'react';
import { ChatResult } from "../api/api";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { ChatSettings } from "./ChatSettings";

import { OnlineIndicator } from "../atoms/OnlineIndicator";
import { UnreadBadge } from "../atoms/UnreadBadge";
import { GlobalContext } from "../context";


export function PendingChatItem() {
    return <Card className="bg-base-200 animate-pulse hover:bg-base-300 p-0 flex" key={"chatListHeader"}>
        <CardHeader className="p-2">
            <CardTitle><span className="shadow text-base-300">{"...    "}</span></CardTitle>
            <CardDescription className="flex text-nowrap whitespace-nowrap overflow-x-hidden text-base-300">{"...."}</CardDescription>
        </CardHeader>
    </Card>
}

export function ChatItem({ chat, isSelected = false }: {
    chat: ChatResult,
    isSelected?: boolean
}) {
    const [settingsOpen, setSettingsOpen] = useState(false)
    const { navigate } = useContext(GlobalContext);


    return (
        <>
            <ChatSettings chat={chat} open={settingsOpen} setOpen={setSettingsOpen} >
                <Card className={cn(
                    "bg-base-200 hover:bg-base-300 p-0",
                    settingsOpen && "bg-accent bg-opacity-10 pointer-events-none hover:bg-opacity-10",
                    isSelected && "bg-accent bg-opacity-10 hover:bg-opacity-10"
                )} key={chat.uuid} onClick={() => {
                    if (!settingsOpen) {
                        navigate({ chat: chat.uuid })
                    }
                }}>
                    <CardHeader className="p-2">
                        <CardTitle className="flex flex-row">
                            <div className="flex flex-grow">{chat?.settings?.title ? chat?.settings?.title : `${chat.partner.first_name} ${chat.partner.second_name}`}</div>
                            <div className="relative bg-error">
                                <div className="absolute right-0 flex flex-row">
                                    <UnreadBadge chat={chat} />
                                    <OnlineIndicator is_online={chat?.partner?.is_online} />
                                    <Button className="flex h-6 w-6 px-0 content-center items-center justify-center bg-transparent hover:bg-base-200" onClick={(e) => {
                                        setSettingsOpen(!settingsOpen)
                                        e.stopPropagation()
                                    }}>⚙</Button>
                                </div>
                            </div>
                        </CardTitle>
                        <CardDescription className="flex text-nowrap whitespace-nowrap overflow-x-hidden">{chat.newest_message.text}</CardDescription>
                    </CardHeader>
                </Card>
                <DropdownMenuTrigger className="h-0 bg-error z-10 display-none"></DropdownMenuTrigger>
            </ChatSettings>
        </>
    )
}