import React, { useState, useEffect } from 'react';
import {
    Container,
    Navbar,
    NavbarBrand,
    Nav,
    NavbarText
} from 'reactstrap';

function Header({ socket, isConnected, isConnecting }) {  
    const [roomName, setRoomName] = useState('');
    
    useEffect(() => {
        // Receive successful joined room
        socket.on('event/joined-room', (roomName) => {
            setRoomName(roomName);
        });

        // Receive failed join room
        socket.on('event/failed-join-room', (roomName) => {
            console.log(`Failed to join room "${roomName}" because it does not exist.`);
        });
    }, [socket]);

    return (
        <header>
            <Navbar color="light" light expand="xs">
                <Container className="px-sm-3">
                    <NavbarBrand>Olympus Backgammon</NavbarBrand>
                    <Nav className="ml-auto" navbar>
                        <NavbarText className="mr-3">
                            Status: {
                                isConnecting ? 'Connecting' :
                                isConnected ? 'Connected' :
                                'Disconnected'
                            }
                        </NavbarText>
                        <NavbarText>
                            Room name: { roomName }
                        </NavbarText>
                    </Nav>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;
