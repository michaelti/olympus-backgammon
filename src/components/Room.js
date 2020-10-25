import React, { useState, useEffect, useReducer } from "react";
import { useParams, Redirect } from "react-router-dom";
import { useSocketOn, socketEmit } from "../api";
import { Container } from "reactstrap";
import { Player, RoomStep } from "../util";
import RoomSetup from "./RoomSetup";
import Game from "./Game";

function Room({ setRoomName }) {
    const { roomName } = useParams();
    const [player, setPlayer] = useState(undefined);
    const [failedJoin, setFailedJoin] = useState(false);
    const [roomState, updateRoomState] = useReducer(
        (state, payload) => ({ ...state, ...payload }),
        {}
    );

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
        updateRoomState(room);
    });

    if (failedJoin) return <Redirect to="/" />;

    return (
        <Container className="py-5">
            <RoomSetup show={roomState.step === RoomStep.setup && player === Player.white} />
            <Game
                player={player}
                roomStep={roomState.step}
                startingRolls={roomState.dice}
                variant={roomState.variant}
                boardState={roomState.board || null}
                score={roomState.score}
            />
        </Container>
    );
}

export default Room;
