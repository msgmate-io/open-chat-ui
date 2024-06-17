import React from 'react';
import { AudioLevelDisplay } from './AudioLevelDisplay';
import { AudioLevelMonitor } from './AudioLevelMonitor';

export function AudioChatStateMonitor({
    audioState,
    inputLevels,
    currentAnalyserNode
}) {

    return <>
        {audioState === "booted" && <div className='flex h-[150px] w-[150px] rounded-full bg-info content-center justify-center items-center hover:bg-error'>
            booted
        </div>}
        {audioState === "interrupting" && <div className='flex h-[150px] w-[150px] rounded-full bg-error content-center justify-center items-center'>
            interrupting
        </div>}
        {audioState === "ready" && <div className='flex h-[150px] w-[150px] rounded-full bg-success content-center justify-center items-center'>
            ready
        </div>}
        {audioState === "thinking" && <div className='flex h-[150px] w-[150px] rounded-full bg-warning animate-pulse content-center justify-center items-center'>
            thinking
        </div>}
        {audioState === "listening" && <AudioLevelDisplay levels={inputLevels} />}
        {audioState === "speaking" && <AudioLevelMonitor analyserNode={currentAnalyserNode} />}
    </>
}
