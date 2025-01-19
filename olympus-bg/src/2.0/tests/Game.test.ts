import { describe, expect, test } from "vitest";
import { Game } from "../Game.js";
import { GameData, TurnValidity } from "../types.js";
import { Pip } from "../Pip.js";
import { stringToPips } from "../util.js";

// Mock game implementation because
// abstract class can't be tested directly
class MockGame extends Game {
    isMoveValid(from: number, to: number): boolean {
        return from < to;
    }

    doMove(from: number, to: number): void {
        this.pips[from].size--;
        this.pips[to].size++;
    }
}

describe("constructor", () => {
    test("Initializes pips", () => {
        const game = new MockGame({ player: "black" });
        expect(game.pips).toHaveLength(26);
        expect(game.pips[0]).toBeInstanceOf(Pip);
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
            dice: { initial: [6, 3], remaining: [6, 3] },
        };

        const game = new MockGame(gameData);

        expect(game).toMatchObject(gameData);
    });
});

describe("getTurnValidity", () => {
    test("Returns validZero if there are no possible moves", () => {
        const game = new MockGame({
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

        expect(game.getTurnValidity()).toBe(TurnValidity.validZero);
    });
});
