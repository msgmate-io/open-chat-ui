import { useEffect, useState } from 'react';
import { AudioLevelDisplay } from './AudioLevelDisplay';

export function AudioLevelMonitor({ analyserNode }) {
    const [audioLevels, setAudioLevels] = useState([-100, -100, -100, -100, -100, -100, -100]);

    useEffect(() => {
        if (!analyserNode) return;

        const updateAudioLevels = () => {
            const bufferLength = analyserNode.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyserNode.getByteFrequencyData(dataArray);
            const sum = dataArray.reduce((acc, val) => acc + val, 0);
            const avg = sum / bufferLength;
            const normalized = avg - 100;
            console.log("avg", avg);
            setAudioLevels(prevLevels => [...prevLevels.slice(1), normalized]);
        };

        const intervalId = setInterval(updateAudioLevels, 100); // Adjust the interval for desired update frequency

        return () => {
            clearInterval(intervalId);
        };
    }, [analyserNode]);

    return (
        <div>
            <AudioLevelDisplay levels={audioLevels} className='bg-error' />
        </div>
    );
}