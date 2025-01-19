import { describe, expect, test } from "vitest";
import { Game } from "../Game.js";
import { GameData } from "../types.js";
import { Pip } from "../Pip.js";

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
            pips: [
                { size: 0, owner: "white", isPinned: false },
                { size: 2, owner: "white", isPinned: false },
                { size: 0, owner: "neither", isPinned: false },
                { size: 0, owner: "neither", isPinned: false },
                { size: 0, owner: "neither", isPinned: false },
                { size: 0, owner: "neither", isPinned: false },
                { size: 5, owner: "black", isPinned: false },
                { size: 0, owner: "neither", isPinned: false },
                { size: 3, owner: "black", isPinned: false },
                { size: 0, owner: "neither", isPinned: false },
                { size: 0, owner: "neither", isPinned: false },
                { size: 0, owner: "neither", isPinned: false },
                { size: 5, owner: "white", isPinned: false },
                { size: 5, owner: "black", isPinned: false },
                { size: 0, owner: "neither", isPinned: false },
                { size: 0, owner: "neither", isPinned: false },
                { size: 0, owner: "neither", isPinned: false },
                { size: 3, owner: "white", isPinned: false },
                { size: 0, owner: "neither", isPinned: false },
                { size: 5, owner: "white", isPinned: false },
                { size: 0, owner: "neither", isPinned: false },
                { size: 0, owner: "neither", isPinned: false },
                { size: 0, owner: "neither", isPinned: false },
                { size: 0, owner: "neither", isPinned: false },
                { size: 2, owner: "black", isPinned: false },
                { size: 0, owner: "black", isPinned: false },
            ],
            bar: { white: 0, black: 0 },
            off: { white: 0, black: 0 },
            player: "black",
            dice: { initial: [6, 3], remaining: [6, 3] },
        };

        const game = new MockGame(gameData);

        expect(game).toMatchObject(gameData);
    });
});
