import { PipData, Player, PlayerBW } from "./types.js";

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

/**
 * Returns an array of pips based on a serialized string
 * E.g. stringToPips(`
            5b 0 0 0 3w 0 5w 0 0 0 0 2b
            5w 0 0 0 3b 0 5b 0 0 0 0 2w
            0b 0w
        `)
 */
export function stringToPips(string: string): PipData[] {
    const rows = string.trim().split("\n");
    const topRow = rows[0].split(" ");
    const bottomRow = rows[1].trim().split(" ").reverse();
    const pipValues = [...bottomRow, ...topRow];

    const pips: PipData[] = [];

    for (let i = 0; i < pipValues.length; i++) {
        const pipValue = pipValues[i];
        const playerMap = new Map([
            ["w", Player.white],
            ["b", Player.black],
            ["", Player.neither],
        ]);

        const size = Number(pipValue.replace(/[^0-9]/g, ""));
        const owner = playerMap.get(pipValue.replace(/[^a-z]/g, "")) ?? Player.neither;
        const isPinned = pipValue.includes("*");

        const pip = { owner, size, isPinned };

        pips.push(pip);
    }

    // Bar
    if (rows[2]) {
        const bar = rows[2].trim().split(" ");

        const barBlack = bar.find((item) => item.includes("b"));
        const barWhite = bar.find((item) => item.includes("w"));

        let barBlackSize = 0;
        let barWhiteSize = 0;

        if (barBlack) barBlackSize = Number(barBlack.replace(/[^0-9]/g, ""));
        if (barWhite) barWhiteSize = Number(barWhite.replace(/[^0-9]/g, ""));

        pips.unshift({ owner: Player.white, size: barWhiteSize, isPinned: false }); // "Pip" 0
        pips.push({ owner: Player.black, size: barBlackSize, isPinned: false }); // "Pip" 25

        return pips;
    }

    pips.unshift({ owner: Player.white, size: 0, isPinned: false });
    pips.push({ owner: Player.black, size: 0, isPinned: false });

    return pips;
}
