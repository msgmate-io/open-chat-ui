import { forwardRef, useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Button } from "../ui/button";
import {
    Card,
} from "../ui/card";
import { Textarea } from "../ui/textarea";

interface MessageViewInputProps {
    isLoading?: boolean,
    onSendMessage?: () => void
}

export const MessageInput = forwardRef<
    HTMLTextAreaElement,
    MessageViewInputProps
>(({ isLoading = false, onSendMessage = () => { } }, ref) => {
    const [text, setText] = useState("");

    useEffect(() => {
        // @ts-ignore
        if (ref.current) {
            // @ts-ignore
            ref.current.style.height = 'inherit';
            // @ts-ignore
            const scrollHeight = ref.current.scrollHeight;
            // @ts-ignore
            ref.current.style.height = `${scrollHeight}px`;
        }
    }, [ref, text]);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    return (
        <Card className="bg-base-200 hover:bg-base-300 p-0 flex" key={"chatListHeader"}>
            <div className="flex">
                <img src={logo} className="h-12" alt="logo" />
            </div>
            <div className="flex flex-grow items-center content-center justify-start pr-2 relative py-2">
                <Textarea
                    value={text}
                    placeholder="Type a message..."
                    onChange={handleTextChange}
                    style={{
                        resize: "none",
                        height: "auto",
                        overflow: "auto"
                    }}
                    ref={ref}
                />
                <Button onClick={onSendMessage} disabled={isLoading}>
                    <div>✍️</div>
                    Send
                </Button>
            </div>
        </Card>
    );
});