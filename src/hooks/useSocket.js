import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const useSocket = (url, options) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);

    const { current: socket } = useRef(io(url, { ...options, autoConnect: false }));

    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            setIsConnected(true);
            setIsConnecting(false);
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
            setIsConnecting(false);
        });

        socket.on("reconnecting", () => {
            setIsConnected(false);
            setIsConnecting(true);
        });

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        };
    }, [socket]);

    return [socket, isConnected, isConnecting];
};

export default useSocket;
