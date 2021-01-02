import React from "react";
import BackgammonBoard from "./BoardUI/BackgammonBoard";
import BackgammonStartingRoll from "./BoardUI/BackgammonStartingRoll";
import { socketEmit } from "../api";
import { Player, RoomStep, Variant } from "../util";
import { clamp, isMoveValid } from "../game";
import GameInfoButton from "./BoardUI/GameInfoButton";

function Game({ player, roomStep, startingRolls, variant, boardState, score, roomName }) {
    const doMove = (from, to) => socketEmit("game/move", from, to);
    const applyTurn = () => socketEmit("game/apply-turn");
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
        <BackgammonBoard
            boardState={boardState}
            isTurn={!process.env.REACT_APP_GAMEDEV ? player === boardState.turn : true}
            doMove={doMove}
            getPossiblePips={getPossiblePips}
            flipOffWhite={variant === Variant.fevga}
            applyTurn={applyTurn}
            undoMove={undoMove}
            startingRollW={
                roomStep === RoomStep.startingRoll && (
                    <BackgammonStartingRoll
                        startingRolls={startingRolls}
                        player={player}
                        color={Player.white}
                    />
                )
            }
            startingRollB={
                roomStep === RoomStep.startingRoll && (
                    <BackgammonStartingRoll
                        startingRolls={startingRolls}
                        player={player}
                        color={Player.black}
                    />
                )
            }
            gameInfoButton={<GameInfoButton player={player} score={score} roomName={roomName} />}
        />
    );
}

export default Game;
