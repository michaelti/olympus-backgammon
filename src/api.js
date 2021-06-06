import { useEffect, useState } from "react";
import io from "socket.io-client";

// Initialize global socket connection status
let socketStatus = {
    isConnected: false,
    isConnecting: false,
    ping: null,
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
    socketStatus.ping = null;
});

socket.on("reconnecting", () => {
    socketStatus.isConnecting = true;
});

socket.on("pong", (latency) => {
    socketStatus.ping = latency;
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
    const [isConnected, setIsConnected] = useState(undefined);
    const [isConnecting, setisConnecting] = useState(undefined);

    const setNewValues = () => {
        setIsConnected(socketStatus.isConnected);
        setisConnecting(socketStatus.isConnecting);
    };

    useEffect(setNewValues, []);
    useSocketOn("connect", setNewValues);
    useSocketOn("disconnect", setNewValues);
    useSocketOn("reconnecting", setNewValues);

    return [isConnected, isConnecting];
};

// Export: Hook interface for listening to the global socket ping
export const useSocketPing = () => {
    const [ping, setPing] = useState(undefined);

    const setNewValue = () => setPing(socketStatus.ping);

    useEffect(setNewValue, []);
    useSocketOn("pong", setNewValue);
    useSocketOn("disconnect", setNewValue);

    return [ping];
};
