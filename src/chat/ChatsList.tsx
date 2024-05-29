import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ChatItem, PendingChatItem } from "./ChatItem";
import { ProfileCard } from "./ChatsProfileCard";
import { NewChatCard } from "./NewChatCard";

export function ChatsList() {
    const chats = useSelector((state: RootState) => state.chats.value?.results)
    const chatId = useSelector((state: RootState) => state.pageProps.search?.chat)
    return <div className="flex flex-col gap-0 h-full">
        <NewChatCard />
        <div className="flex flex-col flex-grow gap-1 overflow-y-scroll py-2">{
            chats ? chats.map(chat =>
                <ChatItem chat={chat} key={`chat_${chat.uuid}`} isSelected={chat.uuid === chatId} />)
                : Array.from({ length: 5 }).map((_, i) => <PendingChatItem key={`chat_${i}`} />)
        }</div>
        <ProfileCard />
    </div>
}
