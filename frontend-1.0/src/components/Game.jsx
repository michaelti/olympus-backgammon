import React from "react";
import BackgammonBoard from "./BoardUI/BackgammonBoard";
import BackgammonStartingRoll from "./BoardUI/BackgammonStartingRoll";
import { socketEmit } from "../api";
import { Player, RoomStep, Variant } from "../util";
import GameInfoButton from "./BoardUI/GameInfoButton";
import { cloneBoard } from "../game";

function Game({ player, roomStep, startingRolls, variant, boardState, score, roomName }) {
    const doMove = (from, tos) => {
        const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
        let currentFrom = from;
        tos.forEach(async (to, i) => {
            await sleep(350 * i);
            socketEmit("game/move", currentFrom, to);
            currentFrom = to;
        });
    };

    const applyTurn = () => socketEmit("game/apply-turn");
    const undoMove = () => socketEmit("game/undo-move");

    const getNextPos = (start, die) => {
        const clamp = (to) => (to < 0 ? 0 : to > 25 ? 25 : to);
        let end;
        if (variant === Variant.fevga) {
            if (boardState.turn === Player.white) {
                end = start - die;
                if (start >= 13 && end <= 12) end = 25;
                else if (end < 1) end += 24;
            } else {
                end = clamp(start - die);
            }
        } else {
            end = clamp(start + die * boardState.turn);
        }
        return end;
    };

    const getPossiblePips = (start) => {
        let possiblePips = {};
        const dice = boardState.dice;
        if (!dice[0]) return possiblePips;
        let pos = [start];
        let boardCopy = cloneBoard[variant](boardState);

        for (let i = 1; i <= dice.length; i++) {
            pos[i] = getNextPos(pos[i - 1], dice[i - 1]);
            if (boardCopy.isMoveValid(pos[i - 1], pos[i])) {
                possiblePips[pos[i]] = pos.slice(1, i + 1);
                // TODO Optimize: here we call doMove once more than we have to.
                boardCopy.doMove(pos[i - 1], pos[i]);
            } else break;
        }

        boardCopy = cloneBoard[variant](boardState);

        // Two unique dice remaining
        if (dice.length === 2 && dice[0] !== dice[1]) {
            pos[1] = getNextPos(pos[0], dice[1]);
            if (boardCopy.isMoveValid(pos[0], pos[1])) {
                possiblePips[pos[1]] = [pos[1]];
                boardCopy.doMove(pos[0], pos[1]);
                pos[2] = getNextPos(pos[1], dice[0]);
                if (boardCopy.isMoveValid(pos[1], pos[2])) possiblePips[pos[2]] = [pos[1], pos[2]];
            }
        }

        return possiblePips;
    };

    return boardState === null ? null : (
        <BackgammonBoard
            boardState={boardState}
            isTurn={!import.meta.env.VITE_GAMEDEV ? player === boardState.turn : true}
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
