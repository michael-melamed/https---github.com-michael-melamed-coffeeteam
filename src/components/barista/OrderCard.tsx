// ============================================================================
// CoffeeTeam Pro - OrderCard Component
// ============================================================================

import { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { Clock, User, CheckCircle2 } from 'lucide-react';

interface OrderCardProps {
    order: Order;
    onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
    onCancel: (orderId: string) => void;
}

export default function OrderCard({ order, onStatusChange, onCancel }: OrderCardProps) {
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

    const getStatusColor = (status: OrderStatus): string => {
        switch (status) {
            case OrderStatus.PENDING:
                return '#6b7280'; // gray
            case OrderStatus.IN_PROGRESS:
                return '#f59e0b'; // amber
            case OrderStatus.COMPLETED:
                return '#16a34a'; // green
            case OrderStatus.CANCELLED:
                return '#dc2626'; // red
        }
    };

    const getStatusText = (status: OrderStatus): string => {
        switch (status) {
            case OrderStatus.PENDING:
                return 'ממתין';
            case OrderStatus.IN_PROGRESS:
                return 'בהכנה';
            case OrderStatus.COMPLETED:
                return 'הושלם';
            case OrderStatus.CANCELLED:
                return 'בוטל';
        }
    };

    const handleClick = () => {
        if (order.status === OrderStatus.PENDING) {
            onStatusChange(order.uuid, OrderStatus.IN_PROGRESS);
        } else if (order.status === OrderStatus.IN_PROGRESS) {
            onStatusChange(order.uuid, OrderStatus.COMPLETED);
        }
    };

    const handleLongPressStart = () => {
        const timer = setTimeout(() => {
            setShowCancelConfirm(true);
        }, 800);
        setLongPressTimer(timer);
    };

    const handleLongPressEnd = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
    };

    const handleCancel = () => {
        onCancel(order.uuid);
        setShowCancelConfirm(false);
    };

    const getPreparationTime = (): string => {
        if (!order.startedAt || !order.completedAt) return '';
        const seconds = Math.floor((order.completedAt - order.startedAt) / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getDrinkEmoji = (drink: string): string => {
        if (drink.includes('הפוך') || drink.includes('קפה')) return '☕';
        if (drink.includes('אספרסו')) return '☕';
        if (drink.includes('שוקו')) return '🍫';
        if (drink.includes('תה')) return '🍵';
        return '☕';
    };

    return (
        <>
            <div
                onClick={handleClick}
                onMouseDown={handleLongPressStart}
                onMouseUp={handleLongPressEnd}
                onMouseLeave={handleLongPressEnd}
                onTouchStart={handleLongPressStart}
                onTouchEnd={handleLongPressEnd}
                className="bg-white rounded-lg shadow-md mb-3 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                style={{ borderRight: `4px solid ${getStatusColor(order.status)}` }}
            >
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-800">הזמנה #{order.id}</span>
                        <div
                            className="px-2 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                            {getStatusText(order.status)}
                        </div>
                    </div>
                    {order.completedAt && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{getPreparationTime()}</span>
                        </div>
                    )}
                </div>

                {/* Body - Blocks */}
                <div className="px-4 py-3 space-y-2">
                    {order.blocks.map((block, index) => (
                        <div key={block.id} className="flex items-start gap-2 text-sm">
                            <span className="text-lg">{getDrinkEmoji(block.drink)}</span>
                            <div className="flex-1">
                                <span className="font-medium text-gray-800">{block.drink}</span>
                                {(block.size || block.milk) && (
                                    <span className="text-gray-600">
                                        {' | '}
                                        {block.size && <span>{block.size}</span>}
                                        {block.size && block.milk && <span> • </span>}
                                        {block.milk && <span>{block.milk}</span>}
                                    </span>
                                )}
                                {block.extras.length > 0 && (
                                    <div className="text-xs text-amber-700 mt-1">
                                        + {block.extras.join(', ')}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{order.cashier}</span>
                    </div>
                    <div>
                        {new Date(order.createdAt).toLocaleTimeString('he-IL', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
                    <div className="bg-white rounded-xl p-6 max-w-sm mx-4">
                        <div className="text-center mb-4">
                            <div className="text-4xl mb-2">⚠️</div>
                            <h3 className="text-xl font-bold text-gray-800">לבטל הזמנה?</h3>
                            <p className="text-gray-600 mt-2">הזמנה #{order.id}</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600"
                            >
                                בטל הזמנה
                            </button>
                            <button
                                onClick={() => setShowCancelConfirm(false)}
                                className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-400"
                            >
                                חזור
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
