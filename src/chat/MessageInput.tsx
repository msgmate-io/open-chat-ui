import React, { forwardRef, useEffect, useState } from 'react';
import { Button } from "../ui/button";
import {
    Card,
} from "../ui/card";
import { Textarea } from "../ui/textarea";

interface MessageViewInputProps {
    isLoading?: boolean,
    onSendMessage?: () => void,
    isBotResponding?: boolean,
    stopBotResponse?: () => void
}

export const SendMessageButton = ({ onClick, isLoading }) => {
    return <Button
        onClick={onClick}
        disabled={isLoading}
        className="ml-2 bg-base-300 text-white p-2 rounded-full flex items-center justify-center"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
    </Button>
}

export const CancelResponseButton = ({ onClick }) => {
    return <Button
        onClick={onClick}
        className="ml-2 bg-base-300 text-white p-2 rounded-full flex items-center justify-center"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
    </Button>
}

export const MessageInput = forwardRef<
    HTMLTextAreaElement,
    MessageViewInputProps
>(({
    isLoading = false,
    onSendMessage = () => { },
    isBotResponding = false,
    stopBotResponse = () => { }
}, ref) => {
    const [text, setText] = useState("");

    useEffect(() => {
        if (ref.current) {
            ref.current.style.height = 'inherit';
            const scrollHeight = ref.current.scrollHeight;
            ref.current.style.height = `${scrollHeight}px`;
        }
    }, [ref, text]);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    return <div className='flex flex-col'>
        <Card className="bg-base-200 p-4 flex items-center rounded-3xl border-0" key={"chatListHeader"}>
            <Textarea
                value={text}
                placeholder="Send message to Msgmate.io"
                onChange={handleTextChange}
                className="flex-grow bg-base-200 p-2 rounded-2xl resize-none border-0 focus:border-0 outline-none focus:outline-none shadow-none focus:shadow-none"
                style={{
                    height: "auto",
                    overflow: "hidden"
                }}
                ref={ref}
            />
            {!isBotResponding ? <SendMessageButton onClick={onSendMessage} isLoading={isLoading} /> : <CancelResponseButton onClick={stopBotResponse} />}
        </Card>
        <div className='flex grow items-center content-center justify-center text-sm'>
            msgmate.io uses magic, be sceptical and verify information!
        </div>
    </div>
});