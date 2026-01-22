"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useAuth } from "./auth-context";

interface OnlineUser {
  userId: string;
  username: string;
  avatarLink?: string;
}

interface Message {
  _id: string;
  sender: string;
  recipient: string;
  text: string;
  createdAt: string;
}

interface ChatContextType {
  onlineUsers: OnlineUser[];
  messages: Message[];
  selectedUser: OnlineUser | null;
  allUsers: OnlineUser[];
  isConnected: boolean;
  setSelectedUser: (user: OnlineUser | null) => void;
  sendMessage: (text: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
  fetchAllUsers: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000";

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user, token, isAuthenticated } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [allUsers, setAllUsers] = useState<OnlineUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const getToken = () => token || localStorage.getItem("authToken");

  const connectWebSocket = useCallback(() => {
    if (!isAuthenticated || wsRef.current?.readyState === WebSocket.OPEN) return;

    const authToken = getToken();
    // Connect with token as query parameter for WebSocket auth
    const wsUrl = authToken ? `${WS_URL}?token=${authToken}` : WS_URL;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.online) {
        setOnlineUsers(data.online);
      } else if (data.text && data.sender) {
        // Incoming message from another user
        setMessages((prev) => [
          ...prev,
          {
            _id: data.id || crypto.randomUUID(),
            sender: data.sender,
            recipient: user?._id || "",
            text: data.text,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Reconnect after a delay
      setTimeout(() => {
        if (isAuthenticated) {
          connectWebSocket();
        }
      }, 3000);
    };

    ws.onerror = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, [isAuthenticated, user?._id, token]);

  useEffect(() => {
    if (isAuthenticated) {
      connectWebSocket();
    }

    return () => {
      wsRef.current?.close();
    };
  }, [isAuthenticated, connectWebSocket]);

  const fetchMessages = async (userId: string) => {
    const authToken = getToken();
    if (!authToken) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/messages/${userId}`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch {
      // Handle error silently
    }
  };

  const fetchAllUsers = async () => {
    const authToken = getToken();
    if (!authToken) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/people`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      }
    } catch {
      // Handle error silently
    }
  };

  const sendMessage = (text: string) => {
    if (!selectedUser || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const messageData = {
      recipient: selectedUser.userId,
      text,
    };

    wsRef.current.send(JSON.stringify(messageData));

    // Add message to local state immediately for optimistic UI
    setMessages((prev) => [
      ...prev,
      {
        _id: crypto.randomUUID(),
        sender: user?._id || "",
        recipient: selectedUser.userId,
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const handleSetSelectedUser = useCallback(
    (user: OnlineUser | null) => {
      setSelectedUser(user);
      if (user) {
        fetchMessages(user.userId);
      } else {
        setMessages([]);
      }
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        onlineUsers,
        messages,
        selectedUser,
        allUsers,
        isConnected,
        setSelectedUser: handleSetSelectedUser,
        sendMessage,
        fetchMessages,
        fetchAllUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
