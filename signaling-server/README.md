# CoffeeTeam Pro - Signaling Server

## Purpose
Peer discovery ONLY. After peers connect, all data flows P2P.

## Installation

```bash
cd signaling-server
npm install
```

## Run

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

## Endpoints

- **WebSocket**: `ws://localhost:3001`
- **Health**: `http://localhost:3001/health`
- **Peers List**: `http://localhost:3001/peers`

## Events

### Client → Server
- `register` - Join network
- `get_peers` - Request peer list
- `get_cashiers` - Request cashiers only
- `disconnect` - Leave network

### Server → Client
- `peer_list` - Full peer list
- `peer_joined` - New peer joined
- `peer_left` - Peer disconnected
- `cashier_list` - Cashier list

## Security Notes
- Add authentication in production
- Use HTTPS/WSS
- Rate limiting recommended
