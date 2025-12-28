// ============================================================================
// CoffeeTeam Pro - Signaling Server
// Purpose: Peer discovery only - NOT for data transfer
// ============================================================================

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

// In-memory peer registry
// Structure: { deviceId: { name, role, socketId, peerId, connectedAt } }
const peers = new Map();

// ============================================================================
// Socket.IO Events
// ============================================================================

io.on('connection', (socket) => {
    console.log(`[Server] Client connected: ${socket.id}`);

    /**
     * REGISTER - User joins the network
     * Payload: { deviceId, name, role, peerId }
     */
    socket.on('register', (data) => {
        const { deviceId, name, role, peerId } = data;

        console.log(`[Server] Register: ${name} (${role}) - Device: ${deviceId}`);

        // Store peer info
        peers.set(deviceId, {
            name,
            role,
            socketId: socket.id,
            peerId,
            connectedAt: Date.now()
        });

        // Notify all clients about new peer
        io.emit('peer_joined', {
            deviceId,
            name,
            role,
            peerId
        });

        // Send current peer list to the new client
        const peerList = Array.from(peers.entries()).map(([id, peer]) => ({
            deviceId: id,
            name: peer.name,
            role: peer.role,
            peerId: peer.peerId
        }));

        socket.emit('peer_list', peerList);
    });

    /**
     * GET_PEERS - Request current peer list
     * Used for manual refresh
     */
    socket.on('get_peers', () => {
        const peerList = Array.from(peers.entries()).map(([id, peer]) => ({
            deviceId: id,
            name: peer.name,
            role: peer.role,
            peerId: peer.peerId
        }));

        socket.emit('peer_list', peerList);
    });

    /**
     * GET_CASHIERS - Barista requests cashier list
     */
    socket.on('get_cashiers', () => {
        const cashiers = Array.from(peers.entries())
            .filter(([_, peer]) => peer.role === 'cashier')
            .map(([id, peer]) => ({
                deviceId: id,
                name: peer.name,
                peerId: peer.peerId
            }));

        socket.emit('cashier_list', cashiers);
    });

    /**
     * DISCONNECT - User leaves
     */
    socket.on('disconnect', () => {
        console.log(`[Server] Client disconnected: ${socket.id}`);

        // Find and remove peer
        for (const [deviceId, peer] of peers.entries()) {
            if (peer.socketId === socket.id) {
                peers.delete(deviceId);

                // Notify all clients
                io.emit('peer_left', { deviceId });

                console.log(`[Server] Removed peer: ${peer.name} (${deviceId})`);
                break;
            }
        }
    });
});

// ============================================================================
// HTTP Endpoints (for debugging)
// ============================================================================

app.get('/peers', (req, res) => {
    const peerList = Array.from(peers.entries()).map(([id, peer]) => ({
        deviceId: id,
        name: peer.name,
        role: peer.role,
        peerId: peer.peerId,
        connectedAt: new Date(peer.connectedAt).toISOString()
    }));

    res.json({ peers: peerList, count: peerList.length });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// ============================================================================
// Start Server
// ============================================================================

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║  CoffeeTeam Pro - Signaling Server    ║
║  Port: ${PORT}                           ║
║  Status: Running ✓                     ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('[Server] SIGTERM received, closing server...');
    server.close(() => {
        console.log('[Server] Server closed');
        process.exit(0);
    });
});
