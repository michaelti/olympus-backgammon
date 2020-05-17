import React, { useState, useEffect } from 'react';

function SocketDemo(props) {  
    const [roomName, setRoomName] = useState('');
    const { socket, isConnected, isConnecting } = props;
    
    useEffect(() => {
        // Receive successful joined room
        socket.on('event/joined-room', (roomName) => {
            setRoomName(roomName);
        });

        // Receive failed join room
        socket.on('event/failed-join-room', (roomName) => {
            console.log(`Failed to join room ${roomName} because it does not exist.`);
        });
    }, [socket]);

    return (
        <div>
            Status: {
                isConnecting ? 'Connecting' :
                isConnected ? 'Connected' :
                'Disconnected'
            }
            <br />
            Room name: { roomName }
        </div>
    );
}

export default SocketDemo;
