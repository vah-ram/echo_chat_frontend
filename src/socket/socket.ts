import { io } from "socket.io-client";
import { API } from "../config/api";

export const socket = io(API.socketMessageUrl, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

export const connectSocket = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return;

  socket.auth = { token };
  if (!socket.connected) {
    socket.connect();
  }
};