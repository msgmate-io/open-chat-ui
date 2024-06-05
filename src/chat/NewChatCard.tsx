import React, { useContext } from 'react';
import { GlobalContext } from "../context/GlobalContext";
import {
    Card,
} from "../ui/card";


export function NewChatCard() {
    const { logoUrl, navigate } = useContext(GlobalContext);

    return <Card className="bg-base-200 hover:bg-base-300 p-0 flex drop-shadow-xl z-10" key={"chatListHeader"}>
        <div className="flex">
            <img src={logoUrl} className="h-12" alt="logo" />
        </div>
        <div className="flex flex-grow items-center content-center justify-start pr-2" onClick={() => {
            navigate({ chat: "new" })
        }}>
            <div className="p-2 flex flex-grow">New Chat</div>
            <div>✍️</div>
        </div>
    </Card>
}
