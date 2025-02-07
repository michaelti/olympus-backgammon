import { describe, expect, test } from "vitest";
import { stringToPips } from "../util.js";
import { Portes } from "../Portes.js";
import { MoveData, TurnValidity } from "../types.js";

describe("isMoveValid", () => {
    test("Returns false if pip isn't owned by player", () => {
        const game = new Portes({
            player: "white",
            dice: { initial: [1, 2], remaining: [1, 2] },
            moves: [],
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 1b
            `),
            off: { black: 0, white: 0 },
        });

        const move: MoveData = { from: 1, to: 2, dieUsed: 1 };

        const result = game.isMoveValid(move.from, move.to);

        expect(result).toBe(false);
    });

    test("Returns false if player must first move from the bar", () => {
        const game = new Portes({
            player: "white",
            dice: { initial: [1, 2], remaining: [1, 2] },
            moves: [],
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 1w
                1w
            `),
            off: { black: 0, white: 0 },
        });

        const move: MoveData = { from: 1, to: 2, dieUsed: 1 };

        const result = game.isMoveValid(move.from, move.to);

        expect(result).toBe(false);
    });

    test("Returns false if player lands on a door", () => {
        const game = new Portes({
            player: "white",
            dice: { initial: [1, 2], remaining: [1, 2] },
            moves: [],
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 2b 1w
            `),
            off: { black: 0, white: 0 },
        });

        const move: MoveData = { from: 1, to: 2, dieUsed: 1 };

        const result = game.isMoveValid(move.from, move.to);

        expect(result).toBe(false);
    });

    test("Returns false if die can't go there", () => {
        const game = new Portes({
            player: "white",
            dice: { initial: [1, 2], remaining: [1, 2] },
            moves: [],
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 1w
            `),
            off: { black: 0, white: 0 },
        });

        const move: MoveData = { from: 1, to: 4, dieUsed: 1 };

        const result = game.isMoveValid(move.from, move.to);

        expect(result).toBe(false);
    });

    test("Returns false if moving backwards", { skip: true }, () => {
        const game = new Portes({
            player: "white",
            dice: { initial: [1, 2], remaining: [1, 2] },
            moves: [],
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 1w 0
            `),
            off: { black: 0, white: 0 },
        });

        const move: MoveData = { from: 2, to: 1, dieUsed: 1 };

        const result = game.isMoveValid(move.from, move.to);

        expect(result).toBe(false);
    });
});

describe("getTurnValidity", () => {
    describe("Returns validZero if there are no possible moves", () => {
        test("Player is stuck on bar", () => {
            const game = new Portes({
                player: "black",
                pips: stringToPips(`
                    0 0 0 0 0 0 2w 2w 2w 2w 2w 2w
                    0 0 0 0 0 0 0 0 0 0 0 0
                    1b
                `),
                bar: { white: 0, black: 0 },
                off: { white: 0, black: 0 },
                dice: { initial: [1, 2], remaining: [1, 2] },
                moves: [],
            });

            game.startTurn();

            expect(game.getTurnValidity()).toBe(TurnValidity.validZero);
        });

        test("Player is stuck behind a wall", () => {
            const game = new Portes({
                player: "black",
                pips: stringToPips(`
                    0 0 0 0 0 2w 2w 2w 2w 2w 2w 1b
                    0 0 0 0 0 0 0 0 0 0 0 0
                `),
                bar: { white: 0, black: 0 },
                off: { white: 0, black: 0 },
                dice: { initial: [6, 6, 6, 6], remaining: [6, 6, 6, 6] },
                moves: [],
            });

            game.startTurn();

            expect(game.getTurnValidity()).toBe(TurnValidity.validZero);
        });
    });

    describe("Returns invalidMoreMoves if there are more possible moves", () => {
        test("Player hasn't moved at all", () => {
            const game = new Portes({
                player: "white",
                pips: stringToPips(`
                    5b 0 0 0 3w 0 5w 0 0 0 0 2b
                    5w 0 0 0 3b 0 5b 0 0 0 0 2w
                    `),
                bar: { white: 0, black: 0 },
                off: { white: 0, black: 0 },
                dice: { initial: [1, 2], remaining: [1, 2] },
                moves: [],
            });

            game.startTurn();

            expect(game.getTurnValidity()).toBe(TurnValidity.invalidMoreMoves);
        });

        test("Player has only moved once", () => {
            const game = new Portes({
                player: "white",
                pips: stringToPips(`
                    5b 0 0 0 3w 0 5w 0 0 0 0 2b
                    5w 0 0 0 3b 0 5b 0 0 0 0 2w
                    `),
                bar: { white: 0, black: 0 },
                off: { white: 0, black: 0 },
                dice: { initial: [1, 2], remaining: [1, 2] },
                moves: [],
            });

            game.startTurn();
            game.doMove(1, 2);

            expect(game.getTurnValidity()).toBe(TurnValidity.invalidMoreMoves);
        });

        test("Player has moved only twice", () => {
            const game = new Portes({
                player: "white",
                pips: stringToPips(`
                    5b 0 0 0 3w 0 5w 0 0 0 0 2b
                    5w 0 0 0 3b 0 5b 0 0 0 0 2w
                    `),
                bar: { white: 0, black: 0 },
                off: { white: 0, black: 0 },
                dice: { initial: [3, 3, 3, 3], remaining: [3, 3, 3, 3] },
                moves: [],
            });

            game.startTurn();
            game.doMove(1, 4);
            game.doMove(1, 4);

            expect(game.getTurnValidity()).toBe(TurnValidity.invalidMoreMoves);
        });

        test("Player has moved only thrice", () => {
            const game = new Portes({
                player: "white",
                pips: stringToPips(`
                    5b 0 0 0 3w 0 5w 0 0 0 0 2b
                    5w 0 0 0 3b 0 5b 0 0 0 0 2w
                    `),
                bar: { white: 0, black: 0 },
                off: { white: 0, black: 0 },
                dice: { initial: [3, 3, 3, 3], remaining: [3, 3, 3, 3] },
                moves: [],
            });

            game.startTurn();
            game.doMove(1, 4);
            game.doMove(1, 4);
            game.doMove(4, 7);

            expect(game.getTurnValidity()).toBe(TurnValidity.invalidMoreMoves);
        });
    });
});
