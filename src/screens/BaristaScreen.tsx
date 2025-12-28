// ============================================================================
// CoffeeTeam Pro - Complete Barista Screen
// ============================================================================

import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { OrderStatus, MessageType } from '../types';
import { saveOrders } from '../services/storage';
import { p2pService } from '../services/p2p';
import OrderCard from '../components/barista/OrderCard';
import { LogOut, Settings, History } from 'lucide-react';

export default function BaristaScreen() {
    const { state, dispatch } = useAppContext();
    const [showHistory, setShowHistory] = useState(false);

    // Subscribe to P2P messages
    useEffect(() => {
        const unsubscribe = p2pService.subscribe((message) => {
            console.log('[Barista] Received P2P message:', message);

            if (message.type === MessageType.ORDER_CREATE) {
                const order = message.payload;
                console.log('[Barista] New order received:', order);

                // Add to state
                dispatch({ type: 'ADD_ORDER', payload: order });

                // Save to localStorage
                const allOrders = [...state.orders, order];
                saveOrders(allOrders);
            }

            if (message.type === MessageType.ORDER_UPDATE) {
                const { orderId, ...updates } = message.payload;
                dispatch({ type: 'UPDATE_ORDER', payload: { uuid: orderId, updates } });
            }
        });

        return () => unsubscribe();
    }, [state.orders, dispatch]);

    // Filter active orders (pending + in_progress)
    const activeOrders = state.orders.filter(
        order => order.status === OrderStatus.PENDING || order.status === OrderStatus.IN_PROGRESS
    );

    // Filter history orders (completed + cancelled)
    const historyOrders = state.orders.filter(
        order => order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED
    ).sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        const now = Date.now();
        const updates: any = { status: newStatus };

        if (newStatus === OrderStatus.IN_PROGRESS) {
            updates.startedAt = now;
            updates.barista = state.user?.name;
        } else if (newStatus === OrderStatus.COMPLETED) {
            updates.completedAt = now;
        }

        dispatch({ type: 'UPDATE_ORDER', payload: { uuid: orderId, updates } });

        // Save to localStorage
        const updatedOrders = state.orders.map(order =>
            order.uuid === orderId ? { ...order, ...updates } : order
        );
        saveOrders(updatedOrders);

        // Broadcast update via P2P
        p2pService.updateOrderStatus(orderId, newStatus, updates);

        // Auto-remove completed orders after 3 seconds
        if (newStatus === OrderStatus.COMPLETED) {
            setTimeout(() => {
                // Order will stay in history, just removed from active view
            }, 3000);
        }
    };

    const handleCancelOrder = (orderId: string) => {
        handleStatusChange(orderId, OrderStatus.CANCELLED);
    };

    const handleLogout = () => {
        p2pService.disconnect();
        dispatch({ type: 'RESET' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col" dir="rtl">
            {/* Header */}
            <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {state.user?.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">{state.user?.name}</h1>
                        <p className="text-sm text-gray-600">בריסטה ☕</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <History className="w-6 h-6 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Settings className="w-6 h-6 text-gray-600" />
                    </button>
                    <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-full">
                        <LogOut className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
            </header>

            {/* Queue Counter */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
                <h2 className="text-lg font-bold text-gray-800">
                    תור הזמנות ({activeOrders.length})
                </h2>
            </div>

            {/* Orders List */}
            <div className="flex-1 overflow-y-auto p-6">
                {showHistory ? (
                    // History View
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">היסטוריה</h2>
                            <button
                                onClick={() => setShowHistory(false)}
                                className="text-green-600 hover:text-green-700 font-medium"
                            >
                                חזור לתור
                            </button>
                        </div>
                        {historyOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">אין הזמנות בהיסטוריה</p>
                            </div>
                        ) : (
                            <div className="max-w-2xl mx-auto">
                                {historyOrders.map(order => (
                                    <OrderCard
                                        key={order.uuid}
                                        order={order}
                                        onStatusChange={handleStatusChange}
                                        onCancel={handleCancelOrder}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // Active Orders
                    <div className="max-w-2xl mx-auto">
                        {activeOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">☕</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">אין הזמנות חדשות</h3>
                                <p className="text-gray-600">ההזמנות יופיעו כאן ברגע שיגיעו</p>
                            </div>
                        ) : (
                            activeOrders.map(order => (
                                <OrderCard
                                    key={order.uuid}
                                    order={order}
                                    onStatusChange={handleStatusChange}
                                    onCancel={handleCancelOrder}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            {!showHistory && historyOrders.length > 0 && (
                <div className="bg-white border-t border-gray-200 p-4">
                    <button
                        onClick={() => setShowHistory(true)}
                        className="w-full py-3 text-green-600 hover:text-green-700 font-bold"
                    >
                        ━━ היסטוריה ({historyOrders.length}) ━━
                    </button>
                </div>
            )}
        </div>
    );
}
