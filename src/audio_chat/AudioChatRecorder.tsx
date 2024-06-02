import { SocketContext, buildMessage } from '../atoms/WebsocketBridge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { base64ToBlob, blobToBase64 } from './audioChatUtils';

import { useContext, useEffect, useRef, useState } from 'react';
import { MessageScrollView } from '../chat/MessageScrollView';
import { ChatMessagesLoader } from '../loaders/MessagesLoader';

import toWav from 'audiobuffer-to-wav';
import { AudioLevelDisplay } from './AudioLevelDisplay';
import { ToggleRecordingButton } from './ToggleRecordingButton';

export function AudioChatRecorder({
    chat,
    chatId,
    intervalMs = 200
}) {

    const { sendMessage, dataMessages, removeDataMessage } = useContext(SocketContext);
    const [outDataMessages, setOutDataMessages] = useState([]);
    const audioContextRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const intervalIdRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);

    const recipientId = chat.partner.uuid;

    const [audioQueue, setAudioQueue] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);

    const sendDataMessage = (text, dataMessage) => {
        const message = {
            chat_id: chatId,
            recipient_id: chat.partner.uuid,
            text: text,
            data_message: dataMessage
        }
        const payloadMessage = buildMessage(message, 'send_message')

        setOutDataMessages((prev) => [...prev, message]);
        sendMessage(payloadMessage)
    }

    const startRecording = async () => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBuffer = await audioContextRef.current.decodeAudioData(await new Response(new Blob(audioChunksRef.current)).arrayBuffer());
            const wavData = toWav(audioBuffer);
            const blob = new Blob([wavData], { type: 'audio/wav' });

            audioChunksRef.current = [];

            //const url = URL.createObjectURL(blob);
            //setAudioURLs((prev) => [...prev, url]);

            const base64EncodedAudio = await blobToBase64(blob);
            const sizeInMB = blob.size / (1024 * 1024);
            const timestamp = new Date().toISOString();
            console.log(`Audio segment size: ${sizeInMB.toFixed(2)} MB`);
            sendDataMessage(`Audio segment send at: ${timestamp}`, {
                hide_message: true,
                data_type: 'audio_b64',
                data: {
                    audio: base64EncodedAudio
                }
            })
        };

        mediaRecorder.start();

        intervalIdRef.current = setInterval(() => {
            mediaRecorder.stop();
            mediaRecorder.start();
        }, intervalMs);

        mediaRecorderRef.current = mediaRecorder;
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
        }
    };

    useEffect(() => {
        if (isRecording) {
            startRecording();
        } else {
            stopRecording();
        }

        return () => {
            stopRecording();
        };
    }, [isRecording]);


    useEffect(() => {
        if (audioQueue.length > 0 && !isPlaying) {
            playAudioQueue();
        }
    }, [audioQueue, isPlaying]);

    const playAudioQueue = async () => {
        if (audioQueue.length === 0) return;

        setIsPlaying(true);

        while (audioQueue.length > 0) {
            const audioB64 = audioQueue.shift();
            const audioBlob = base64ToBlob(audioB64.b64, 'audio/wav');
            const audioURL = URL.createObjectURL(audioBlob);

            const audio = new Audio(audioURL);
            await new Promise((resolve) => {
                audio.onended = resolve;
                audio.play();
            });
        }

        setIsPlaying(false);
    };


    const onToggleRecording = (nowRecording) => {
        setIsRecording(nowRecording)
        if (nowRecording) {
            sendDataMessage(`Signal: start-recording`, {
                hide_message: true,
                data_type: 'signal',
                data: {
                    signal: 'start-recording'
                }
            })
        } else {
            sendDataMessage(`Signal: stop-recording`, {
                hide_message: true,
                data_type: 'signal',
                data: {
                    signal: 'stop-recording'
                }
            })
        }
    }

    console.log('chat', chat)

    return (
        <div className="grid grid-rows-[1fr_auto_auto] h-full w-full">
            <div className='relative overflow-hidden'>
                <div className='flex flex-col h-full'>
                    <Tabs defaultValue="messages" className="flex flex-col h-full w-full">
                        <TabsList className='flex-shrink-0'>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                            <TabsTrigger value="messages">Messages</TabsTrigger>
                            <TabsTrigger value="data_messages_in">Data Messages (in)</TabsTrigger>
                            <TabsTrigger value="data_messages_out">Data Messages (out)</TabsTrigger>
                        </TabsList>
                        <TabsContent value="preview" className="flex-grow relative overflow-hidden">
                            <div className="absolute inset-0 flex flex-col overflow-hidden items-center content-center justify-center">
                                Preview
                            </div>
                        </TabsContent>
                        <TabsContent value="messages" className="flex-grow relative overflow-hidden">
                            <div className="absolute inset-0 flex flex-col overflow-hidden items-center content-center justify-center">
                                {!chat && <div>Loading chat...</div>}
                                {chat && (
                                    <>
                                        <ChatMessagesLoader chatId={chatId} />
                                        <MessageScrollView chat={chat} chatId={chatId} hideInput={true} />
                                    </>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="data_messages_in" className="flex-grow relative overflow-hidden">
                            <div className="absolute inset-0 flex flex-col overflow-hidden items-center content-center justify-center">
                                <div className='flex flex-col gap-2 f-full overflow-y-auto'>
                                    {dataMessages.length === 0 && <div>No data messages</div>}
                                    {dataMessages.map((dataMessage, index) => (
                                        <div>
                                            {dataMessage.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="data_messages_out" className="flex-grow relative overflow-hidden">
                            <div className="absolute inset-0 flex flex-col overflow-hidden items-center content-center justify-center">
                                <div className='flex flex-col gap-2 f-full overflow-y-auto'>
                                    {outDataMessages.length === 0 && <div>No data messages</div>}
                                    {outDataMessages.map((dataMessage, index) => (
                                        <div>
                                            {dataMessage.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <div className='flex w-full h-[200px] items-center justify-center'>
                <AudioLevelDisplay />
            </div>
            <div className='flex flex-row w-full h-[150px] items-center justify-center p-4 gap-[300px]'>
                <div className='h-[80px] w-[80px] rounded-full bg-info'>
                    Y
                </div>
                <ToggleRecordingButton isRecording={isRecording} setIsRecording={onToggleRecording} />
            </div>
        </div >
    )
}