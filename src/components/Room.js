import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { socketEmit } from "../api";
import { Container } from "reactstrap";
import Game from "./Game";

function Room({ setRoomName }) {
    const { roomName } = useParams();

    useEffect(() => {
        socketEmit("event/join-room", roomName, (acknowledgement) => {
            if (!acknowledgement.ok) {
                console.log(`Failed to join room "${acknowledgement.roomName}".`);
            } else {
                setRoomName(acknowledgement.roomName);
            }
        });
    }, [roomName, setRoomName]);

    return (
        <Container className="py-5">
            <Game />
        </Container>
    );
}

export default Room;
