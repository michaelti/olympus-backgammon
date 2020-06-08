import React, { useState, useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import useSocket from '../hooks/useSocket';

function SocketManager() {
    const [socket, isConnected, isConnecting] = useSocket("ws://localhost:3001");

    const [roomName, setRoomName] = useState('');
    const [boardState, setBoardState] = useState(null);

    useEffect(() => {
        // Receive successful joined room
        socket.on('event/joined-room', (roomName) => {
            setRoomName(roomName);
        });

        // Receive failed join room
        socket.on('event/failed-join-room', (roomName) => {
            console.log(`Failed to join room "${roomName}" because it does not exist.`);
        });

        // Receive updated board object
        socket.on('game/update-board', (board) => {
            setBoardState(board);
        });
    }, [socket]);

    // Start a room
    const startRoom = () => {
        socket.emit('event/start-room');
    };

    // Join a room
    const joinRoom = (roomName) => {
        socket.emit('event/join-room', roomName);
    };

    // Send a submove to the server, get a new board state
    const doSubmove = (from, to) => {
        socket.emit('game/submove', from, to, (board) => {
            setBoardState(board);
        });
    };

    // Tell the server our turn is complete, get a new board state
    const applyTurn = () => {
        socket.emit('game/apply-turn', (board) => {
            setBoardState(board);
        });
    };

    // Tell the server to undo our submoves, get a new board state
    const undoTurn = () => {
        socket.emit('game/undo', (board) => {
            setBoardState(board);
        });
    };

    return (
        <div>
            <Header
                roomName={roomName}
                isConnecting={isConnecting}
                isConnected={isConnected}
            />
            <Main
                boardState={boardState}
                startRoom={startRoom}
                joinRoom={joinRoom}
                doSubmove={doSubmove}
                applyTurn={applyTurn}
                undoTurn={undoTurn}
            />
        </div>
    );
}

export default SocketManager;
