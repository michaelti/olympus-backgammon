import { describe, expect, test, vi } from "vitest";
import { stringToPips, BAR } from "../util.js";
import { Portes } from "../Portes.js";

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

        const result = game.isMoveValid(1, 2);

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

        const result = game.isMoveValid(1, 2);

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

        const result = game.isMoveValid(1, 2);

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

        const result = game.isMoveValid(1, 4);

        expect(result).toBe(false);
    });

    test("Returns false if moving backwards", () => {
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

        const result = game.isMoveValid(2, 1);

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
                off: { white: 0, black: 0 },
                dice: [1, 2],
                moves: [],
            });

            game.startTurn();

            const { valid, reason } = game.getTurnValidity();

            expect(valid).toBe(true);
            expect(reason).toBe("NoPossibleMoves");
        });

        test("Player is stuck behind a wall", () => {
            const game = new Portes({
                player: "black",
                pips: stringToPips(`
                    0 0 0 0 0 2w 2w 2w 2w 2w 2w 1b
                    0 0 0 0 0 0 0 0 0 0 0 0
                `),
                off: { white: 0, black: 0 },
                dice: [6, 6, 6, 6],
                moves: [],
            });

            game.startTurn();

            const { valid, reason } = game.getTurnValidity();

            expect(valid).toBe(true);
            expect(reason).toBe("NoPossibleMoves");
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
                off: { white: 0, black: 0 },
                dice: [1, 2],
                moves: [],
            });

            game.startTurn();

            const { valid, reason } = game.getTurnValidity();

            expect(valid).toBe(false);
            expect(reason).toBe("MorePossibleMoves");
        });

        test("Player has only moved once", () => {
            const game = new Portes({
                player: "white",
                pips: stringToPips(`
                    5b 0 0 0 3w 0 5w 0 0 0 0 2b
                    5w 0 0 0 3b 0 5b 0 0 0 0 2w
                `),
                off: { white: 0, black: 0 },
                dice: [1, 2],
                moves: [],
            });

            game.startTurn();
            game.doMove(1, 2);

            const { valid, reason } = game.getTurnValidity();

            expect(valid).toBe(false);
            expect(reason).toBe("MorePossibleMoves");
        });

        test("Player has only moved twice", () => {
            const game = new Portes({
                player: "white",
                pips: stringToPips(`
                    5b 0 0 0 3w 0 5w 0 0 0 0 2b
                    5w 0 0 0 3b 0 5b 0 0 0 0 2w
                `),
                off: { white: 0, black: 0 },
                dice: [3, 3, 3, 3],
                moves: [],
            });

            game.startTurn();
            game.doMove(1, 4);
            game.doMove(1, 4);

            const { valid, reason } = game.getTurnValidity();

            expect(valid).toBe(false);
            expect(reason).toBe("MorePossibleMoves");
        });

        test("Player has only moved thrice", () => {
            const game = new Portes({
                player: "white",
                pips: stringToPips(`
                    5b 0 0 0 3w 0 5w 0 0 0 0 2b
                    5w 0 0 0 3b 0 5b 0 0 0 0 2w
                `),
                off: { white: 0, black: 0 },
                dice: [3, 3, 3, 3],
                moves: [],
            });

            game.startTurn();
            game.doMove(1, 4);
            game.doMove(1, 4);
            game.doMove(4, 7);

            const { valid, reason } = game.getTurnValidity();

            expect(valid).toBe(false);
            expect(reason).toBe("MorePossibleMoves");
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
                off: { white: 0, black: 0 },
                dice: [1, 2],
                moves: [],
            });

            game.startTurn();
            game.doMove(1, 2);

            const { valid, reason } = game.getTurnValidity();

            expect(valid).toBe(false);
            expect(reason).toBe("LargerPossibleMove");
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
                off: { white: 0, black: 0 },
                dice: [1, 2],
                moves: [],
            });

            game.startTurn();
            game.doMove(1, 2);
            game.doMove(1, 3);

            const { valid, reason } = game.getTurnValidity();

            expect(valid).toBe(true);
            expect(reason).toBe("Valid");
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
            off: { white: 0, black: 0 },
            dice: [3, 2],
            moves: [],
        });

        expect(Portes.getValidTurnCriteria(game).turns).toHaveLength(0);
        expect(Portes.getValidTurnCriteria(game).longest).toBe(0);
    });
});

