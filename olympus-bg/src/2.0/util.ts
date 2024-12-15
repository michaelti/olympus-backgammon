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
