import { describe, expect, test } from "vitest";
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
});
