// ============================================================================
// CoffeeTeam Pro - Complete P2P Service with WebRTC
// ============================================================================

import Peer from 'peerjs';
import { io, Socket } from 'socket.io-client';
import { P2PMessage, MessageType, Peer as PeerInfo, Order } from '../types';

// Use environment variable or default to localhost
const SIGNALING_SERVER = (import.meta as any).env?.VITE_SIGNALING_SERVER || 'http://localhost:3001';

console.log('[P2P] Signaling server:', SIGNALING_SERVER);

/**
 * Complete P2P Service
 * 1. Connect to signaling server for discovery
 * 2. Establish WebRTC connections
 * 3. Send/receive orders via DataChannel
 */
class P2PService {
    private peer: Peer | null = null;
    private socket: Socket | null = null;
    private connections: Map<string, any> = new Map(); // deviceId → DataConnection
    private peers: Map<string, PeerInfo> = new Map();
    private callbacks: ((message: P2PMessage) => void)[] = [];
    private isConnected = false;
    private myDeviceId: string = '';
    private myPeerId: string = '';

    /**
     * Initialize P2P connection
     */
    async connect(deviceId: string, name: string, role: string): Promise<void> {
        console.log('[P2P] Connecting...', { deviceId, name, role });

        this.myDeviceId = deviceId;

        // 1. Create PeerJS instance
        this.peer = new Peer({
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            }
        });

        // Wait for peer to be ready
        await new Promise<void>((resolve, reject) => {
            this.peer!.on('open', (peerId) => {
                console.log('[P2P] PeerJS ready:', peerId);
                this.myPeerId = peerId;
                resolve();
            });

            this.peer!.on('error', (error) => {
                console.error('[P2P] PeerJS error:', error);
                reject(error);
            });
        });

        // 2. Connect to signaling server
        this.socket = io(SIGNALING_SERVER);

        this.socket.on('connect', () => {
            console.log('[P2P] Connected to signaling server');

            // Register with signaling server
            this.socket!.emit('register', {
                deviceId,
                name,
                role,
                peerId: this.myPeerId
            });
        });

        // 3. Listen for peer list
        this.socket.on('peer_list', (peerList: any[]) => {
            console.log('[P2P] Received peer list:', peerList);

            peerList.forEach(peerData => {
                if (peerData.deviceId !== this.myDeviceId) {
                    this.addPeer(peerData);

                    // If I'm a barista and this is a cashier, connect
                    if (role === 'barista' && peerData.role === 'cashier') {
                        this.connectToPeer(peerData.peerId, peerData.deviceId);
                    }
                }
            });
        });

        // 4. Listen for new peers
        this.socket.on('peer_joined', (peerData: any) => {
            console.log('[P2P] Peer joined:', peerData);

            if (peerData.deviceId !== this.myDeviceId) {
                this.addPeer(peerData);

                // If I'm a barista and this is a cashier, connect
                if (role === 'barista' && peerData.role === 'cashier') {
                    this.connectToPeer(peerData.peerId, peerData.deviceId);
                }
            }
        });

        // 5. Listen for peer disconnections
        this.socket.on('peer_left', (data: { deviceId: string }) => {
            console.log('[P2P] Peer left:', data.deviceId);
            this.removePeer(data.deviceId);
        });

        // 6. Listen for incoming connections
        this.peer.on('connection', (conn) => {
            console.log('[P2P] Incoming connection from:', conn.peer);
            this.setupConnection(conn, 'unknown'); // We'll get deviceId from first message
        });

