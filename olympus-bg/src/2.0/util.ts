import { Player, PlayerBW } from "./types.js";

/**
 * Generates a random number between 1 and 6
 */
export function rollDie() {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return 1 + (array[0] % 6);
}

/**
 * Returns the opposite player
 */
export function otherPlayer(player: PlayerBW): PlayerBW {
    if (player === Player.black) return Player.white;
    else return Player.black;
}

/**
 * Returns value clamped to the inclusive range of 0–25
 * Ex: (-3) => 0; (15) => 15; (29) => 25
 */
export const clamp = (to: number) => (to < 0 ? 0 : to > 25 ? 25 : to);

// Returns the distance between two pips (1–12)
export const pipDistance = function (from: number, to: number) {
    const dist = Math.abs(to - from);
    return dist <= 12 ? dist : 24 - dist;
};

export const range = (start: number, end: number, length = end - start + 1) =>
    Array.from({ length }, (_, i) => start + i);
