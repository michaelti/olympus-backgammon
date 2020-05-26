import React from 'react';
import Header from './Header';
import Main from './Main';
import useSocket from '../hooks/useSocket';
import GlobalStyles from '../styles/globalStyles';

function App() {
    const [socket, isConnected, isConnecting] = useSocket("ws://localhost:3001");

    return (
        <div className="App">
            <GlobalStyles />
            <Header
                socket={socket}
                isConnecting={isConnecting}
                isConnected={isConnected}
            />
            <Main socket={socket} />
        </div>
    );
}

export default App;
