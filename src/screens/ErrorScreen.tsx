// ============================================================================
// CoffeeTeam Pro - Error Screen
// ============================================================================

import { useAppContext } from '../context/AppContext';
import { AppState } from '../types';

export default function ErrorScreen() {
    const { state, dispatch } = useAppContext();

    const handleReset = () => {
        dispatch({ type: 'RESET' });
        dispatch({ type: 'SET_STATE', payload: AppState.SETUP });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                    אופס! משהו השתבש
                </h1>
                <p className="text-gray-700 mb-6">
                    {state.error?.message || 'שגיאה לא צפויה'}
                </p>
                <button
                    onClick={handleReset}
                    className="w-full bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-amber-700 transition-colors"
                >
                    התחל מחדש
                </button>
            </div>
        </div>
    );
}
