
import React from 'react';
import { Button } from "../ui/button";

import Markdown from 'react-markdown';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../ui/dialog";

export function ViewChatJsonModal({ chat }) {
    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="ghost" className="h-6 w-full" onClick={(e) => { }}>View Json</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Chat-Json</DialogTitle>
                <DialogDescription>
                    <div className="article prose max-h-80 overflow-x-scroll max-w-md">
                        <Markdown>
                            {"```\n" + JSON.stringify(chat, null, 2) + "\n```"}
                        </Markdown>
                    </div>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
}

