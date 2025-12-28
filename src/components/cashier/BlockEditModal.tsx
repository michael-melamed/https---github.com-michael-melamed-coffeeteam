// ============================================================================
// CoffeeTeam Pro - BlockEditModal Component
// ============================================================================

import { useState } from 'react';
import { Block, generateUUID } from '../../types';
import { X } from 'lucide-react';

interface BlockEditModalProps {
    block: Block;
    onSave: (block: Block) => void;
    onCancel: () => void;
}

const DRINKS = ['הפוך', 'אספרסו', 'אמריקנו', 'לאטה', 'מקיאטו', 'שחור', 'שוקו', 'תה'];
const SIZES = ['קטן', 'בינוני', 'גדול'];
const MILK_TYPES = ['רגיל', 'דל שומן', 'שקדים', 'סויה', 'קוקוס', 'שיבולת שועל'];
const TEMPERATURES = ['חם', 'פושר', 'רותח', 'קר', 'קפוא'];
const STRENGTHS = ['חזק', 'רגיל', 'חלש'];
const EXTRAS = ['סירופ', 'וניל', 'קרמל', 'שוקולד', 'קצפת', 'קינמון', 'קקאו', 'דבש'];

export default function BlockEditModal({ block, onSave, onCancel }: BlockEditModalProps) {
    const [editedBlock, setEditedBlock] = useState<Block>({ ...block });

    const handleSave = () => {
        onSave(editedBlock);
    };

    const toggleExtra = (extra: string) => {
        const newExtras = editedBlock.extras.includes(extra)
            ? editedBlock.extras.filter(e => e !== extra)
            : [...editedBlock.extras, extra];
        setEditedBlock({ ...editedBlock, extras: newExtras });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" dir="rtl">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">עריכת בלוק</h2>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Drink Selector */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">משקה</label>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {DRINKS.map(drink => (
                                <button
                                    key={drink}
                                    onClick={() => setEditedBlock({ ...editedBlock, drink })}
                                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${editedBlock.drink === drink
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                >
                                    {drink}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">גודל</label>
                        <div className="grid grid-cols-3 gap-2">
                            {SIZES.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setEditedBlock({ ...editedBlock, size })}
                                    className={`py-3 rounded-lg font-medium ${editedBlock.size === size
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Milk */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">חלב</label>
                        <div className="grid grid-cols-3 gap-2">
                            {MILK_TYPES.map(milk => (
                                <button
                                    key={milk}
                                    onClick={() => setEditedBlock({ ...editedBlock, milk })}
                                    className={`py-3 rounded-lg font-medium text-sm ${editedBlock.milk === milk
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                >
                                    {milk}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Temperature */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">טמפרטורה</label>
                        <div className="grid grid-cols-3 gap-2">
                            {TEMPERATURES.map(temp => (
                                <button
                                    key={temp}
                                    onClick={() => setEditedBlock({ ...editedBlock, temperature: temp })}
                                    className={`py-3 rounded-lg font-medium ${editedBlock.temperature === temp
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                >
                                    {temp}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Strength */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">חוזק</label>
                        <div className="grid grid-cols-3 gap-2">
                            {STRENGTHS.map(strength => (
                                <button
                                    key={strength}
                                    onClick={() => setEditedBlock({ ...editedBlock, strength })}
                                    className={`py-3 rounded-lg font-medium ${editedBlock.strength === strength
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                >
                                    {strength}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Extras */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">תוספות</label>
                        <div className="grid grid-cols-4 gap-2">
                            {EXTRAS.map(extra => (
                                <button
                                    key={extra}
                                    onClick={() => toggleExtra(extra)}
                                    className={`py-2 rounded-lg font-medium text-sm ${editedBlock.extras.includes(extra)
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                >
                                    {extra}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">הערות</label>
                        <textarea
                            value={editedBlock.notes || ''}
                            onChange={(e) => setEditedBlock({ ...editedBlock, notes: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                            rows={3}
                            placeholder="הערות נוספות..."
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-amber-700"
                    >
                        שמור
                    </button>
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400"
                    >
                        ביטול
                    </button>
                </div>
            </div>
        </div>
    );
}
