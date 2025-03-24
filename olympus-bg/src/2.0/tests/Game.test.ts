import { describe, expect, test } from "vitest";
import { Portes } from "../Portes.js";
import { GameData } from "../types.js";
import { stringToPips } from "../util.js";

// Mock game implementation because abstract class can't be tested directly
// TODO: have all game tests just use Portes/Plakoto/Fevga instead of faking it
class MockGame extends Portes {}

describe("constructor", () => {
    test("Initializes pips", () => {
        const game = new MockGame({ player: "black" });
        expect(game.pips).toHaveLength(26);
    });

    test("Makes a game with gameData", () => {
        const gameData: GameData = {
            moves: [],
            pips: stringToPips(`
                5b 0 0 0 3w 0 5w 0 0 0 0 2b
                5w 0 0 0 3b 0 5b 0 0 0 0 2w
            `),
            bar: { white: 0, black: 0 },
            off: { white: 0, black: 0 },
            player: "black",
            dice: [6, 3],
        };

        const game = new MockGame(gameData);

        expect(game).toMatchObject(gameData);
    });
});
