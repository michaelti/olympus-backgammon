import React from 'react';
import SocketDemo from './SocketDemo';

function App() {
    return (
        <div className="App">
            <SocketDemo title="Default" socketUrl="ws://localhost:3001/" />
            <SocketDemo title="/Game" socketUrl="ws://localhost:3001/game" />
            <SocketDemo title="/Chat" socketUrl="ws://localhost:3001/chat" />
        </div>
    );
}

export default App;
