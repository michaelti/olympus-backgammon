import { describe, expect, test, vi } from "vitest";
import { stringToPips } from "../util.js";
import { Plakoto } from "../Plakoto.js";

describe("isMoveValid", () => {
    test("Returns false if pip isn't owned by player", () => {
        const game = new Plakoto({
            player: "white",
            dice: [1, 2],
            moves: [],
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 1b
            `),
            off: { black: 0, white: 0 },
        });

        const result = game.isMoveValid(1, 2);

        expect(result).toBe(false);
    });

    test("Returns false if wrapping around the board", () => {
        const game = new Plakoto({
            player: "black",
            dice: [1],
            moves: [],
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 1b
                0 0 0 0 0 0 0 0 0 0 0 0
            `),
            off: { black: 0, white: 0 },
        });

        const result = game.isMoveValid(24, 1);

        expect(result).toBe(false);
    });
});

describe("endTurn", () => {
    test("Calls onGameOver if it's a draw", () => {
        const onGameOver = vi.fn();

        const game = new Plakoto(
            {
                player: "black",
                dice: [1],
                moves: [],
                pips: stringToPips(`
                    0 0 0 0 0 0 0 0 0 0 0 2b*
                    0 0 0 0 0 0 0 0 0 0 1b 1w
                `),
                off: { black: 0, white: 0 },
            },
            onGameOver,
        );

        game.startTurn();
        game.doMove(2, 1);
        game.endTurn();

        expect(onGameOver).toHaveBeenCalledWith("neither", 1);
    });

    test("Calls onGameOver if it's an insta-win", () => {
        const onGameOver = vi.fn();

        const game = new Plakoto(
            {
                player: "black",
                dice: [1],
                moves: [],
                pips: stringToPips(`
                    0 0 0 0 0 0 0 0 0 0 0 0
                    0 0 0 0 0 0 0 0 0 0 1b 1w
                `),
                off: { black: 0, white: 0 },
            },
            onGameOver,
        );

        game.startTurn();
        game.doMove(2, 1);
        game.endTurn();

        expect(onGameOver).toHaveBeenCalledWith("black", 2);
    });
});
