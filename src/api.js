import { useEffect, useState } from "react";
import io from "socket.io-client";

// Initialize global socket connection status
let socketStatus = {
    isConnected: false,
    isConnecting: false,
};

// Initialize the global socket
const socket = io(process.env.REACT_APP_BACKEND_URL);

// Initialize global socket connection event listeners
socket.on("connect", () => {
    socketStatus.isConnected = true;
    socketStatus.isConnecting = false;
});

socket.on("disconnect", () => {
    socketStatus.isConnected = false;
    socketStatus.isConnecting = false;
});

socket.on("reconnecting", () => {
    socketStatus.isConnecting = true;
});

// Export: Interface for emitting socket events
export const socketEmit = (eventName, ...args) => {
    socket.emit(eventName, ...args);
};

// Export: Hook interface for listening to events and cleaning up on unmount
export const useSocketOn = (eventName, callback) => {
    useEffect(() => {
        socket.on(eventName, callback);
        return () => socket.off(eventName, callback);
    }, [eventName, callback]);
};

// Export: Hook interface for listening to the global socket connection status
export const useSocketStatus = () => {
    const [isConnected, setIsConnected] = useState(socketStatus.isConnected);
    const [isConnecting, setisConnecting] = useState(socketStatus.isConnecting);

    const setNewValues = () => {
        setIsConnected(socketStatus.isConnected);
        setisConnecting(socketStatus.isConnecting);
    };

    useSocketOn("connect", setNewValues);
    useSocketOn("disconnect", setNewValues);
    useSocketOn("reconnecting", setNewValues);

    return [isConnected, isConnecting];
};
