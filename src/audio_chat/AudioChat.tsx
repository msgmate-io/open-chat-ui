import { useSelector } from 'react-redux';
import WebsocketBridge from '../atoms/WebsocketBridge';
import { ChatLoader, ChatsLoader } from '../loaders/ChatsLoader';
import { getChatByChatId } from '../store/chats';
import { RootState } from '../store/store';
import { AudioChatRecorder } from './AudioChatRecorder';

export function AudioChatPreloader({ chatId }) {
    const chat = useSelector((state: RootState) => getChatByChatId(state, chatId))
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <ChatLoader chatId={chatId} />
            {!chatId && <div>No 'chatId' search params specified</div>}
            {!chat && <div>'chat' not yet loaded, fetching ...</div>}
            {(chatId && chat) && <AudioChatRecorder
                chat={chat}
                chatId={chatId}
            />}
        </div>
    )
}

export function AudioChatBase() {
    const chatId = useSelector((state: RootState) => state.pageProps.search?.chatId)

    return <AudioChatPreloader chatId={chatId} />
}

export function AudioChat() {
    return (
        <WebsocketBridge>
            <ChatsLoader />
            <AudioChatBase />
        </WebsocketBridge>
    )
}