        this.isConnected = true;
    }

    /**
     * Connect to a specific peer
     */
    private connectToPeer(peerId: string, deviceId: string): void {
        if (this.connections.has(deviceId)) {
            console.log('[P2P] Already connected to:', deviceId);
            return;
        }

        console.log('[P2P] Connecting to peer:', peerId, deviceId);
        const conn = this.peer!.connect(peerId, {
            reliable: true,
            serialization: 'json'
        });

        this.setupConnection(conn, deviceId);
    }

    /**
     * Setup DataConnection event handlers
     */
    private setupConnection(conn: any, deviceId: string): void {
        conn.on('open', () => {
            console.log('[P2P] Connection opened:', deviceId);
            this.connections.set(deviceId, conn);

            // Send handshake
            conn.send({
                type: MessageType.REGISTER,
                payload: { deviceId: this.myDeviceId },
                timestamp: Date.now(),
                senderId: this.myDeviceId
            });
        });

        conn.on('data', (data: P2PMessage) => {
            console.log('[P2P] Received data:', data);

            // If this is a handshake, update deviceId
            if (data.type === MessageType.REGISTER && deviceId === 'unknown') {
                deviceId = data.payload.deviceId;
                this.connections.set(deviceId, conn);
            }

            this.notifyCallbacks(data);
        });

        conn.on('close', () => {
            console.log('[P2P] Connection closed:', deviceId);
            this.connections.delete(deviceId);
        });

        conn.on('error', (error: any) => {
            console.error('[P2P] Connection error:', deviceId, error);
            this.connections.delete(deviceId);
        });
    }

    /**
     * Add peer to registry
     */
    private addPeer(peerData: any): void {
        this.peers.set(peerData.deviceId, {
            deviceId: peerData.deviceId,
            name: peerData.name,
            role: peerData.role as any,
            isConnected: true,
            lastSeen: Date.now()
        });
    }

    /**
     * Remove peer from registry
     */
    private removePeer(deviceId: string): void {
        this.peers.delete(deviceId);
        const conn = this.connections.get(deviceId);
        if (conn) {
            conn.close();
            this.connections.delete(deviceId);
        }
    }

    /**
     * Disconnect from P2P network
     */
    disconnect(): void {
        console.log('[P2P] Disconnecting...');

        // Close all connections
        this.connections.forEach(conn => conn.close());
        this.connections.clear();

        // Close peer
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }

        // Disconnect from signaling server
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }

        this.isConnected = false;
        this.peers.clear();
    }

    /**
     * Send order to all baristas
     */
    sendOrder(order: Order): void {
        const message: P2PMessage = {
            type: MessageType.ORDER_CREATE,
            payload: order,
            timestamp: Date.now(),
            senderId: this.myDeviceId
        };

        this.broadcast(message);
    }

    /**
     * Update order status
     */
    updateOrderStatus(orderId: string, status: string, updates: any): void {
        const message: P2PMessage = {
            type: MessageType.ORDER_UPDATE,
            payload: { orderId, status, ...updates },
            timestamp: Date.now(),
            senderId: this.myDeviceId
        };

        this.broadcast(message);
    }

    /**
     * Broadcast message to all connected peers
     */
    broadcast(message: P2PMessage): void {
        console.log('[P2P] Broadcasting:', message.type, 'to', this.connections.size, 'peers');

        this.connections.forEach((conn, deviceId) => {
            try {
                conn.send(message);
            } catch (error) {
                console.error('[P2P] Failed to send to:', deviceId, error);
            }
        });
    }

    /**
     * Send message to specific peer
     */
    sendToPeer(deviceId: string, message: P2PMessage): void {
        const conn = this.connections.get(deviceId);
        if (conn) {
            conn.send(message);
        } else {
            console.warn('[P2P] No connection to:', deviceId);
        }
    }

    /**
     * Subscribe to P2P messages
     */
    subscribe(callback: (message: P2PMessage) => void): () => void {
        this.callbacks.push(callback);
        return () => {
            this.callbacks = this.callbacks.filter(cb => cb !== callback);
        };
    }

    /**
     * Get connected peers
     */
    getPeers(): PeerInfo[] {
        return Array.from(this.peers.values());
    }

    /**
     * Get cashiers only
     */
    getCashiers(): PeerInfo[] {
        return Array.from(this.peers.values()).filter(p => p.role === 'cashier');
    }

    /**
     * Check if connected
     */
    getIsConnected(): boolean {
        return this.isConnected;
    }

    /**
     * Refresh peer list from server
     */
    refreshPeers(): void {
        if (this.socket) {
            this.socket.emit('get_peers');
        }
    }

    /**
     * Notify all callbacks
     */
    private notifyCallbacks(message: P2PMessage): void {
        this.callbacks.forEach(callback => {
            try {
                callback(message);
            } catch (error) {
                console.error('[P2P] Callback error:', error);
            }
        });
    }
}

export const p2pService = new P2PService();
