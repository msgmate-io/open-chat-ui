import { useSelector } from "react-redux";
import WebsocketBridge from "../atoms/WebsocketBridge";
import { ChatsList } from "../chat/ChatsList";
import { CreateChatCard, MessagesView, NewChatCard } from "../chat/MessageView";
import { RootState } from "../store/store";
import { Toaster } from "../ui/sonner";
import { ResizableChatLayout } from "./ResizableChatLayout";

const chatMessageViews = ["new", "create"]

function ChatBase() {
    const chatId = useSelector((state: RootState) => state.pageProps.search?.chat)
    const userId = useSelector((state: RootState) => state.pageProps.search?.userId)

    return <>
        <div className="flex h-screen">
            <ResizableChatLayout
                left={<ChatsList />}
                right={<>
                    {!(chatMessageViews.indexOf(chatId) !== -1) && <MessagesView chatId={chatId} />}
                    {chatId === "new" && <NewChatCard />}
                    {chatId === "create" && <CreateChatCard userId={userId} />}
                </>}
            />
        </div>
    </>

}

export function Chat() {
    return <>
        <WebsocketBridge />
        <ChatBase />
        <Toaster />
    </>
}

export function ChatPage() {

}