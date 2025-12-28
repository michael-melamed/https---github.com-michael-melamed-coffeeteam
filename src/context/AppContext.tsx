// ============================================================================
// CoffeeTeam Pro - App Context
// ============================================================================

import { createContext, useContext } from 'react';
import { AppState, User, Order, DraftOrder, Peer, AppError } from '../types';

/**
 * Global App State
 */
export interface GlobalState {
    currentState: AppState;
    user: User | null;
    orders: Order[];
    draftOrder: DraftOrder;
    peers: Peer[];
    isRecording: boolean;
    transcript: string;
    error: AppError | null;
}

/**
 * App Actions
 */
export type AppAction =
    | { type: 'SET_STATE'; payload: AppState }
    | { type: 'SET_USER'; payload: User }
    | { type: 'ADD_ORDER'; payload: Order }
    | { type: 'UPDATE_ORDER'; payload: { uuid: string; updates: Partial<Order> } }
    | { type: 'DELETE_ORDER'; payload: string }
    | { type: 'SET_DRAFT'; payload: DraftOrder }
    | { type: 'SET_RECORDING'; payload: boolean }
    | { type: 'SET_TRANSCRIPT'; payload: string }
    | { type: 'ADD_PEER'; payload: Peer }
    | { type: 'REMOVE_PEER'; payload: string }
    | { type: 'UPDATE_PEER'; payload: { deviceId: string; updates: Partial<Peer> } }
    | { type: 'SET_ERROR'; payload: AppError | null }
    | { type: 'RESET' };

/**
 * Context Value
 */
export interface AppContextValue {
    state: GlobalState;
    dispatch: React.Dispatch<AppAction>;
}

/**
 * Create Context
 */
export const AppContext = createContext<AppContextValue | undefined>(undefined);

/**
 * Hook to use App Context
 */
export function useAppContext(): AppContextValue {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
}
