import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useApi } from "../api/client2";
import { navigateSearch } from "../atoms/Link";
import { deleteChat, updateChatSettings } from "../store/chats";
import { DeleteChatModal } from "./DeleteChatModal";
import { ViewChatJsonModal } from "./ViewChatJsonModal";

export function ChatSettings({ chat, open, setOpen, children }) {

    const api = useApi()
    const dispatch = useDispatch()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [markedForDeletion, setMarkedForDeletion] = useState(false)

    const [extraName, setExtraName] = useState(chat?.settings?.title || "")
    const extraNameChanged = (extraName !== chat?.settings?.title) && extraName !== ""

    useEffect(() => {
        if (markedForDeletion) {
            dispatch(deleteChat({ chatId: chat?.uuid }))
        }
    }, [markedForDeletion])

    const onSaveExtraTitle = () => {
        api.chatsSettingsCreate(chat?.uuid, { title: extraName }).then((res) => {
            dispatch(updateChatSettings({ chatId: chat?.uuid, settings: res }))
        }).catch((error) => {
            toast.error(`Failed to save extra title: ${JSON.stringify(error)}`)
        })
    }

    const onResetExtraText = () => {
        setExtraName(chat?.settings?.title || "")
    }


    return <DropdownMenu open={open} onOpenChange={setOpen}>
        {children}
        <DropdownMenuContent className="w-56 pointer-events-none">
            <DropdownMenuLabel className="h-6">Chat Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex flex-row gap-1">
                <Input type="text" value={extraName} onChange={(e) => setExtraName(e.target.value)} placeholder="Extra name" className="h-6" />
                {(!extraName || !extraNameChanged) && <Button className="h-6 px-1 bg-base-200 hover:bg-accent">
                    ✍️
                </Button>}
                {(extraName && extraNameChanged) && <Button className="h-6 px-1 bg-base-200 hover:bg-accent" onClick={onSaveExtraTitle}>
                    ✅
                </Button>}
                {chat?.settings?.title && !extraNameChanged && <Button className="h-6 px-1 bg-base-200 hover:bg-accent">
                    🪣
                </Button>}
                {!chat?.settings?.title && !extraNameChanged && <Button className="h-6 px-1 bg-base-200 hover:bg-accent">
                    🕳️
                </Button>}
                {extraNameChanged && <Button className="h-6 px-1 bg-base-200 hover:bg-accent" onClick={onResetExtraText}>
                    ↩
                </Button>}
            </DropdownMenuLabel>
            {chat?.partner?.is_bot && <DropdownMenuLabel>
                <DeleteChatModal chat={chat} dialogOpen={deleteDialogOpen} setDialogOpen={setDeleteDialogOpen} setMarkedForDeletion={setMarkedForDeletion} />
            </DropdownMenuLabel>}
            <DropdownMenuLabel>
                <ViewChatJsonModal chat={chat} />
            </DropdownMenuLabel>
            <DropdownMenuLabel>
                <Button variant="outline" className="h-6 w-full" onClick={() => navigateSearch({
                    chatId: chat.uuid
                }, true, "/audioChat")}>Start Audio Chat</Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
        </DropdownMenuContent>
    </DropdownMenu>
}
