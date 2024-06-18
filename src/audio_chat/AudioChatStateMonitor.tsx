import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context';
import { cn } from '../lib/utils';
import { AudioLevelDisplay } from './AudioLevelDisplay';
import { AudioLevelMonitor } from './AudioLevelMonitor';

export function StateLogoMonitor({
    className,
    onClick = () => { },
    clickedClass = "bg-red-500",
    defaultClass = "bg-blue-500",
    text = "State Indicator",
    textClass = "text-white bg-black bg-opacity-50 rounded px-2 py-1 shadow-lg"
}) {
    const { logoUrl } = useContext(GlobalContext);

    const [logoClicked, setLogoClicked] = useState(false);

    const handleLogoClick = () => {
        setLogoClicked(!logoClicked);
        onClick && onClick();
    };

    return (
        <div className="relative inline-block">
            <img
                src={logoUrl}
                alt="logo"
                className={cn(
                    "w-[300px] h-[300px] fill-current text-primary",
                    className,
                    logoClicked ? clickedClass : defaultClass
                )}
                onClick={handleLogoClick}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className={cn("text-center", textClass)}>
                    {text}
                </span>
            </div>
        </div>
    );
}

export function AudioChatStateMonitor({
    audioState,
    inputLevels,
    currentAnalyserNode
}) {
    const [bootLogoClicked, setBootLogoClicked] = useState(false);

    return <>
        {audioState === "booted" &&
            <StateLogoMonitor
                className={cn("filter -hue-rotate-60 hover:filter-none", {
                    "transform scale-90": bootLogoClicked,
                })}
                clickedClass="scale-90"
                defaultClass="scale-100"
                text="Booted"
                textClass="text-white bg-base-200 bg-opacity-75 rounded-full px-4 py-2 shadow-lg"
                onClick={() => setBootLogoClicked(true)}
            />
        }
        {audioState === "interrupting" &&
            <StateLogoMonitor
                className="filter grayscale hover:filter-none animate-spin"
                clickedClass="scale-110"
                defaultClass="scale-100"
                text="Interrupting"
                textClass="text-white bg-yellow-600 bg-opacity-75 rounded-full px-4 py-2 shadow-lg"
            />
        }
        {audioState === "ready" &&
            <StateLogoMonitor
                className="filter -hue-rotate-60 hover:filter-none"
                clickedClass="scale-110"
                defaultClass="scale-100"
                text="Ready"
                textClass="text-white bg-base-100 bg-opacity-75 rounded-full px-4 py-2 shadow-lg"
            />
        }
        {audioState === "thinking" &&
            <StateLogoMonitor
                className={cn("filter hover:-hue-rotate-60 animate-pulse", {
                    "transform scale-90": bootLogoClicked,
                })}
                clickedClass="scale-90"
                defaultClass="scale-100"
                text="Thinking"
                textClass="text-white bg-base-200 bg-opacity-75 rounded-full px-4 py-2 shadow-lg"
                onClick={() => setBootLogoClicked(true)}
            />
        }
        {audioState === "listening" && <AudioLevelDisplay levels={inputLevels} />}
        {audioState === "speaking" && <AudioLevelMonitor analyserNode={currentAnalyserNode} />}
    </>
}