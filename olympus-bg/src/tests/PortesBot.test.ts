import { describe, expect, test } from "vitest";
import { Portes } from "../Portes.js";
import { getBestTurn } from "../PortesBot.js";
import { stringToPips } from "../util.js";

describe("getBestTurn", () => {
    test("Closes a door", () => {
        const game = new Portes({
            player: "black",
            pips: stringToPips(`
                5b 0 0 0 3w 0 5w 0 0 0 0 2b
                5w 0 0 0 3b 0 5b 0 0 0 0 2w
            `),
            dice: [5, 3],
            moves: [],
        });

        const turn = getBestTurn(game);

        expect(turn).toMatchObject([
            { from: 8, to: 3 },
            { from: 6, to: 3 },
        ]);
    });
});
