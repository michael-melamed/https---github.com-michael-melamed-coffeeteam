// ============================================================================
// CoffeeTeam Pro - Setup Screen
// ============================================================================

import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { AppState, UserRole, generateUUID, isValidUserName } from '../types';

export default function SetupScreen() {
    const { state, dispatch } = useAppContext();
    const [step, setStep] = useState<1 | 2>(1);
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidUserName(name)) {
            setError('שם חייב להיות 2-20 תווים (עברית, אנגלית, מספרים)');
            return;
        }

        setError('');
        setStep(2);
    };

    const handleRoleSelect = (role: UserRole) => {
        const user = {
            id: generateUUID(),
            name,
            role,
            deviceId: generateUUID(),
            isMaster: role === UserRole.CASHIER,
            createdAt: Date.now()
        };

        dispatch({ type: 'SET_USER', payload: user });
        dispatch({ type: 'SET_STATE', payload: AppState.CONNECTING });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-amber-800 text-center mb-8">
                    CoffeeTeam Pro
                </h1>

                {step === 1 ? (
                    <form onSubmit={handleNameSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                מה השם שלך?
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-lg"
                                placeholder="הכנס שם..."
                                autoFocus
                                maxLength={20}
                            />
                            {error && (
                                <p className="text-red-600 text-sm mt-2">{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={name.length < 2}
                            className="w-full bg-amber-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            המשך
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
                            בחר תפקיד
                        </h2>

                        <button
                            onClick={() => handleRoleSelect(UserRole.CASHIER)}
                            className="w-full bg-blue-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-3"
                        >
                            <span className="text-2xl">💳</span>
                            קופאי
                        </button>

                        <button
                            onClick={() => handleRoleSelect(UserRole.BARISTA)}
                            className="w-full bg-green-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-3"
                        >
                            <span className="text-2xl">☕</span>
                            בריסטה
                        </button>

                        <button
                            onClick={() => handleRoleSelect(UserRole.MANAGER)}
                            className="w-full bg-purple-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-3"
                        >
                            <span className="text-2xl">👔</span>
                            מנהל
                        </button>

                        <button
                            onClick={() => setStep(1)}
                            className="w-full text-gray-600 py-2 text-sm hover:text-gray-800"
                        >
                            חזור
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
