import { Random, MersenneTwister19937 } from "random-js";
export const random = new Random(MersenneTwister19937.autoSeed());

// ENUMS //

// Player ID

export enum Player {
    neither = 0,
    white = 1,
    black = -1,
}

// Turn validity message. Values greater than 0 are valid.
export enum TurnMessage {
    valid = 1,
    validZero = 2,
    invalid = 0,
    invalidMoreMoves = -1,
    invalidLongerMove = -2,
}

// Variant of backgammon
export enum Variant {
    portes = 1,
    plakoto = 2,
    fevga = 3,
}

export type Move = {
    from: number;
    to: number;
};

// FUNCTIONS //

// Returns value clamped to the inclusive range of 0–25
// Ex: (-3) => 0; (15) => 15; (29) => 25
export const clamp = (to: number) => (to < 0 ? 0 : to > 25 ? 25 : to);

// Returns the distance between two pips (1–12)
export const pipDistance = function (from: number, to: number) {
    const dist = Math.abs(to - from);
    return dist <= 12 ? dist : 24 - dist;
};

export const rollDie = () => random.die(6);

// OBJECT FACTORIES //

export const Pip = (size = 0, owner = Player.neither) => ({
    size: size,
    top: owner,
    bot: owner,
});

export const range = (start: number, end: number, length = end - start + 1) =>
    Array.from({ length }, (_, i) => start + i);

export function TODO_DELETE_THIS_isTurnPlayer(
    turn: Player | null,
): asserts turn is Player.black | Player.white {
    if (turn === Player.neither || turn === null) {
        throw "turn musn't be neither or null";
    }
}
