import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Container, Button, Input, Form, InputGroup, InputGroupAddon } from "reactstrap";
import { socketEmit } from "../api";

function Main({ setRoomName }) {
    const [joinName, setJoinName] = useState("");
    const [shouldRedirectTo, setShouldRedirectTo] = useState(null);

    const handleChange = (event) => {
        setJoinName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        joinRoom(joinName);
    };

    const startRoom = () => {
        socketEmit("event/start-room", (acknowledgement) => {
            if (!acknowledgement.ok) {
                console.log(`Failed to start room "${acknowledgement.roomName}".`);
            } else {
                setRoomName(acknowledgement.roomName);
                setShouldRedirectTo(acknowledgement.roomName);
            }
        });
    };

    const joinRoom = (roomName) => {
        socketEmit("event/join-room", roomName, (acknowledgement) => {
            if (!acknowledgement.ok) {
                console.log(`Failed to join room "${acknowledgement.roomName}".`);
            } else {
                setRoomName(acknowledgement.roomName);
                setShouldRedirectTo(acknowledgement.roomName);
            }
        });
    };

    return (
        <Container className="py-5">
            <h1>Olympus Backgammon</h1>
            <p className="py-3">
                In Greece, there are three major variants of Backgammon: Portes, Plakoto, and Fevga.
                When played together, they are called Tavli. Welcome to the ancient game, the Greek
                way.
            </p>
            <div>
                <Button onClick={startRoom} color="primary" size="lg">
                    Start a Game
                </Button>
            </div>

            <hr className="my-5" />

            <p className="pb-3">
                To join a game that your friend started, click the link they sent you or enter the
                code below:
            </p>

            <Form inline onSubmit={handleSubmit}>
                <InputGroup>
                    <Input
                        bsSize="lg"
                        type="text"
                        placeholder="Ex. g2Jk3"
                        onChange={handleChange}
                    />
                    <InputGroupAddon addonType="append">
                        <Button size="lg">Join game</Button>
                    </InputGroupAddon>
                </InputGroup>
            </Form>

            {shouldRedirectTo === null ? null : <Redirect to={"/room/" + shouldRedirectTo} />}
        </Container>
    );
}

export default Main;
