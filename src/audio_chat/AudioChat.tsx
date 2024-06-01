import { useState } from 'react';
import { useSelector } from 'react-redux';
import WebsocketBridge from '../atoms/WebsocketBridge';
import { MessageScrollView } from '../chat/MessageScrollView';
import { ChatLoader, ChatsLoader } from '../loaders/ChatsLoader';
import { ChatMessagesLoader } from '../loaders/MessagesLoader';
import { getChatByChatId } from '../store/chats';
import { RootState } from '../store/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function AudioLevelDisplay() {
    const dbfsLevels = [-60, -50, -40, -30, -20]

    const dbfsToHeight = (dbfs: number) => {
        return 100 - (dbfs + 60) * 2
    }

    return (
        <div className='h-[150px] flex flex-row items-center content-center justify-center gap-2'>
            {dbfsLevels.map((dbfs) => (
                <div
                    key={dbfs}
                    className='w-[30px] rounded-full bg-info'
                    style={{ height: dbfsToHeight(dbfs) + '%' }}
                ></div>
            ))}
        </div>
    )
}

export function ToggleRecordingButton({
    isRecording,
    setIsRecording
}) {
    // Implementation here...
}

export function AudioChatRecorder({
    chatId,
    isRecording,
    setIsRecording,
}) {

    const chat = useSelector((state: RootState) => getChatByChatId(state, chatId))

    console.log('chat', chat)

    return (
        <div className="grid grid-rows-[1fr_auto_auto] h-full w-full">
            <div className='relative overflow-hidden'>
                <div className='flex flex-col h-full'>
                    <Tabs defaultValue="messages" className="flex flex-col h-full w-full">
                        <TabsList className='flex-shrink-0'>
                            <TabsTrigger value="messages">Messages</TabsTrigger>
                            <TabsTrigger value="password">Data Messages</TabsTrigger>
                        </TabsList>
                        <TabsContent value="messages" className="flex-grow bg-info relative overflow-hidden">
                            <div className="absolute inset-0 flex flex-col overflow-hidden">
                                {!chat && <div>Loading chat...</div>}
                                {chat && (
                                    <>
                                        <ChatMessagesLoader chatId={chatId} />
                                        <MessageScrollView chat={chat} chatId={chatId} hideInput={true} className="flex-grow overflow-auto" />
                                    </>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="password">Change your password here.</TabsContent>
                    </Tabs>
                </div>
            </div>
            <div className='flex w-full bg-error h-[200px] items-center justify-center'>
                <AudioLevelDisplay />
            </div>
            <div className='flex flex-row w-full h-[150px] items-center justify-center p-4 gap-[300px]'>
                <div className='h-[80px] w-[80px] rounded-full bg-info'>
                    Y
                </div>
                <div className='h-[80px] w-[80px] rounded-full bg-info'>
                    X
                </div>
            </div>
        </div>
    )
}

export function AudioChatBase() {
    const chatId = useSelector((state: RootState) => state.pageProps.search?.chatId)
    const [isRecording, setIsRecording] = useState(false);

    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <ChatLoader chatId={chatId} />
            {!chatId && <div>No 'chatId' search params specified</div>}
            {chatId && <AudioChatRecorder
                chatId={chatId}
                isRecording={isRecording}
                setIsRecording={setIsRecording}
            />}
        </div>
    )
}

export function AudioChat() {
    return (
        <WebsocketBridge>
            <ChatsLoader />
            <AudioChatBase />
        </WebsocketBridge>
    )
}