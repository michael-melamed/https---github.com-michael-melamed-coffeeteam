// ============================================================================
// CoffeeTeam Pro - LocalStorage Service
// ============================================================================

import { User, Order, Settings } from '../types';

const KEYS = {
    USER: 'coffeeteam_user',
    ORDERS: 'coffeeteam_orders',
    SETTINGS: 'coffeeteam_settings',
    MASTER_COUNTER: 'coffeeteam_master_counter',
    QUEUE: 'coffeeteam_queue'
};

const LIMITS = {
    MAX_ORDERS: 100,
    MAX_AGE_DAYS: 7,
    MAX_QUEUE: 50
};

/**
 * Save user to localStorage
 */
export function saveUser(user: User): void {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

/**
 * Load user from localStorage
 */
export function loadUser(): User | null {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
}

/**
 * Clear user from localStorage
 */
export function clearUser(): void {
    localStorage.removeItem(KEYS.USER);
}

/**
 * Save orders to localStorage
 */
export function saveOrders(orders: Order[]): void {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
}

/**
 * Load orders from localStorage
 */
export function loadOrders(): Order[] {
    const data = localStorage.getItem(KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
}

/**
 * Clear orders from localStorage
 */
export function clearOrders(): void {
    localStorage.removeItem(KEYS.ORDERS);
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: Settings): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

/**
 * Load settings from localStorage
 */
export function loadSettings(): Settings | null {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
}

/**
 * Get master counter
 */
export function getMasterCounter(): number {
    const data = localStorage.getItem(KEYS.MASTER_COUNTER);
    return data ? parseInt(data, 10) : 0;
}

/**
 * Set master counter
 */
export function setMasterCounter(counter: number): void {
    localStorage.setItem(KEYS.MASTER_COUNTER, counter.toString());
}

/**
 * Cleanup old orders
 */
export function cleanupOrders(): void {
    const orders = loadOrders();
    const now = Date.now();
    const maxAge = LIMITS.MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

    // Remove orders older than MAX_AGE_DAYS
    let cleaned = orders.filter(order => {
        return (now - order.createdAt) < maxAge;
    });

    // If still too many, remove oldest completed/cancelled
    if (cleaned.length > LIMITS.MAX_ORDERS) {
        const active = cleaned.filter(o => o.status === 'pending' || o.status === 'in_progress');
        const completed = cleaned.filter(o => o.status === 'completed' || o.status === 'cancelled')
            .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

        cleaned = [...active, ...completed.slice(0, LIMITS.MAX_ORDERS - active.length)];
    }

    saveOrders(cleaned);
}

/**
 * Export orders as JSON
 */
export function exportOrdersJSON(): string {
    const orders = loadOrders();
    return JSON.stringify(orders, null, 2);
}

/**
 * Export orders as CSV
 */
export function exportOrdersCSV(): string {
    const orders = loadOrders();
    const headers = ['ID', 'UUID', 'Cashier', 'Barista', 'Status', 'Created', 'Completed', 'Items'];
    const rows = orders.map(order => [
        order.id,
        order.uuid,
        order.cashier,
        order.barista || '',
        order.status,
        new Date(order.createdAt).toLocaleString('he-IL'),
        order.completedAt ? new Date(order.completedAt).toLocaleString('he-IL') : '',
        order.blocks.length
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
}
