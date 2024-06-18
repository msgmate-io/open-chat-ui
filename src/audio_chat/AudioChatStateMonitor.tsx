import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context';
import { cn } from '../lib/utils';
import { AudioLevelDisplay } from './AudioLevelDisplay';
import { AudioLevelMonitor } from './AudioLevelMonitor';

export function AudioChatStateMonitor({
    audioState,
    inputLevels,
    currentAnalyserNode
}) {

    const { logoUrl } = useContext(GlobalContext)
    const [bootLogoClicked, setBootLogoClicked] = useState(false)

    return <>
        {audioState === "booted" &&
            <img src={logoUrl} alt="logo" className={cn("absolute filter -hue-rotate-60 w-[300px] h-[300px] hover:filter-none fill-current text-primary hover:scale-110", {
                "transform scale-90": bootLogoClicked,
            })} onClick={() => {
                setBootLogoClicked(true)
            }} />
        }
        {audioState === "interrupting" &&
            <img src={logoUrl} alt="logo" className="absolute filter grayscale w-[300px] h-[300px] hover:filter-none animate-spin" />
        }
        {audioState === "ready" && <div className='flex h-[150px] w-[150px] rounded-full bg-success content-center justify-center items-center'>
            ready
        </div>}
        {audioState === "thinking" &&
            <img src={logoUrl} alt="logo" className={cn("absolute filter hover:-hue-rotate-60 w-[300px] h-[300px] fill-current text-primary hover:scale-105 animate-pulse", {
                "transform scale-90": bootLogoClicked,
            })} onClick={() => {
                setBootLogoClicked(true)
            }} />
        }
        {audioState === "listening" && <AudioLevelDisplay levels={inputLevels} />}
        {audioState === "speaking" && <AudioLevelMonitor analyserNode={currentAnalyserNode} />}
    </>
}
