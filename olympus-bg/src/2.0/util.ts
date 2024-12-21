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
 */
export function clamp(to: number): number {
    if (to < 0) to = 0;
    if (to > 25) to = 25;
    return to;
}

/**
 * Returns the distance between two pips (1-12)
 */
export function pipDistance(from: number, to: number): number {
    const distance = Math.abs(to - from);
    return distance <= 12 ? distance : 24 - distance;
}

/**
 * Returns an array of integers within the inclusive range of start to end
 */
export function range(start: number, end: number): number[] {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
}
