import { io, Socket } from 'socket.io-client';
import {
  getToken
} from '../tokenUtils';

// Define proper types for event callbacks
type EventCallback = (..._args: any[]) => void;

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private listeners: Map<string, EventCallback[]> = new Map();
  private isConnected = false;
  private baseURL: string;

  private constructor() {
    this.baseURL = import.meta.env.VITE_BASE_URL as string;
    if (!this.baseURL) {
      throw new Error('VITE_BASE_URL is not defined');
    }
  }

  /**
   * Get the singleton instance of SocketManager
   */
  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  /**
   * Connect to the socket server with authentication
   */
  public connect(): Socket {
    if (!this.socket || !this.socket.connected) {
      // Get authentication token
      const token = getToken();
      
      this.socket = io(this.baseURL, {
        auth: { token }
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnected = false;
      });
    }
    return this.socket;
  }

  /**
   * Disconnect from the socket server
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Check if socket is connected
   */
  public isSocketConnected(): boolean {
    return this.isConnected && !!this.socket?.connected;
  }

  /**
   * Subscribe to a socket event
   * @param event The event name
   * @param callback The callback function
   */
  public subscribe(event: string, callback: EventCallback): void {
    if (!this.socket) {
      this.connect();
    }

    this.socket!.on(event, (...args: any[]) => {
      callback(...args);
    });

    // Store the listener reference
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Unsubscribe from an event
   * @param event The event name
   * @param callback The callback function (optional, if not provided, removes all listeners for this event)
   */
  public unsubscribe(event: string, callback?: EventCallback): void {
    if (!this.socket) return;

    if (callback && this.listeners.has(event)) {
      // Remove specific listener
      const callbacks = this.listeners.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
        this.listeners.set(event, callbacks);
      }
    } else {
      // Remove all listeners for this event
      this.socket.removeAllListeners(event);
      this.listeners.delete(event);
    }
  }

  /**
   * Emit an event to the server
   * @param event The event name
   * @param data The data to send
   */
  public emit(event: string, ...data: any[]): void {
    if (!this.socket) {
      this.connect();
    }
    this.socket!.emit(event, ...data);
  }

  /**
   * Get the socket instance
   */
  public getSocket(): Socket | null {
    return this.socket;
  }
}

// Export the singleton instance
export const socketManager = SocketManager.getInstance();
export default socketManager;
