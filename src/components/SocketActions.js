import React, { useState } from 'react';

function SocketDemo(props) {  
    const [joinName, setJoinName] = useState('');

    const startRoom = () => {
        props.socket.emit('event/start-room');
    };

    const joinRoom = () => {
        props.socket.emit('event/join-room', joinName);
    };

    const handleChange = (event) => {
        setJoinName(event.target.value);
    };

    return (
        <div>
            <button onClick={startRoom}>Start</button>
            <button onClick={joinRoom}>Join</button>
            <input type="text" placeholder="Room name to join" onChange={handleChange} />
        </div>
    );
}

export default SocketDemo;
