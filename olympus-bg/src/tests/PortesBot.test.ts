import { describe, expect, test } from "vitest";
import { Portes } from "../Portes.js";
import { getBestTurn } from "../PortesBot.js";
import { stringToPips } from "../util.js";

describe("getBestTurn", () => {
    test("[black] Closes a door", () => {
        const game = new Portes({
            player: "black",
            pips: stringToPips(`
                5b 0 0 0 3w 0 5w 0 0 0 0 2b
                5w 0 0 0 3b 0 5b 0 0 0 0 2w
            `),
            dice: [5, 3],
        });

        const turn = getBestTurn(game);

        expect(turn).toMatchObject([
            { from: 8, to: 3 },
            { from: 6, to: 3 },
        ]);
    });

    test("[white] Closes a door", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                5b 0 0 0 3w 0 5w 0 0 0 0 2b
                5w 0 0 0 3b 0 5b 0 0 0 0 2w
            `),
            dice: [5, 3],
        });

        const turn = getBestTurn(game);

        expect(turn).toMatchObject([
            { from: 17, to: 22 },
            { from: 19, to: 22 },
        ]);
    });

    test("[black] Moves home in endgame", () => {
        const game = new Portes({
            player: "black",
            pips: stringToPips(`
                0 0 0 0 0 0 0 0 0 0 0 15w
                0 0 0 1b 1b 1b 2b 2b 2b 2b 2b 2b
            `),
            dice: [3, 2],
        });

        const turn = getBestTurn(game);

        expect(turn).toMatchObject([
            { from: 9, to: 6 },
            { from: 8, to: 6 },
        ]);
    });

    test("[white] Moves home in endgame", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                0 0 0 1w 1w 1w 2w 2w 2w 2w 2w 2w
                0 0 0 0 0 0 0 0 0 0 0 15b
            `),
            dice: [3, 2],
        });

        const turn = getBestTurn(game);

        expect(turn).toMatchObject([
            { from: 16, to: 19 },
            { from: 17, to: 19 },
        ]);
    });

    test("[black] Defends open checkers", () => {
        const game = new Portes({
            player: "black",
            pips: stringToPips(`
                5b 0 0 0 3w 0 5w 1b 0 0 0 1b
                5w 0 0 0 3b 0 3b 1b 1b 0 0 2w
            `),
            dice: [4, 1],
        });

        const turn = getBestTurn(game);

        expect(turn).toMatchObject([
            { from: 24, to: 20 },
            { from: 5, to: 4 },
        ]);
    });

    test("[white] Defends open checkers", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                5b 0 0 0 3w 0 3w 1w 1w 0 0 2b
                5w 0 0 0 3b 0 5b 1w 0 0 0 1w
            `),
            dice: [4, 1],
        });

        const turn = getBestTurn(game);

        expect(turn).toMatchObject([
            { from: 1, to: 5 },
            { from: 20, to: 21 },
        ]);
    });

    test("[black] Defends furthest open checkers", () => {
        const game = new Portes({
            player: "black",
            pips: stringToPips(`
                5b 0 0 0 3w 0 5w 0 0 0 0 1b
                5w 0 0 0 3b 0 4b 1b 1b 0 0 2w
            `),
            dice: [4, 1],
        });

        const turn = getBestTurn(game);

        expect(turn).toMatchObject([
            { from: 8, to: 4 },
            { from: 6, to: 5 },
        ]);
    });

    test("[white] Defends furthest open checkers", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                5b 0 0 0 3w 0 4w 1w 1w 0 0 2b
                5w 0 0 0 3b 0 5b 0 0 0 0 1w
            `),
            dice: [4, 1],
        });

        const turn = getBestTurn(game);

        expect(turn).toMatchObject([
            { from: 17, to: 21 },
            { from: 19, to: 20 },
        ]);
    });

    test("[black] Hits opponent", () => {
        const game = new Portes({
            player: "black",
            pips: stringToPips(`
                6b 0 0 0 1w 1b 5w 2w 0 0 0 0
                5w 0 0 0 3b 0 5b 0 0 0 0 2w
            `),
            dice: [4, 1],
        });

        const turn = getBestTurn(game);

        expect(turn).toMatchObject([
            { from: 18, to: 17 },
            { from: 17, to: 13 },
        ]);
    });

    test("[white] Hits opponent", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                5b 0 0 0 3w 0 5w 0 0 0 0 2b
                6w 0 0 0 1b 1w 5b 2b 0 0 0 0
            `),
            dice: [4, 1],
        });

        const turn = getBestTurn(game);

        expect(turn).toMatchObject([
            { from: 7, to: 8 },
            { from: 8, to: 12 },
        ]);
    });

    test("[black] Bears off", () => {
        const game = new Portes({
            player: "black",
            pips: stringToPips(`
                0 0 0 0 0 0 2w 2w 2w 2w 2w 2w
                0 0 0 0 0 0 2b 2b 2b 2b 2b 2b
            `),
            dice: [5, 4],
        });

        const turn = getBestTurn(game);

        expect(turn).toMatchObject([
            { from: 4, to: 0 },
            { from: 5, to: 0 },
        ]);
    });

    test("[white] Bears off", () => {
        const game = new Portes({
            player: "white",
            pips: stringToPips(`
                0 0 0 0 0 0 2w 2w 2w 2w 2w 2w
                0 0 0 0 0 0 2b 2b 2b 2b 2b 2b
            `),
            dice: [5, 4],
        });

        const turn = getBestTurn(game);

        expect(turn).toMatchObject([
            { from: 20, to: 25 },
            { from: 21, to: 25 },
        ]);
    });
});
