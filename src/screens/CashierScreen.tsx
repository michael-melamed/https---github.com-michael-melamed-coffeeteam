import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Block, generateUUID, Order, OrderStatus, MessageType } from '../types';
import { sttService } from '../services/stt';
import { parseOrder } from '../services/nlp';
import { saveUser, saveOrders, getMasterCounter, setMasterCounter } from '../services/storage';
import { p2pService } from '../services/p2p';
import MicButton from '../components/cashier/MicButton';
import BlockCard from '../components/cashier/BlockCard';
import BlockEditModal from '../components/cashier/BlockEditModal';
import SendSlider from '../components/cashier/SendSlider';
import { LogOut, Settings, RefreshCw } from 'lucide-react';

type MicState = 'IDLE' | 'RECORDING' | 'PROCESSING' | 'ERROR';

export default function CashierScreen() {
    const { state, dispatch } = useAppContext();
    const [micState, setMicState] = useState<MicState>('IDLE');
    const [transcript, setTranscript] = useState('');
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [editingBlock, setEditingBlock] = useState<Block | null>(null);
    const [connectedPeers, setConnectedPeers] = useState(0);

    useEffect(() => {
        // Update peer count
        const updatePeers = () => {
            const peers = p2pService.getPeers();
            setConnectedPeers(peers.filter(p => p.role === 'barista').length);
        };

        updatePeers();
        const interval = setInterval(updatePeers, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Setup STT callbacks
        const unsubscribeTranscript = sttService.onTranscript((text, isFinal) => {
            setTranscript(text);

            if (isFinal) {
                // Parse with NLP
                setMicState('PROCESSING');
                try {
                    const parsedBlocks = parseOrder(text);
                    setBlocks(parsedBlocks);
                    setMicState('IDLE');
                } catch (error) {
                    console.error('NLP parsing error:', error);
                    setMicState('ERROR');
                    setTimeout(() => setMicState('IDLE'), 2000);
                }
            }
        });

        const unsubscribeError = sttService.onError((error) => {
            console.error('STT error:', error);
            setMicState('ERROR');
            setTimeout(() => setMicState('IDLE'), 2000);
        });

        return () => {
            unsubscribeTranscript();
            unsubscribeError();
        };
    }, []);

    const handleStartRecording = async () => {
        try {
            setMicState('RECORDING');
            setTranscript('');
            setBlocks([]);
            await sttService.startRecording();
        } catch (error) {
            console.error('Failed to start recording:', error);
            setMicState('ERROR');
            setTimeout(() => setMicState('IDLE'), 2000);
        }
    };

    const handleStopRecording = () => {
        sttService.stopRecording();
        setMicState('PROCESSING');
    };

    const handleEditBlock = (block: Block) => {
        setEditingBlock(block);
    };

    const handleSaveBlock = (updatedBlock: Block) => {
        setBlocks(blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b));
        setEditingBlock(null);
    };

    const handleDeleteBlock = (blockId: string) => {
        setBlocks(blocks.filter(b => b.id !== blockId));
    };

    const handleSendOrder = () => {
        if (blocks.length === 0 || !state.user) return;

        // Get next order ID
        const counter = getMasterCounter();
        const nextId = counter + 1;
        setMasterCounter(nextId);

        // Create order
        const order: Order = {
            id: nextId,
            uuid: generateUUID(),
            deviceId: state.user.deviceId,
            branchId: 'default',
            blocks,
            rawTranscript: transcript,
            cashier: state.user.name,
            barista: null,
            createdAt: Date.now(),
            receivedAt: null,
            startedAt: null,
            completedAt: null,
            status: OrderStatus.PENDING,
            version: 1
        };

        // Add to state
        dispatch({ type: 'ADD_ORDER', payload: order });

        // Save to localStorage
        const allOrders = [...state.orders, order];
        saveOrders(allOrders);

        // Send via P2P to all baristas
        p2pService.sendOrder(order);
        console.log('[Cashier] Order sent via P2P:', order);

        // Reset
        setBlocks([]);
        setTranscript('');
    };

    const handleLogout = () => {
        p2pService.disconnect();
        dispatch({ type: 'RESET' });
    };

    const handleRefreshPeers = () => {
        p2pService.refreshPeers();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col" dir="rtl">
            {/* Header */}
            <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                        {state.user?.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">{state.user?.name}</h1>
                        <p className="text-sm text-gray-600">קופאי 💳</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleRefreshPeers}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        title="רענן רשימת עמיתים"
                    >
                        <RefreshCw className="w-6 h-6 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Settings className="w-6 h-6 text-gray-600" />
                    </button>
                    <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-full">
                        <LogOut className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
            </header>

            {/* Peer List */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
                <div className="flex gap-3 items-center">
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">
                            {connectedPeers} בריסטות מחוברות
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
                {/* Mic Button */}
                <MicButton
                    state={micState}
                    onStart={handleStartRecording}
                    onStop={handleStopRecording}
                />

                {/* Transcript Display */}
                {transcript && (
                    <div className="bg-white rounded-lg p-4 max-w-2xl w-full shadow-md">
                        <p className="text-gray-700">{transcript}</p>
                    </div>
                )}

                {/* Blocks Container */}
                {blocks.length > 0 && (
                    <div className="w-full max-w-4xl">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            הזמנה ({blocks.length} פריטים)
                        </h2>
                        <div className="flex gap-3 overflow-x-auto pb-4">
                            {blocks.map(block => (
                                <BlockCard
                                    key={block.id}
                                    block={block}
                                    onEdit={handleEditBlock}
                                    onDelete={handleDeleteBlock}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer with Send Slider */}
            {blocks.length > 0 && (
                <div className="bg-white border-t border-gray-200 p-6">
                    <SendSlider onSend={handleSendOrder} />
                </div>
            )}

            {/* Edit Modal */}
            {editingBlock && (
                <BlockEditModal
                    block={editingBlock}
                    onSave={handleSaveBlock}
                    onCancel={() => setEditingBlock(null)}
                />
            )}
        </div>
    );
}
