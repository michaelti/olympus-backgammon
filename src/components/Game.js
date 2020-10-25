import React from "react";
import styled from "styled-components";
import BackgammonBoard from "./BoardUI/BackgammonBoard";
import BackgammonExtras from "./BoardUI/BackgammonExtras";
import BackgammonOverlay from "./BoardUI/BackgammonOverlay";
import { socketEmit } from "../api";
import { Player, RoomStep, Variant } from "../util";
import { clamp, isMoveValid } from "../game";

const BoardContainer = styled.div`
    position: relative;
`;

function Game({ player, roomStep, startingRolls, variant, boardState, score }) {
    const doMove = (from, to) => socketEmit("game/move", from, to);
    const applyTurn = () => socketEmit("game/apply-turn");
    const undoTurn = () => socketEmit("game/undo-turn");
    const undoMove = () => socketEmit("game/undo-move");

    const getPossiblePips = (from) => {
        let possiblePips = new Set();
        let to;

        for (const die of boardState.dice) {
            if (variant === Variant.fevga) {
                to = from - die;
                if (boardState.turn === Player.white) {
                    if (from >= 13 && to <= 12) to = 25;
                    else if (to < 1) to += 24;
                }
            } else {
                to = clamp(from + die * boardState.turn);
            }
            if (isMoveValid[variant](from, to, boardState)) {
                possiblePips.add(to);
            }
        }

        return possiblePips;
    };

    return boardState === null ? null : (
        <>
            <BackgammonExtras
                boardState={boardState}
                applyTurn={applyTurn}
                undoTurn={undoTurn}
                undoMove={undoMove}
                player={player}
                isTurn={!process.env.REACT_APP_GAMEDEV ? player === boardState.turn : true}
                score={score}
            />
            <BoardContainer>
                <BackgammonBoard
                    boardState={boardState}
                    isTurn={!process.env.REACT_APP_GAMEDEV ? player === boardState.turn : true}
                    doMove={doMove}
                    getPossiblePips={getPossiblePips}
                    flipOffWhite={variant === Variant.fevga}
                />
                {roomStep === RoomStep.startingRoll ? (
                    <BackgammonOverlay
                        dieWhite={startingRolls[Player.white]}
                        dieBlack={startingRolls[Player.black]}
                        dieDraw={startingRolls.draw}
                        player={player}
                    />
                ) : null}
            </BoardContainer>
        </>
    );
}

export default Game;
