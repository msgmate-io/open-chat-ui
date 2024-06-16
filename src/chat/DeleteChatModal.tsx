import React from 'react';
import Markdown from 'react-markdown';
import { toast } from "sonner";
import { useApi } from "../api/client2";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

export function DeleteChatModal({ dialogOpen, setDialogOpen, chat, setMarkedForDeletion }) {
    const api = useApi();
    return <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Button variant="ghost" className="h-6 w-full" onClick={(e) => {
            setDialogOpen(true);
        }}>Delete Chat</Button>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                    <div className="article prose">
                        <Markdown>
                            **This action cannot be undone.** This will permanently delete your chat
                            and remove that chats data from our servers.
                            You can also archive your chat, allowing you to restore it later.

                            If this is your only chat with a `hidden` bot you will require the bots reveal code to start a new chat.
                        </Markdown>
                    </div>
                </DialogDescription>
                <DialogFooter>
                    <Button variant="outline" className="w-full" onClick={() => {
                        api.chatsDeleteCreate(chat?.uuid).then(() => {
                            setMarkedForDeletion(true)
                        }).catch((error) => {
                            setMarkedForDeletion(false)
                            toast.error(`Failed to delete chat: ${JSON.stringify(error)}`)
                        })
                        setDialogOpen(false)
                    }}>Delete</Button>
                </DialogFooter>
            </DialogHeader>
        </DialogContent>
    </Dialog>
}