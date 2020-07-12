import React, { useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import { useSocketOn, socketEmit } from "../api";
import { Container } from "reactstrap";
import { Player, RoomState } from "../util";
import { Badge } from "reactstrap";
import RoomSetup from "./RoomSetup";
import Game from "./Game";

function Room({ setRoomName }) {
    const { roomName } = useParams();
    const [player, setPlayer] = useState(undefined);
    const [roomState, setRoomState] = useState(undefined);
    const [failedJoin, setFailedJoin] = useState(false);

    useEffect(() => {
        socketEmit("event/join-room", roomName, (acknowledgement) => {
            if (!acknowledgement.ok) {
                setFailedJoin(true);
            } else {
                setRoomName(acknowledgement.roomName);
                setPlayer(acknowledgement.player);
            }
        });
    }, [roomName, setRoomName]);

    useSocketOn("room/update-room", (room) => {
        setRoomState(room.state);
    });

    if (failedJoin) return <Redirect to="/" />;

    return (
        <Container className="py-5">
            <Badge className="mb-3">
                {player ? `Playing as ${Player.properties[player].colorName}` : "Spectating"}
            </Badge>
            {player === Player.white && roomState === RoomState.setup ? <RoomSetup /> : null}
            <Game />
        </Container>
    );
}

export default Room;
