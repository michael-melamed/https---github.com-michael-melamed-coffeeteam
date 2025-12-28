// ============================================================================
// CoffeeTeam Pro - App Provider
// ============================================================================

import { useReducer, useEffect, ReactNode } from 'react';
import { AppContext, GlobalState, AppAction } from './AppContext';
import { AppState } from '../types';
import { loadUser, loadOrders } from '../services/storage';

/**
 * Initial State
 */
const initialState: GlobalState = {
    currentState: AppState.INIT,
    user: null,
    orders: [],
    draftOrder: {
        blocks: [],
        transcript: '',
        isListening: false
    },
    peers: [],
    isRecording: false,
    transcript: '',
    error: null
};

/**
 * Reducer Function
 */
function appReducer(state: GlobalState, action: AppAction): GlobalState {
    switch (action.type) {
        case 'SET_STATE':
            return { ...state, currentState: action.payload };

        case 'SET_USER':
            return { ...state, user: action.payload };

        case 'ADD_ORDER':
            return { ...state, orders: [...state.orders, action.payload] };

        case 'UPDATE_ORDER':
            return {
                ...state,
                orders: state.orders.map(order =>
                    order.uuid === action.payload.uuid
                        ? { ...order, ...action.payload.updates }
                        : order
                )
            };

        case 'DELETE_ORDER':
            return {
                ...state,
                orders: state.orders.filter(order => order.uuid !== action.payload)
            };

        case 'SET_DRAFT':
            return { ...state, draftOrder: action.payload };

        case 'SET_RECORDING':
            return { ...state, isRecording: action.payload };

        case 'SET_TRANSCRIPT':
            return { ...state, transcript: action.payload };

        case 'ADD_PEER':
            return { ...state, peers: [...state.peers, action.payload] };

        case 'REMOVE_PEER':
            return {
                ...state,
                peers: state.peers.filter(peer => peer.deviceId !== action.payload)
            };

        case 'UPDATE_PEER':
            return {
                ...state,
                peers: state.peers.map(peer =>
                    peer.deviceId === action.payload.deviceId
                        ? { ...peer, ...action.payload.updates }
                        : peer
                )
            };

        case 'SET_ERROR':
            return { ...state, error: action.payload };

        case 'RESET':
            return initialState;

        default:
            return state;
    }
}

/**
 * App Provider Component
 */
export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Load persisted data on mount
    useEffect(() => {
        const user = loadUser();
        const orders = loadOrders();

        if (user) {
            dispatch({ type: 'SET_USER', payload: user });
            dispatch({ type: 'SET_STATE', payload: AppState.CONNECTING });
        } else {
            dispatch({ type: 'SET_STATE', payload: AppState.SETUP });
        }

        if (orders.length > 0) {
            orders.forEach(order => {
                dispatch({ type: 'ADD_ORDER', payload: order });
            });
        }
    }, []);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}
