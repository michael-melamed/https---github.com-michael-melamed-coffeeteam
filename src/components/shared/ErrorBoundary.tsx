// ============================================================================
// CoffeeTeam Pro - Error Boundary Component
// ============================================================================

import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4" dir="rtl">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h1 className="text-2xl font-bold text-red-600 mb-4">
                            אופס! משהו השתבש
                        </h1>
                        <p className="text-gray-700 mb-2">
                            {this.state.error?.message || 'שגיאה לא צפויה'}
                        </p>
                        <p className="text-sm text-gray-500 mb-6">
                            הדף ייטען מחדש כדי לנסות לפתור את הבעיה
                        </p>
                        <button
                            onClick={this.handleReset}
                            className="w-full bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-amber-700 transition-colors"
                        >
                            טען מחדש
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
