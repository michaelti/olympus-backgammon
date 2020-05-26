import React, { useState } from 'react';
import {
    Container,
    Button,
    Input,
    Form,
    InputGroup,
    InputGroupAddon
} from 'reactstrap';

function Main({ socket }) {  
    const [joinName, setJoinName] = useState('');

    const startRoom = () => {
        socket.emit('event/start-room');
    };

    const joinRoom = (roomName) => {
        socket.emit('event/join-room', roomName);
    };

    const handleChange = (event) => {
        setJoinName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        joinRoom(joinName);
    };

    return (
        <main>
            <Container className="py-5">
                <h1>Olympus Backgammon</h1>
                <p className="py-3">
                    In Greece, there are three major variants of Backgammon:
                    Portes, Plakoto, and Fevga. When played together, they are called Tavli.
                    Welcome to the ancient game, the Greek way.</p>
                <div>
                    <Button onClick={startRoom} color="primary" size="lg">
                        Start a Game
                    </Button>
                </div>

                <hr className="my-5" />

                <p className="pb-3">
                    To join a game that your friend started,
                    click the link they sent you or enter the code below:
                </p>

                <Form inline onSubmit={handleSubmit}>
                    <InputGroup>
                        <Input bsSize="lg" type="text" placeholder="Ex. g2Jk3" onChange={handleChange} />
                        <InputGroupAddon addonType="append">
                            <Button size="lg">Join game</Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Form>
            </Container>
        </main>
    );
}

export default Main;