describe("undoMove", () => {
    test("Undoes first move", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                5b 0 0 0 3w 0 5w 0 0 0 0 2b
                5w 0 0 0 3b 0 5b 0 0 0 0 2w
            `),
            dice: [1, 2],
            moves: [],
        });

        game.startTurn();
        const snapshot = structuredClone(game);
        game.doMove(1, 2);
        game.undoMove();

        expect(game).toMatchObject(snapshot);
    });

    test("Undoes second move", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                5b 0 0 0 3w 0 5w 0 0 0 0 2b
                5w 0 0 0 3b 0 5b 0 0 0 0 2w
            `),
            dice: [1, 2],
            moves: [],
        });

        game.startTurn();
        game.doMove(1, 2);
        const snapshot = structuredClone(game);
        game.doMove(1, 3);
        game.undoMove();

        expect(game).toMatchObject(snapshot);
    });

    test("Undoes two moves", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                5b 0 0 0 3w 0 5w 0 0 0 0 2b
                5w 0 0 0 3b 0 5b 0 0 0 0 2w
            `),
            dice: [1, 2],
            moves: [],
        });

        game.startTurn();
        const snapshot = structuredClone(game);
        game.doMove(1, 2);
        game.doMove(1, 3);
        game.undoMove();
        game.undoMove();

        expect(game).toMatchObject(snapshot);
    });

    test("Undoes third move", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                5b 0 0 0 3w 0 5w 0 0 0 0 2b
                5w 0 0 0 3b 0 5b 0 0 0 0 2w
            `),
            dice: [1, 1, 1, 1],
            moves: [],
        });

        game.startTurn();
        game.doMove(1, 2);
        game.doMove(1, 2);
        const snapshot = structuredClone(game);
        game.doMove(2, 3);
        game.undoMove();

        expect(game).toMatchObject(snapshot);
    });

    test("Undoes three moves", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                5b 0 0 0 3w 0 5w 0 0 0 0 2b
                5w 0 0 0 3b 0 5b 0 0 0 0 2w
            `),
            dice: [1, 1, 1, 1],
            moves: [],
        });

        game.startTurn();
        const snapshot = structuredClone(game);
        game.doMove(1, 2);
        game.doMove(1, 2);
        game.doMove(2, 3);
        game.undoMove();
        game.undoMove();
        game.undoMove();

        expect(game).toMatchObject(snapshot);
    });

    test("Undoes fourth move", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                5b 0 0 0 3w 0 5w 0 0 0 0 2b
                5w 0 0 0 3b 0 5b 0 0 0 0 2w
            `),
            dice: [1, 1, 1, 1],
            moves: [],
        });

        game.startTurn();
        game.doMove(1, 2);
        game.doMove(1, 2);
        game.doMove(2, 3);
        const snapshot = structuredClone(game);
        game.doMove(2, 3);
        game.undoMove();

        expect(game).toMatchObject(snapshot);
    });

    test("Undoes four moves", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                5b 0 0 0 3w 0 5w 0 0 0 0 2b
                5w 0 0 0 3b 0 5b 0 0 0 0 2w
            `),
            dice: [1, 1, 1, 1],
            moves: [],
        });

        game.startTurn();
        const snapshot = structuredClone(game);
        game.doMove(1, 2);
        game.doMove(1, 2);
        game.doMove(2, 3);
        game.doMove(2, 3);
        game.undoMove();
        game.undoMove();
        game.undoMove();
        game.undoMove();

        expect(game).toMatchObject(snapshot);
    });

    test("Undoes move with side effect", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 1b 2w
            `),
            dice: [1, 2],
            moves: [],
        });

        game.startTurn();
        const snapshot = structuredClone(game);
        game.doMove(1, 2);
        game.undoMove();

        expect(game).toMatchObject(snapshot);
    });

    test("Undoes move from bar", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 0 0
                0b 1w
            `),
            dice: [1, 2],
            moves: [],
        });

        game.startTurn();
        const snapshot = structuredClone(game);
        game.doMove(BAR["white"], 1);
        game.undoMove();

        expect(game).toMatchObject(snapshot);
    });

    test("Undoes move to off", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 2w
                0 0 0 0 0 0 0 0 0 0 0 0
            `),
            dice: [1, 2],
            moves: [],
        });

        game.startTurn();
        const snapshot = structuredClone(game);
        game.doMove(24, 25);
        game.undoMove();

        expect(game).toMatchObject(snapshot);
    });

    test("Does nothing if no moves have been made", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 0
                0 0 0 0 0 0 0 0 0 0 1b 2w
            `),
            dice: [1, 2],
            moves: [],
        });

        game.startTurn();
        const snapshot = structuredClone(game);
        game.undoMove();

        expect(game).toMatchObject(snapshot);
    });
});

describe("doMove", () => {
    test("Does nothing if isMoveValid returns false", () => {
        const game = new Portes({ player: "white" });

        vi.spyOn(Portes.prototype, "isMoveValid").mockReturnValue(false);

        game.startTurn();
        const snapshot = structuredClone(game);
        game.doMove(1, 2);

        expect(game).toMatchObject(snapshot);
    });
});

describe.todo("getDestination", () => {});

describe.todo("startTurn", () => {});

describe.todo("endTurn", () => {});
