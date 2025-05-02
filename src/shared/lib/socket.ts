import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

class SocketClient {
  private static instance: SocketClient;
  private socket: Socket | null = null;

  private constructor() {}

  static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  connect() {
    if (!this.socket) {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token is required");
      }

      this.socket = io(API_URL, {
        auth: {
          token,
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        if (error.message.includes("Authentication")) {
          // Если ошибка аутентификации, удаляем токен
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketClient = SocketClient.getInstance();
