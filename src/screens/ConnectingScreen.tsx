// ============================================================================
// CoffeeTeam Pro - Connecting Screen
// ============================================================================

import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { AppState } from '../types';
import { p2pService } from '../services/p2p';

export default function ConnectingScreen() {
    const { state, dispatch } = useAppContext();
    const [status, setStatus] = useState('מתחבר לרשת...');
    const [error, setError] = useState('');

    useEffect(() => {
        const connectToP2P = async () => {
            if (!state.user) return;

            try {
                setStatus('מתחבר לשרת איתות...');
                await p2pService.connect(
                    state.user.deviceId,
                    state.user.name,
                    state.user.role
                );

                setStatus('מחובר! מחפש עמיתים...');

                // Wait a bit for peer discovery
                setTimeout(() => {
                    dispatch({ type: 'SET_STATE', payload: AppState.CONNECTED });
                }, 2000);

            } catch (error: any) {
                console.error('[Connecting] P2P connection failed:', error);
                setError('החיבור נכשל. בדוק שהשרת פועל.');

                // Retry after 3 seconds
                setTimeout(() => {
                    connectToP2P();
                }, 3000);
            }
        };

        connectToP2P();

        return () => {
            // Cleanup on unmount
        };
    }, [state.user, dispatch]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center" dir="rtl">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-600 border-t-transparent mb-4"></div>
                <h2 className="text-2xl font-bold text-amber-800">{status}</h2>
                {error ? (
                    <p className="text-red-600 mt-2">{error}</p>
                ) : (
                    <p className="text-gray-600 mt-2">זה ייקח רק רגע...</p>
                )}
            </div>
        </div>
    );
}
