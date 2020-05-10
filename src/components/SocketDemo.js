import React, {useState, useEffect} from 'react';
import useSocket from '../hooks/useSocket';

function SocketDemo(props) {    
    const [messages, setMessages] = useState([]);
    const [latency, setLatency] = useState(null);

    const [socket, isConnected, isConnecting] = useSocket(props.socketUrl);
    
    useEffect(() => {
        socket.on('pong', (latency) => {
            setLatency(latency);
        });

        socket.on('message', (data) => {
            setMessages((m) => [...m, data]);
        });
    }, [socket]);

    return (
        <div style={{float: 'left', marginRight: '50px'}}>
            <h1>{ props.title }</h1>
            status: {
                isConnecting ? 'Connecting' :
                isConnected ? 'Connected' :
                'Disconnected'
            }
            <br />

            latency: { latency } ms
            <br />

            messages: {
                messages.map((message, i) => (
                    <div key={i}>
                        { message }
                    </div>
                ))
            }
            <br />

            { props.title === '/Chat' ? (
                <>
                    <button onClick={()=>{socket.emit('join-room', 'example-room');}}>
                        join room "example-room"
                    </button>
                    <button onClick={()=>{socket.emit('leave-room', 'example-room');}}>
                        leave room "example-room"
                    </button>
                </>
            ) : null }

        </div>
    );
}

export default SocketDemo;
