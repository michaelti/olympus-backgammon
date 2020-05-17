import React from 'react';
import SocketActions from './SocketActions';
import SocketStatus from './SocketStatus';
import useSocket from '../hooks/useSocket';

function App() {
    const [socket, isConnected, isConnecting] = useSocket("ws://localhost:3001");

    return (
        <div className="App">
            <SocketActions socket={socket} />
            <SocketStatus
                socket={socket}
                isConnecting={isConnecting}
                isConnected={isConnected}
            />
        </div>
    );
}

export default App;
