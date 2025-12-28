// ============================================================================
// CoffeeTeam Pro - SendSlider Component
// ============================================================================

import { useState, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';

interface SendSliderProps {
    onSend: () => void;
    disabled?: boolean;
}

export default function SendSlider({ onSend, disabled = false }: SendSliderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragPosition, setDragPosition] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    const THRESHOLD = 0.8; // 80% of width

    const handleStart = () => {
        if (disabled) return;
        setIsDragging(true);
    };

    const handleMove = (clientX: number) => {
        if (!isDragging || !sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const position = Math.max(0, Math.min(1, (rect.right - clientX) / rect.width));
        setDragPosition(position);

        // Haptic feedback at threshold (if supported)
        if (position >= THRESHOLD && 'vibrate' in navigator) {
            navigator.vibrate(50);
        }
    };

    const handleEnd = () => {
        if (!isDragging) return;

        if (dragPosition >= THRESHOLD) {
            onSend();
            // Success animation
            setDragPosition(1);
            setTimeout(() => {
                setDragPosition(0);
                setIsDragging(false);
            }, 300);
        } else {
            setDragPosition(0);
            setIsDragging(false);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        handleStart();
        handleMove(e.clientX);
    };
    const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
    const handleMouseUp = () => handleEnd();

    const handleTouchStart = (e: React.TouchEvent) => {
        handleStart();
        handleMove(e.touches[0].clientX);
    };
    const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
    const handleTouchEnd = () => handleEnd();

    return (
        <div
            ref={sliderRef}
            className={`relative h-16 bg-gradient-to-l from-amber-500 to-amber-600 rounded-full overflow-hidden ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
                }`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            dir="rtl"
        >
            {/* Progress Bar */}
            <div
                className="absolute inset-0 bg-green-500 transition-all duration-200"
                style={{ width: `${dragPosition * 100}%` }}
            />

            {/* Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white font-bold text-lg">
                    {dragPosition >= THRESHOLD ? '✓ שולח...' : 'החלק לשליחה'}
                </span>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute right-2 top-2 bottom-2 w-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform"
                style={{
                    transform: `translateX(${-dragPosition * (sliderRef.current?.offsetWidth || 0) + 56}px)`
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <ChevronLeft className="w-6 h-6 text-amber-600" />
            </div>
        </div>
    );
}
