import { describe, expect, test } from "vitest";
import { Game } from "../Game.js";
import { Player, GameData } from "../types.js";
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
        const game = new MockGame({ player: Player.black });
        expect(game.pips).toHaveLength(26);
        expect(game.pips[0]).toBeInstanceOf(Pip);
    });

    test("Makes a game with gameData", () => {
        const gameData: GameData = {
            moves: [],
            pips: [
                { size: 0, owner: 1, isPinned: false },
                { size: 2, owner: 1, isPinned: false },
                { size: 0, owner: 0, isPinned: false },
                { size: 0, owner: 0, isPinned: false },
                { size: 0, owner: 0, isPinned: false },
                { size: 0, owner: 0, isPinned: false },
                { size: 5, owner: -1, isPinned: false },
                { size: 0, owner: 0, isPinned: false },
                { size: 3, owner: -1, isPinned: false },
                { size: 0, owner: 0, isPinned: false },
                { size: 0, owner: 0, isPinned: false },
                { size: 0, owner: 0, isPinned: false },
                { size: 5, owner: 1, isPinned: false },
                { size: 5, owner: -1, isPinned: false },
                { size: 0, owner: 0, isPinned: false },
                { size: 0, owner: 0, isPinned: false },
                { size: 0, owner: 0, isPinned: false },
                { size: 3, owner: 1, isPinned: false },
                { size: 0, owner: 0, isPinned: false },
                { size: 5, owner: 1, isPinned: false },
                { size: 0, owner: 0, isPinned: false },
                { size: 0, owner: 0, isPinned: false },
                { size: 0, owner: 0, isPinned: false },
                { size: 0, owner: 0, isPinned: false },
                { size: 2, owner: -1, isPinned: false },
                { size: 0, owner: -1, isPinned: false },
            ],
            bar: { "1": 0, "-1": 0 },
            off: { "1": 0, "-1": 0 },
            player: -1,
            dice: { initial: [6, 3], remaining: [6, 3] },
        };

        const game = new MockGame(gameData);

        expect(game).toMatchObject(gameData);
    });
});
