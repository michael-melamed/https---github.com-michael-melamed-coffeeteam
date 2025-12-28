import { AppProvider } from './context/AppProvider';
import { useAppContext } from './context/AppContext';
import { AppState } from './types';
import { ErrorBoundary } from './components/shared/ErrorBoundary';

// Screens
import SetupScreen from './screens/SetupScreen';
import ConnectingScreen from './screens/ConnectingScreen';
import CashierScreen from './screens/CashierScreen';
import BaristaScreen from './screens/BaristaScreen';
import ManagerScreen from './screens/ManagerScreen';
import ErrorScreen from './screens/ErrorScreen';

function AppContent() {
    const { state } = useAppContext();

    // Render appropriate screen based on current state
    switch (state.currentState) {
        case AppState.INIT:
        case AppState.SETUP:
            return <SetupScreen />;

        case AppState.CONNECTING:
            return <ConnectingScreen />;

        case AppState.CONNECTED:
        case AppState.DISCONNECTED:
            // Render based on user role
            if (!state.user) return <SetupScreen />;

            switch (state.user.role) {
                case 'cashier':
                    return <CashierScreen />;
                case 'barista':
                    return <BaristaScreen />;
                case 'manager':
                    return <ManagerScreen />;
                default:
                    return <SetupScreen />;
            }

        case AppState.ERROR:
            return <ErrorScreen />;

        default:
            return <SetupScreen />;
    }
}

function App() {
    return (
        <ErrorBoundary>
            <AppProvider>
                <AppContent />
            </AppProvider>
        </ErrorBoundary>
    );
}

export default App;
