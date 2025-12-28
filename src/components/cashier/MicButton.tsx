// ============================================================================
// CoffeeTeam Pro - MicButton Component
// ============================================================================

import { Mic, Square, Loader2, X } from 'lucide-react';

type MicButtonState = 'IDLE' | 'RECORDING' | 'PROCESSING' | 'ERROR';

interface MicButtonProps {
    state: MicButtonState;
    onStart: () => void;
    onStop: () => void;
}

export default function MicButton({ state, onStart, onStop }: MicButtonProps) {
    const handleClick = () => {
        if (state === 'IDLE') {
            onStart();
        } else if (state === 'RECORDING') {
            onStop();
        }
    };

    const getButtonClass = () => {
        const base = 'w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-lg';

        switch (state) {
            case 'IDLE':
                return `${base} bg-gray-400 hover:bg-gray-500`;
            case 'RECORDING':
                return `${base} bg-red-500 animate-pulse`;
            case 'PROCESSING':
                return `${base} bg-orange-500`;
            case 'ERROR':
                return `${base} bg-red-600`;
            default:
                return base;
        }
    };

    const getIcon = () => {
        switch (state) {
            case 'IDLE':
                return <Mic className="w-12 h-12 text-white" />;
            case 'RECORDING':
                return <Square className="w-12 h-12 text-white" />;
            case 'PROCESSING':
                return <Loader2 className="w-12 h-12 text-white animate-spin" />;
            case 'ERROR':
                return <X className="w-12 h-12 text-white" />;
        }
    };

    const getText = () => {
        switch (state) {
            case 'IDLE':
                return 'הקש להקלטה';
            case 'RECORDING':
                return 'מאזין...';
            case 'PROCESSING':
                return 'מעבד...';
            case 'ERROR':
                return 'שגיאה';
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                onClick={handleClick}
                disabled={state === 'PROCESSING' || state === 'ERROR'}
                className={getButtonClass()}
            >
                {getIcon()}
            </button>
            <p className="text-lg font-medium text-gray-700">{getText()}</p>
        </div>
    );
}
