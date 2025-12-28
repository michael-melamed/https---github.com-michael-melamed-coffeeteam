// ============================================================================
// CoffeeTeam Pro - Manager Screen (Enhanced Barista)
// ============================================================================

import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { OrderStatus } from '../types';
import { saveOrders, exportOrdersJSON, exportOrdersCSV, clearOrders } from '../services/storage';
import OrderCard from '../components/barista/OrderCard';
import { LogOut, Settings, History, BarChart3, Download } from 'lucide-react';

export default function ManagerScreen() {
    const { state, dispatch } = useAppContext();
    const [showHistory, setShowHistory] = useState(false);
    const [showStats, setShowStats] = useState(false);

    // Filter active orders
    const activeOrders = state.orders.filter(
        order => order.status === OrderStatus.PENDING || order.status === OrderStatus.IN_PROGRESS
    );

    // Filter history orders
    const historyOrders = state.orders.filter(
        order => order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED
    ).sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

    // Calculate stats
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayOrders = state.orders.filter(order => order.createdAt >= todayStart);
    const completedToday = todayOrders.filter(order => order.status === OrderStatus.COMPLETED);
    const avgPreparationTime = completedToday.length > 0
        ? completedToday.reduce((sum, order) => {
            return sum + ((order.completedAt || 0) - (order.startedAt || 0));
        }, 0) / completedToday.length / 1000
        : 0;

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

        const updatedOrders = state.orders.map(order =>
            order.uuid === orderId ? { ...order, ...updates } : order
        );
        saveOrders(updatedOrders);
    };

    const handleCancelOrder = (orderId: string) => {
        handleStatusChange(orderId, OrderStatus.CANCELLED);
    };

    const handleExportJSON = () => {
        const json = exportOrdersJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleExportCSV = () => {
        const csv = exportOrdersCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const handleClearHistory = () => {
        if (confirm('למחוק את כל ההיסטוריה?')) {
            clearOrders();
            dispatch({ type: 'RESET' });
        }
    };

    const handleLogout = () => {
        dispatch({ type: 'RESET' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col" dir="rtl">
            {/* Header */}
            <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {state.user?.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">{state.user?.name}</h1>
                        <p className="text-sm text-gray-600">מנהל 👔</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowStats(!showStats)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <BarChart3 className="w-6 h-6 text-gray-600" />
                    </button>
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {showStats ? (
                    // Statistics Dashboard
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">סטטיסטיקות</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white rounded-lg p-6 shadow-md">
                                <div className="text-3xl font-bold text-purple-600">{todayOrders.length}</div>
                                <div className="text-gray-600 mt-1">הזמנות היום</div>
                            </div>
                            <div className="bg-white rounded-lg p-6 shadow-md">
                                <div className="text-3xl font-bold text-green-600">{completedToday.length}</div>
                                <div className="text-gray-600 mt-1">הושלמו</div>
                            </div>
                            <div className="bg-white rounded-lg p-6 shadow-md">
                                <div className="text-3xl font-bold text-amber-600">
                                    {avgPreparationTime > 0 ? `${Math.floor(avgPreparationTime / 60)}:${Math.floor(avgPreparationTime % 60).toString().padStart(2, '0')}` : '-'}
                                </div>
                                <div className="text-gray-600 mt-1">זמן הכנה ממוצע</div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">ייצוא נתונים</h3>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleExportJSON}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                                >
                                    <Download className="w-5 h-5" />
                                    ייצוא JSON
                                </button>
                                <button
                                    onClick={handleExportCSV}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    <Download className="w-5 h-5" />
                                    ייצוא CSV
                                </button>
                                <button
                                    onClick={handleClearHistory}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    מחק היסטוריה
                                </button>
                            </div>
                        </div>
                    </div>
                ) : showHistory ? (
                    // History View
                    <div className="max-w-2xl mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">היסטוריה</h2>
                            <button
                                onClick={() => setShowHistory(false)}
                                className="text-purple-600 hover:text-purple-700 font-medium"
                            >
                                חזור לתור
                            </button>
                        </div>
                        {historyOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">אין הזמנות בהיסטוריה</p>
                            </div>
                        ) : (
                            historyOrders.map(order => (
                                <OrderCard
                                    key={order.uuid}
                                    order={order}
                                    onStatusChange={handleStatusChange}
                                    onCancel={handleCancelOrder}
                                />
                            ))
                        )}
                    </div>
                ) : (
                    // Active Orders
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            תור הזמנות ({activeOrders.length})
                        </h2>
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
        </div>
    );
}
