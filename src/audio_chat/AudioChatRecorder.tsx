import toWav from 'audiobuffer-to-wav';
import { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext, buildMessage } from '../atoms/WebsocketBridge';
import { MessageScrollView } from '../chat/MessageScrollView';
import { ChatMessagesLoader } from '../loaders/MessagesLoader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AudioChatStateMonitor } from './AudioChatStateMonitor';
import { ToggleRecordingButton } from './ToggleRecordingButton';
import { base64ToBlob, blobToBase64 } from './audioChatUtils';

const AUTO_RECORD = true;

export function AudioChatRecorder({ chat, chatId, intervalMs = 200 }) {
    const { sendMessage, dataMessages, removeDataMessage } = useContext(SocketContext);
    const [audioState, setAudioState] = useState("booted");

    const [isReceivingResponseSteam, setIsReceivingResponseSteam] = useState(false);

    const [outDataMessages, setOutDataMessages] = useState([]);
    const audioContextRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const intervalIdRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [processedDataMessages, setProcessedDataMessages] = useState([]);
    const [audioLevels, setAudioLevels] = useState([-100, -100, -100, -100, -100, -100, -100]);
    const [analyser, setAnalyser] = useState(null);

    const recipientId = chat.partner.uuid;
    const [audioQueue, setAudioQueue] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const currentAudioRef = useRef(null);

    const sendDataMessage = (text, dataMessage, isPartial = false, tmpId = null) => {
        const message = {
            chat_id: chatId,
            recipient_id: chat.partner.uuid,
            text: text,
            data_message: dataMessage
        }
        if (isPartial && tmpId) {
            message['tmp_id'] = tmpId;
        }
        const payloadMessage = buildMessage(message, isPartial ? 'partial_message' : 'send_message');

        setOutDataMessages((prev) => [...prev, message]);
        sendMessage(payloadMessage);
    }

    useEffect(() => {
        if (!isReceivingResponseSteam && !isPlaying && (audioState === "ready") && AUTO_RECORD) {
            onToggleRecording(true);
            setAudioState("listening");
        }

    }, [isReceivingResponseSteam, isPlaying, audioState]);

    useEffect(() => {
        if (dataMessages.length > 0) {
            const segegmentUUIDs = dataMessages.map(segment => segment.uuid);
            const audiDataMessages = dataMessages.filter(segment => segment.data_message.data_type === 'audio_b64');
            const newAudioSegments = audiDataMessages.filter(segment => !audioQueue.some(audio => segegmentUUIDs.includes(audio.uuid)));
            const newSignals = dataMessages.filter(segment => segment.data_message.data_type === 'signal');

            let dbfsUpdate = newSignals.filter(signal => signal.data_message.data.signal === 'dbfs-level-update');
            if (dbfsUpdate.length > 0) {
                dbfsUpdate = dbfsUpdate[0];
                setAudioLevels((prev) => {
                    const newLevels = dbfsUpdate.data_message.data.levels;
                    return newLevels;
                });
            }

            let audioReceiveReady = newSignals.filter(signal => signal.data_message.data.signal === 'ready-to-receive-audio');

            if (audioReceiveReady.length > 0) {
                audioReceiveReady = audioReceiveReady[0];
                setAudioState("listening");
            }

            let stopRecordingAcknowledged = newSignals.filter(signal => signal.data_message.data.signal === 'stop-recording-acknowledged');

            if (stopRecordingAcknowledged.length > 0) {
                stopRecordingAcknowledged = stopRecordingAcknowledged[0];
                setAudioState("thinking");
            }

            let startStreamingAudioResponse = newSignals.filter(signal => signal.data_message.data.signal === 'start-streaming-audio-response');

            let isSpeaking = isPlaying || isReceivingResponseSteam;
            if (startStreamingAudioResponse.length > 0) {
                startStreamingAudioResponse = startStreamingAudioResponse[0];
                setAudioState("speaking");
                isSpeaking = true;
                setIsReceivingResponseSteam(true);
            }

            // stop-streaming-audio-response
            // 
            let stopStreamingAudioResponse = newSignals.filter(signal => signal.data_message.data.signal === 'stop-streaming-audio-response');
            if (stopStreamingAudioResponse.length > 0) {
                stopStreamingAudioResponse = stopStreamingAudioResponse[0];
                setIsReceivingResponseSteam(false);
                if (!isPlaying) {
                    setAudioState("ready");
                }
            }


            const newlyProcessedDataMessages = newSignals.concat(newAudioSegments);
            for (const dataMsg of newlyProcessedDataMessages) {
                removeDataMessage(dataMsg.uuid);
            }
            setProcessedDataMessages((prev) => [...prev, ...newlyProcessedDataMessages]);

            if (isSpeaking) {
                const b64AudioSegments = newAudioSegments.map(segment => ({
                    b64: segment.data_message.data['audio'],
                    uuid: segment.uuid
                }));
                setAudioQueue((prevQueue) => [...prevQueue, ...b64AudioSegments]);
            }
        }
    }, [dataMessages]);

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
            }, true, `tmp-audio-segment-${timestamp}`);
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
        setAudioState('speaking');

        const analyser = audioContextRef.current.createAnalyser();
        analyser.fftSize = 32;
        setAnalyser(analyser); // Set the analyser node state

        const audioToProcess = audioQueue;
        setAudioQueue([]);

        while (audioToProcess.length > 0) {
            const audioB64 = audioToProcess.shift();
            const audioBlob = base64ToBlob(audioB64.b64, 'audio/wav');
            const audioURL = URL.createObjectURL(audioBlob);

            const audio = new Audio(audioURL);
            currentAudioRef.current = audio;  // Save reference to current audio
            const source = audioContextRef.current.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContextRef.current.destination);

            await new Promise((resolve) => {
                audio.onended = resolve;
                audio.play();
            });
        }

        if (!isReceivingResponseSteam) {
            setAudioState('ready');
        }
        setIsPlaying(false);
    };

    const onToggleRecording = (nowRecording) => {
        setIsRecording(nowRecording);
        if (nowRecording) {
            sendDataMessage(`Signal: start-recording`, {
                hide_message: true,
                data_type: 'signal',
                data: {
                    signal: 'start-recording'
                }
            });
        } else {
            sendDataMessage(`Signal: stop-recording`, {
                hide_message: true,
                data_type: 'signal',
                data: {
                    signal: 'stop-recording'
                }
            });
        }
    };

    const onInterruptPlayback = () => {
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current = null;
        }

        sendDataMessage(`Signal: interrupt-playback`, {
            hide_message: true,
            data_type: 'signal',
            data: {
                signal: 'interrupt-playback'
            }
        });

        setAudioQueue([]);
        setIsPlaying(false);
        setAudioState('ready');

    }

    return (
        <div className="grid grid-rows-[1fr_auto_auto] h-full w-full">
            <div className='relative overflow-hidden'>
                <div className='flex flex-col h-full'>
                    <Tabs defaultValue="messages" className="flex flex-col h-full w-full">
                        <TabsList className='flex-shrink-0'>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                            <TabsTrigger value="messages">Messages</TabsTrigger>
                            <TabsTrigger value="data_messages_in">Data Messages (in) [unprocessed]</TabsTrigger>
                            <TabsTrigger value="data_messages_in_processed">Data Messages (in) [processed]</TabsTrigger>
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
                                        <div key={index}>
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
                                        <div key={index}>
                                            {dataMessage.text}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="data_messages_in_processed" className="flex-grow relative overflow-hidden">
                            <div className="absolute inset-0 flex flex-col overflow-hidden items-center content-center justify-center">
                                <div className='flex flex-col gap-2 f-full overflow-y-auto'>
                                    {processedDataMessages.length === 0 && <div>No data messages</div>}
                                    {processedDataMessages.map((dataMessage, index) => (
                                        <div key={index}>
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
                <AudioChatStateMonitor audioState={audioState} inputLevels={audioLevels} currentAnalyserNode={analyser} />
            </div>
            <div className='flex flex-row w-full h-[150px] items-center justify-center p-4 gap-[300px]'>
                <div className='h-[80px] w-[80px] rounded-full bg-info' onClick={onInterruptPlayback}>
                    Interrupt playback
                </div>
                <ToggleRecordingButton isRecording={isRecording} setIsRecording={onToggleRecording} />
            </div>
        </div>
    );
}