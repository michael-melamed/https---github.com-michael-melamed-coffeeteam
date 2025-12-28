// ============================================================================
// CoffeeTeam Pro - BlockCard Component
// ============================================================================

import { useState } from 'react';
import { Block } from '../../types';
import { Trash2 } from 'lucide-react';

interface BlockCardProps {
    block: Block;
    onEdit: (block: Block) => void;
    onDelete: (blockId: string) => void;
}

export default function BlockCard({ block, onEdit, onDelete }: BlockCardProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [longPressTimer, setLongPressTimer] = useState<number | null>(null);

    const getDrinkEmoji = (drink: string): string => {
        if (drink.includes('הפוך') || drink.includes('קפה')) return '☕';
        if (drink.includes('אספרסו')) return '☕';
        if (drink.includes('שוקו')) return '🍫';
        if (drink.includes('תה')) return '🍵';
        return '☕';
    };

    const handleMouseDown = () => {
        const timer = setTimeout(() => {
            setShowDeleteConfirm(true);
        }, 800);
        setLongPressTimer(timer);
    };

    const handleMouseUp = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
    };

    const handleClick = () => {
        if (!showDeleteConfirm) {
            onEdit(block);
        }
    };

    const handleDelete = () => {
        onDelete(block.id);
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <div
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                className="bg-white border-2 border-gray-300 rounded-lg p-3 min-w-[280px] min-h-[80px] cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-all"
            >
                <div className="flex flex-col gap-1">
                    {/* Line 1: Emoji + Drink */}
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{getDrinkEmoji(block.drink)}</span>
                        <span className="font-bold text-lg text-gray-800">{block.drink}</span>
                    </div>

                    {/* Line 2: Size + Milk */}
                    {(block.size || block.milk) && (
                        <div className="text-sm text-gray-600">
                            {block.size && <span>{block.size}</span>}
                            {block.size && block.milk && <span> • </span>}
                            {block.milk && <span>{block.milk}</span>}
                        </div>
                    )}

                    {/* Line 3: Temperature + Strength */}
                    {(block.temperature || block.strength) && (
                        <div className="text-sm text-gray-600">
                            {block.temperature && <span>{block.temperature}</span>}
                            {block.temperature && block.strength && <span> • </span>}
                            {block.strength && <span>{block.strength}</span>}
                        </div>
                    )}

                    {/* Line 4: Extras */}
                    {block.extras.length > 0 && (
                        <div className="text-sm text-amber-700">
                            {block.extras.join(', ')}
                        </div>
                    )}

                    {/* Notes */}
                    {block.notes && (
                        <div className="text-xs text-gray-500 italic mt-1">
                            {block.notes}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
                    <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
                        <div className="text-center mb-4">
                            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-2" />
                            <h3 className="text-xl font-bold text-gray-800">למחוק בלוק?</h3>
                            <p className="text-gray-600 mt-2">{block.drink}</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDelete}
                                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600"
                            >
                                מחק
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400"
                            >
                                ביטול
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
