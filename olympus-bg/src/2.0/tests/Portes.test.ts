import { describe, expect, test } from "vitest";
import { stringToPips } from "../util.js";
import { Portes } from "../Portes.js";
import { MoveData, TurnValidity } from "../types.js";

describe("isMoveValid", () => {
    test("Returns false if pip isn't owned by player", () => {
        const game = new Portes({
            player: "white",
            dice: [1, 2],
            moves: [],
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 1b
            `),
            off: { black: 0, white: 0 },
        });

        const move: MoveData = { from: 1, to: 2, die: 1 };

        const result = game.isMoveValid(move.from, move.to);

        expect(result).toBe(false);
    });

    test("Returns false if player must first move from the bar", () => {
        const game = new Portes({
            player: "white",
            dice: [1, 2],
            moves: [],
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 1w
                1w
            `),
            off: { black: 0, white: 0 },
        });

        const move: MoveData = { from: 1, to: 2, die: 1 };

        const result = game.isMoveValid(move.from, move.to);

        expect(result).toBe(false);
    });

    test("Returns false if player lands on a door", () => {
        const game = new Portes({
            player: "white",
            dice: [1, 2],
            moves: [],
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 2b 1w
            `),
            off: { black: 0, white: 0 },
        });

        const move: MoveData = { from: 1, to: 2, die: 1 };

        const result = game.isMoveValid(move.from, move.to);

        expect(result).toBe(false);
    });

    test("Returns false if die can't go there", () => {
        const game = new Portes({
            player: "white",
            dice: [1, 2],
            moves: [],
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 1w
            `),
            off: { black: 0, white: 0 },
        });

        const move: MoveData = { from: 1, to: 4, die: 1 };

        const result = game.isMoveValid(move.from, move.to);

        expect(result).toBe(false);
    });

    test("Returns false if moving backwards", { skip: true }, () => {
        const game = new Portes({
            player: "white",
            dice: [1, 2],
            moves: [],
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 1w 0
            `),
            off: { black: 0, white: 0 },
        });

        const move: MoveData = { from: 2, to: 1, die: 1 };

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
                dice: [1, 2],
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
                dice: [6, 6, 6, 6],
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
                dice: [1, 2],
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
                dice: [1, 2],
                moves: [],
            });

            game.startTurn();
            game.doMove(1, 2);

            expect(game.getTurnValidity()).toBe(TurnValidity.invalidMoreMoves);
        });

        test("Player has only moved twice", () => {
            const game = new Portes({
                player: "white",
                pips: stringToPips(`
                    5b 0 0 0 3w 0 5w 0 0 0 0 2b
                    5w 0 0 0 3b 0 5b 0 0 0 0 2w
                `),
                bar: { white: 0, black: 0 },
                off: { white: 0, black: 0 },
                dice: [3, 3, 3, 3],
                moves: [],
            });

            game.startTurn();
            game.doMove(1, 4);
            game.doMove(1, 4);

            expect(game.getTurnValidity()).toBe(TurnValidity.invalidMoreMoves);
        });

        test("Player has only moved thrice", () => {
            const game = new Portes({
                player: "white",
                pips: stringToPips(`
                    5b 0 0 0 3w 0 5w 0 0 0 0 2b
                    5w 0 0 0 3b 0 5b 0 0 0 0 2w
                `),
                bar: { white: 0, black: 0 },
                off: { white: 0, black: 0 },
                dice: [3, 3, 3, 3],
                moves: [],
            });

            game.startTurn();
            game.doMove(1, 4);
            game.doMove(1, 4);
            game.doMove(4, 7);

            expect(game.getTurnValidity()).toBe(TurnValidity.invalidMoreMoves);
        });
    });

    describe("Returns invalidLongerMove if the larger die can be used", () => {
        test("Player can only move one die or the other", () => {
            const game = new Portes({
                player: "white",
                pips: stringToPips(`
                    0 0 0 0 0 0 0 0 0 0 0 0
                    0 0 0 0 0 0 0 0 2b 0 0 1w
                `),
                bar: { white: 0, black: 0 },
                off: { white: 0, black: 0 },
                dice: [1, 2],
                moves: [],
            });

            game.startTurn();
            game.doMove(1, 2);

            expect(game.getTurnValidity()).toBe(TurnValidity.invalidLongerMove);
        });
    });

    describe("Returns valid if the turn is valid", () => {
        test("Player has moved both dice", () => {
            const game = new Portes({
                player: "white",
                pips: stringToPips(`
                    5b 0 0 0 3w 0 5w 0 0 0 0 2b
                    5w 0 0 0 3b 0 5b 0 0 0 0 2w
                `),
                bar: { white: 0, black: 0 },
                off: { white: 0, black: 0 },
                dice: [1, 2],
                moves: [],
            });

            game.startTurn();
            game.doMove(1, 2);
            game.doMove(1, 3);

            expect(game.getTurnValidity()).toBe(TurnValidity.valid);
        });
    });
});

describe("getValidTurnCriteria", () => {
    test("396 (4) possible turns (longest: 4)", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                        5b 0 0 0 3w 0 5w 0 0 0 0 2b
                        5w 0 0 0 3b 0 5b 0 0 0 0 2w
                    `),
            bar: { white: 0, black: 0 },
            off: { white: 0, black: 0 },
            dice: [2, 2, 2, 2],
            moves: [],
        });

        expect(Portes.getValidTurnCriteria(game).turns).toHaveLength(4);
        expect(Portes.getValidTurnCriteria(game).longest).toBe(4);
    });

    test("27 (7) possible turns (longest: 2)", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                        5b 0 0 0 3w 0 5w 0 0 0 0 2b
                        5w 0 0 0 3b 0 5b 0 0 0 0 2w
                    `),
            bar: { white: 0, black: 0 },
            off: { white: 0, black: 0 },
            dice: [2, 1],
            moves: [],
        });

        expect(Portes.getValidTurnCriteria(game).turns).toHaveLength(7);
        expect(Portes.getValidTurnCriteria(game).longest).toBe(2);
    });

    test("1 possible turns (longest: 3)", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                        2b 0 0 0 0 0 0 0 0 0 0 0
                        0 0 0 0 0 0 0 0 0 0 0 3w
                    `),
            bar: { white: 0, black: 0 },
            off: { white: 0, black: 0 },
            dice: [6, 6, 6, 6],
            moves: [],
        });

        expect(Portes.getValidTurnCriteria(game).turns).toHaveLength(1);
        expect(Portes.getValidTurnCriteria(game).longest).toBe(3);
    });

    test("1 possible turns, (longest: 1)", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                        0 0 0 0 0 0 0 0 0 0 0 0
                        2b 0 0 0 0 2b 0 0 0 0 0 2w
                    `),
            bar: { white: 0, black: 0 },
            off: { white: 0, black: 0 },
            dice: [6, 5],
            moves: [],
        });

        expect(Portes.getValidTurnCriteria(game).turns).toHaveLength(1);
        expect(Portes.getValidTurnCriteria(game).longest).toBe(1);
    });

    test("0 possible turns, (longest: 0)", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                        0 0 0 0 0 0 0 0 0 0 0 0
                        0 0 0 0 0 0 0 0 2b 2b 0 2w
                    `),
            bar: { white: 0, black: 0 },
            off: { white: 0, black: 0 },
            dice: [3, 2],
            moves: [],
        });

        expect(Portes.getValidTurnCriteria(game).turns).toHaveLength(0);
        expect(Portes.getValidTurnCriteria(game).longest).toBe(0);
    });
});
