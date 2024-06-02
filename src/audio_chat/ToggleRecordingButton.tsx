import { cn } from '../lib/utils';

export function ToggleRecordingButton({
    isRecording,
    setIsRecording
}) {
    // Implementation here...
    return <div className={cn('flex h-[80px] hover:h-[70px] w-[80px] hover:w-[70px] hover:m-[5px] rounded-full bg-base-200 content-center justify-center items-center', {
        'bg-warning': isRecording
    })}
        onClick={() => setIsRecording(!isRecording)}>
        {isRecording ? 'Stop' : 'Start'}
    </div>
}