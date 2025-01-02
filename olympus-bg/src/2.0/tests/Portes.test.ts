import { describe, expect, test } from "vitest";
import { stringToPips } from "../util.js";
import { Portes } from "../Portes.js";
import { MoveData, Player } from "../types.js";

describe("isMoveValid", () => {
    test("Returns false if pip isn't owned by player", () => {
        const game = new Portes({
            player: Player.white,
            dice: { initial: [1, 2], remaining: [1, 2] },
            moves: [],
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 1b
            `),
            off: { [Player.black]: 0, [Player.white]: 0 },
        });

        const move: MoveData = { from: 1, to: 2, dieUsed: 1 };

        const result = game.isMoveValid(move.from, move.to);

        expect(result).toBe(false);
    });

    test("Returns false if player must first move from the bar", () => {
        const game = new Portes({
            player: Player.white,
            dice: { initial: [1, 2], remaining: [1, 2] },
            moves: [],
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 1w
                1w
            `),
            off: { [Player.black]: 0, [Player.white]: 0 },
        });

        const move: MoveData = { from: 1, to: 2, dieUsed: 1 };

        const result = game.isMoveValid(move.from, move.to);

        expect(result).toBe(false);
    });

    test("Returns false if player lands on a door", () => {
        const game = new Portes({
            player: Player.white,
            dice: { initial: [1, 2], remaining: [1, 2] },
            moves: [],
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 2b 1w
            `),
            off: { [Player.black]: 0, [Player.white]: 0 },
        });

        const move: MoveData = { from: 1, to: 2, dieUsed: 1 };

        const result = game.isMoveValid(move.from, move.to);

        expect(result).toBe(false);
    });

    test("Returns false if die can't go there", () => {
        const game = new Portes({
            player: Player.white,
            dice: { initial: [1, 2], remaining: [1, 2] },
            moves: [],
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 1w
            `),
            off: { [Player.black]: 0, [Player.white]: 0 },
        });

        const move: MoveData = { from: 1, to: 4, dieUsed: 1 };

        const result = game.isMoveValid(move.from, move.to);

        expect(result).toBe(false);
    });
});
