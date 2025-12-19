import { PipData, Player, PlayerBW } from "./types.js";

/**
 * Pip numbers representing each player's off
 */
export const OFF = {
    // TODO: would it be helpful for OFF, BAR, and START be static properties in variants?
    black: 0,
    white: 25,
};

/**
 * Pip numbers representing each player's bar
 */
export const BAR = {
    black: 25,
    white: 0,
};

/**
 * Pip numbers representing each player's starting point
 */
export const START = {
    black: 24,
    white: 1,
};

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
    if (player === "black") return "white";
    else return "black";
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
 * Returns the distance between two pips
 */
export function pipDistance(from: number, to: number): number {
    return Math.abs(to - from);
}

/**
 * Returns an array of integers within the inclusive range of start to end
 * @example
 * range(1,3) -> [1,2,3]
 * range(3,1) -> [3,2,1]
 */
export function range(start: number, end: number): number[] {
    const length = Math.abs(end - start) + 1;
    return Array.from({ length }, (_, i) => start + (start < end ? i : -i));
}

/**
 * Returns an array of pips based on a serialized string
 * @example
 * stringToPips(`
        5b 0 0 0 3w 0 5w 0 0 0 0 2b
        5w 0 0 0 3b 0 5b 0 0 0 0 2w
        2b 1w
    `)
 * stringToPips(`
        0 0 0 0 0 0 0 0 0 0 0 14b
        0 2b* 0 0 0 0 0 0 0 0 0 14w
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
        const playerMap = new Map<string, Player>([
            ["w", "white"],
            ["b", "black"],
            ["", "neither"],
        ]);

        const size = Number(pipValue.replace(/[^0-9]/g, ""));
        const owner = playerMap.get(pipValue.replace(/[^a-z]/g, "")) ?? "neither";
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

        pips.unshift({ owner: "white", size: barWhiteSize, isPinned: false }); // "Pip" 0
        pips.push({ owner: "black", size: barBlackSize, isPinned: false }); // "Pip" 25

        return pips;
    }

    pips.unshift({ owner: "white", size: 0, isPinned: false });
    pips.push({ owner: "black", size: 0, isPinned: false });

    return pips;
}

/**
 * Returns a serialized string based on an array of pips
 * @see {@link stringToPips} for more info.
 */
export function pipsToString(pips: PipData[]): string {
    const playerMap = new Map([
        ["white", "w"],
        ["black", "b"],
        ["neither", ""],
    ]);

    const pipToString = (pip: PipData) => {
        const size = String(pip.size);
        const owner = pip.size > 0 ? playerMap.get(pip.owner) : "";
        const pinned = pip.isPinned ? "*" : "";
        return size + owner + pinned;
    };

    let string = "";

    const topRow = [];
    const bottomRow = [];
    const bar = [];

    for (let i = 13; i <= 24; i++) {
        topRow.push(pipToString(pips[i]));
    }

    for (let i = 12; i >= 1; i--) {
        bottomRow.push(pipToString(pips[i]));
    }

    if (pips[0].size > 0) {
        const size = String(pips[0].size);
        const owner = playerMap.get(pips[0].owner);
        bar.push(size + owner);
    }

    if (pips[25].size > 0) {
        const size = String(pips[25].size);
        const owner = playerMap.get(pips[25].owner);
        bar.push(size + owner);
    }

    string += topRow.join(" ");
    string += "\n";
    string += bottomRow.join(" ");

    if (bar.length > 0) {
        string += "\n";
        string += bar.join(" ");
    }

    return string;
}
