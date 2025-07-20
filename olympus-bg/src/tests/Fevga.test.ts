import { describe, expect, test } from "vitest";
import { OFF, stringToPips } from "../util.js";
import { Fevga } from "../Fevga.js";

describe("isFirstAway", () => {
    test("Player is in early game state", () => {
        const game = new Fevga({
            player: "white",
            pips: stringToPips(`
                    0 0 0 0 0 0 0 0 0 0 0 0
                    14w 0 0 0 0 0 0 0 0 0 0 1w
                `),
            off: { black: 0, white: 0 },
        });

        const result = game.isFirstAway();

        expect(result).toBe(false);
    });

    test("Player is not in early game state", () => {
        const game = new Fevga({
            player: "white",
            pips: stringToPips(`
                    0 0 0 0 0 0 0 0 0 0 1w 0
                    14w 0 0 0 0 0 0 0 0 0 0 0
                `),
            off: { black: 0, white: 0 },
        });

        const result = game.isFirstAway();

        expect(result).toBe(true);
    });
});

describe("isMoveValid", () => {
    test("Must move checker to other half of board before taking a second", () => {
        const game = new Fevga({
            player: "white",
            dice: [1, 2],
            moves: [],
            pips: stringToPips(`
                    0 0 0 0 0 0 0 0 0 0 0 0
                    14w 0 0 0 0 0 0 0 0 0 0 1w
                `),
            off: { black: 0, white: 0 },
        });

        const result = game.isMoveValid(12, 11);

        expect(result).toBe(false);
    });

    test("First move should be valid", () => {
        const game = new Fevga({
            player: "black",
            dice: [1, 2],
            moves: [],
            pips: stringToPips(`
                    0 0 0 0 0 0 0 0 0 0 0 15b
                    14w 0 0 0 0 0 0 0 0 0 0 1w
                `),
            off: { black: 0, white: 0 },
        });

        const result = game.isMoveValid(24, 22);

        expect(result).toBe(true);
    });

    test("Destination must be a valid pip (no clamping)", () => {
        const game = new Fevga({
            player: "black",
            dice: [2, 2],
            moves: [],
            pips: stringToPips(`
                    0 0 1w 0 0 0 0 0 0 0 0 0
                    14w 0 0 0 0 0 0 0 0 0 0 15b
                `),
            off: { black: 0, white: 0 },
        });

        let result = game.isMoveValid(1, 0);
        expect(result).toBe(true);

        result = game.isMoveValid(1, -1);
        expect(result).toBe(false);
    });

    test("No capturing in fevga", () => {
        const game = new Fevga({
            player: "black",
            dice: [1, 2],
            moves: [],
            pips: stringToPips(`
                    0 0 0 0 0 0 0 0 0 0 1w 5b
                    4w 0 0 0 0 1b 0 0 0 0 0 1w
                `),
            off: { black: 0, white: 0 },
        });

        const result = game.isMoveValid(24, 23);

        expect(result).toBe(false);
    });
});

describe("getDestination", () => {
    test("White's movements", () => {
        const game = new Fevga({
            player: "white",
        });
        let result = game.getDestination(12, 1);
        expect(result).toBe(11);

        result = game.getDestination(1, 1);
        expect(result).toBe(24);

        result = game.getDestination(13, 3);
        expect(result).toBe(OFF.white);
    });

    test("Black's movements", () => {
        const game = new Fevga({
            player: "black",
        });
        let result = game.getDestination(12, 1);
        expect(result).toBe(11);

        result = game.getDestination(1, 1);
        expect(result).toBe(OFF.black);

        result = game.getDestination(13, 3);
        expect(result).toBe(10);
    });
});
