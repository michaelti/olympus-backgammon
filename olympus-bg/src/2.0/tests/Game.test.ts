import { describe, expect, test } from "vitest";
import { Game } from "../Game.js";
import { Player } from "../types.js";
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
        const game = new MockGame(Player.black);
        expect(game.pips).toHaveLength(26);
        expect(game.pips[0]).toBeInstanceOf(Pip);
    });
});
