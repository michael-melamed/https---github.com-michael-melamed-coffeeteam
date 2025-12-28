// ============================================================================
// CoffeeTeam Pro - TypeScript Type Definitions
// ============================================================================

/**
 * Application States - מצבי אפליקציה
 */
export enum AppState {
    INIT = 'INIT',
    SETUP = 'SETUP',
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED',
    DISCONNECTED = 'DISCONNECTED',
    ERROR = 'ERROR'
}

/**
 * User Roles - תפקידים
 */
export enum UserRole {
    CASHIER = 'cashier',
    BARISTA = 'barista',
    MANAGER = 'manager'
}

/**
 * Order Status - סטטוס הזמנה
 */
export enum OrderStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

/**
 * Message Types - סוגי הודעות P2P
 */
export enum MessageType {
    REGISTER = 'register',
    PEER_LIST = 'peer_list',
    PEER_JOINED = 'peer_joined',
    PEER_LEFT = 'peer_left',
    ORDER_CREATE = 'order_create',
    ORDER_UPDATE = 'order_update',
    ORDER_STATUS = 'order_status',
    ORDER_ACK = 'order_ack',
    TOKEN_REQUEST = 'token_request',
    TOKEN_GRANT = 'token_grant',
    TOKEN_RELEASE = 'token_release',
    HEARTBEAT = 'heartbeat',
    PING = 'ping',
    PONG = 'pong'
}

/**
 * Error Types - סוגי שגיאות
 */
export enum ErrorType {
    NETWORK = 'network',
    PERMISSION = 'permission',
    VALIDATION = 'validation',
    STORAGE = 'storage',
    CONFLICT = 'conflict',
    TIMEOUT = 'timeout',
    UNKNOWN = 'unknown'
}

/**
 * User Object - משתמש
 */
export interface User {
    id: string;
    name: string;
    role: UserRole;
    deviceId: string;
    isMaster: boolean;
    createdAt: number;
}

/**
 * Block - בלוק משקה
 */
export interface Block {
    id: string;
    drink: string;
    size?: string;
    milk?: string;
    temperature?: string;
    strength?: string;
    extras: string[];
    notes?: string;
}

/**
 * Order - הזמנה
 */
export interface Order {
    id: number;
    uuid: string;
    deviceId: string;
    branchId: string;
    blocks: Block[];
    rawTranscript?: string;
    cashier: string;
    barista: string | null;
    createdAt: number;
    receivedAt: number | null;
    startedAt: number | null;
    completedAt: number | null;
    status: OrderStatus;
    networkLatency?: number;
    retries?: number;
    version: number;
}

/**
 * Peer - משתמש מחובר
 */
export interface Peer {
    deviceId: string;
    name: string;
    role: UserRole;
    isConnected: boolean;
    lastSeen: number;
}

/**
 * Draft Order - הזמנה בעריכה
 */
export interface DraftOrder {
    blocks: Block[];
    transcript: string;
    isListening: boolean;
}

/**
 * App Error - שגיאה
 */
export interface AppError {
    type: ErrorType;
    message: string;
    details?: any;
    timestamp: number;
}

/**
 * Settings - הגדרות
 */
export interface Settings {
    branchId: string;
    secretKey?: string;
    maxOrderAge: number;
    maxOrdersInMemory: number;
    maxQueueSize: number;
}

/**
 * P2P Message - הודעת P2P
 */
export interface P2PMessage {
    type: MessageType;
    payload: any;
    timestamp: number;
    senderId: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate UUID v4
 */
export function generateUUID(): string {
    return crypto.randomUUID();
}

/**
 * Validate user name
 */
export function isValidUserName(name: string): boolean {
    const regex = /^[\u0590-\u05FFa-zA-Z0-9\s_-]{2,20}$/;
    return regex.test(name);
}

/**
 * Validate status transition
 */
export function isValidStatusTransition(from: OrderStatus, to: OrderStatus): boolean {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
        [OrderStatus.PENDING]: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELLED],
        [OrderStatus.IN_PROGRESS]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
        [OrderStatus.COMPLETED]: [],
        [OrderStatus.CANCELLED]: []
    };
    return transitions[from]?.includes(to) || false;
}

/**
 * Validate block
 */
export function isValidBlock(block: Block): boolean {
    return !!(
        block.id &&
        block.drink &&
        block.drink.length > 0 &&
        Array.isArray(block.extras)
    );
}

/**
 * Validate order
 */
export function isValidOrder(order: Order): boolean {
    return !!(
        order.uuid &&
        order.deviceId &&
        order.branchId &&
        order.cashier &&
        order.blocks &&
        order.blocks.length >= 1 &&
        order.blocks.length <= 10 &&
        order.blocks.every(isValidBlock) &&
        order.createdAt > 0 &&
        order.status in OrderStatus
    );
}

/**
 * Error messages - הודעות שגיאה
 */
export const ERROR_MESSAGES: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: 'אין חיבור. ההזמנה נשמרה ותישלח אוטומטית',
    [ErrorType.PERMISSION]: 'נדרשת הרשאת מיקרופון. עבור להגדרות המכשיר',
    [ErrorType.VALIDATION]: 'הזמנה לא תקינה. בדוק ונסה שוב',
    [ErrorType.STORAGE]: 'הזיכרון מלא. מחק הזמנות ישנות',
    [ErrorType.CONFLICT]: 'הזמנה כבר קיימת. נוצר מספר חדש',
    [ErrorType.TIMEOUT]: 'הפעולה ארכה יותר מדי. נסה שוב',
    [ErrorType.UNKNOWN]: 'שגיאה לא צפויה. נסה לרענן את הדף'
};
