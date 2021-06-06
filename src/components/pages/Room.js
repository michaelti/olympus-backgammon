import React, { useState, useEffect, useReducer } from "react";
import { useParams, Redirect } from "react-router-dom";
import { useSocketOn, socketEmit } from "../../api";
import { Player, RoomStep } from "../../util";
import RoomSetup from "../RoomSetup";
import Game from "../Game";
import ScoreScreen from "../ScoreScreen";

function Room() {
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
                setPlayer(acknowledgement.player);
            }
        });
    }, [roomName]);

    useSocketOn("room/update-room", (room) => {
        updateRoomState(room);
    });

    if (failedJoin) return <Redirect to="/" />;

    return (
        <>
            <RoomSetup
                show={roomState.step === RoomStep.setup}
                scoreScreen={
                    <ScoreScreen winner={roomState.board?.winner} score={roomState.score} />
                }
                isHost={player === Player.white}
            />
            <Game
                player={player}
                roomStep={roomState.step}
                startingRolls={roomState.dice}
                variant={roomState.variant}
                boardState={roomState.board || null}
                score={roomState.score}
                roomName={roomName}
            />
        </>
    );
}

export default Room;
