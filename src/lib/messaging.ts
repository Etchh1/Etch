import { io, Socket } from 'socket.io-client';
import { supabase } from './auth';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
}

interface ChatRoom {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Date;
}

class MessagingService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (!wsUrl) {
      console.error('WebSocket URL not configured');
      return;
    }

    this.socket = io(wsUrl, {
      autoConnect: false,
      transports: ['websocket'],
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      reconnectionDelayMax: 5000,
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to messaging server');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from messaging server:', reason);
      if (reason === 'io server disconnect') {
        // Server initiated the disconnect, try to reconnect
        this.reconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.handleReconnection();
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectDelay *= 2; // Exponential backoff
      setTimeout(() => this.reconnect(), this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('connection_failed');
    }
  }

  private reconnect() {
    if (this.socket && this.userId) {
      this.socket.auth = { userId: this.userId };
      this.socket.connect();
    }
  }

  private emit(event: string, data?: Message | ChatRoom | unknown) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  public connect(userId: string) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return;
    }

    this.userId = userId;
    this.socket.auth = { userId };
    this.socket.connect();
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.userId = null;
      this.reconnectAttempts = 0;
    }
  }

  public async sendMessage(receiverId: string, content: string): Promise<Message | null> {
    try {
      if (!this.userId) throw new Error('User not authenticated');
      if (!this.socket?.connected) throw new Error('Not connected to messaging server');

      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            senderId: this.userId,
            receiverId,
            content,
            createdAt: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const message = data as Message;
      this.emit('new_message', message);

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  public async getChatRooms(): Promise<ChatRoom[]> {
    try {
      if (!this.userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          messages:messages(
            content,
            created_at,
            sender:profiles!messages_sender_id_fkey(
              name,
              avatar
            )
          )
        `)
        .or(`participant1.eq.${this.userId},participant2.eq.${this.userId}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      return [];
    }
  }

  public async getMessages(roomId: string, limit = 50, offset = 0): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(
            name,
            avatar
          )
        `)
        .eq('roomId', roomId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  public onNewMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  public offNewMessage(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.off('new_message', callback);
    }
  }

  public onConnectionFailed(callback: () => void) {
    if (this.socket) {
      this.socket.on('connection_failed', callback);
    }
  }

  public offConnectionFailed(callback: () => void) {
    if (this.socket) {
      this.socket.off('connection_failed', callback);
    }
  }
}

export const messagingService = new MessagingService(); 