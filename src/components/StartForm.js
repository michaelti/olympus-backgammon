import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { socketEmit } from "../api";
import Button from "./UI/Button";
import Input from "./UI/Input";
import styled from "styled-components";

const Form = styled.form`
    display: flex;
    flex-direction: column;

    > * + * {
        margin-top: 1rem;
    }
`;

function StartForm() {
    const [joinName, setJoinName] = useState("");
    const [shouldRedirectTo, setShouldRedirectTo] = useState(null);
    const [failedToJoin, setFailedToJoin] = useState(false);

    const handleChange = (event) => {
        if (event.target.validity.valid) {
            setJoinName(event.target.value);
            setFailedToJoin(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        joinRoom(joinName);
    };

    const startRoom = (options) => {
        socketEmit("event/start-room", { ...options }, (acknowledgement) => {
            if (!acknowledgement.ok) {
                console.log(`Failed to start room "${acknowledgement.roomName}".`);
            } else {
                setShouldRedirectTo(acknowledgement.roomName);
            }
        });
    };

    const joinRoom = (roomName) => {
        socketEmit("event/join-room", roomName, (acknowledgement) => {
            if (!acknowledgement.ok) {
                setFailedToJoin(true);
                setJoinName("");
            } else {
                setShouldRedirectTo(acknowledgement.roomName);
            }
        });
    };

    // Automatically start a game when in game dev mode
    useEffect(process.env.REACT_APP_GAMEDEV ? startRoom : () => {}, []);

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                type="type"
                inputmode="numeric"
                placeholder="1234"
                maxLength="4"
                pattern="[0-9]*"
                onChange={handleChange}
                value={joinName}
                invalid={failedToJoin}
            />
            <Button color="secondary">Join game</Button>
            <Button onClick={() => startRoom()} color="primary">
                Host game
            </Button>

            <Button onClick={() => startRoom({ withBot: true })} color="primary">
                Play vs. computer
            </Button>

            {shouldRedirectTo === null ? null : <Redirect to={"/room/" + shouldRedirectTo} />}
        </Form>
    );
}

export default StartForm;
