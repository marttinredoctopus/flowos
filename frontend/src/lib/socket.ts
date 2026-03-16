import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

let socket: Socket | null = null;
let currentToken: string | null = null;

export function getSocket(): Socket | null {
  return socket;
}

export function connectSocket(accessToken: string, userId: string): Socket {
  // If same token and already connected, reuse
  if (socket && socket.connected && currentToken === accessToken) {
    return socket;
  }

  // Disconnect stale socket
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  currentToken = accessToken;

  socket = io(SOCKET_URL, {
    auth: { token: accessToken },
    reconnection: true,
    reconnectionDelay: 3000,
    reconnectionAttempts: 5,
    reconnectionDelayMax: 15000,
    timeout: 10000,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket!.id);
    socket!.emit('join', { userId });
  });

  socket.on('connect_error', (err) => {
    console.error('[Socket] Connect error:', err.message);
    // Stop reconnecting on auth errors
    if (
      err.message.includes('Unauthorized') ||
      err.message.includes('Invalid token') ||
      err.message.includes('jwt')
    ) {
      socket?.disconnect();
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
    if (reason === 'io server disconnect') {
      // Server intentionally disconnected — don't auto-reconnect
      currentToken = null;
    }
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = null;
  }
}

export function onSocketEvent(event: string, handler: (...args: any[]) => void) {
  if (socket) socket.on(event, handler);
}

export function offSocketEvent(event: string, handler: (...args: any[]) => void) {
  if (socket) socket.off(event, handler);
}
