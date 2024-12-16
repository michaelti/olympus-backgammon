import { describe, test } from "vitest";
import { Game } from "../Game.js";
import { Board } from "../../game.js";
import { clone } from "ramda";
import { Player } from "../types.js";

class MockGame extends Game {
    isMoveValid(from: number, to: number): boolean {
        return from < to;
    }

    doMove(from: number, to: number): void {
        this.pips[from].size--;
        this.pips[to].size++;
    }
}

function stressTest(fn: () => void) {
    // Enough times to force vitest to show the 'slow test' time
    const iterations = 100000;

    for (let i = 0; i < iterations; i++) {
        fn();
    }
}

describe("Approaches to cloning boards", () => {
    test("Old (Board) implementation", () => {
        const board = Board();
        const boards = [];

        stressTest(() => {
            const clonedBoard = clone(board);
            boards.push(clonedBoard);
        });
    });

    test("New (Game) implementation", () => {
        const game = new MockGame(Player.black);
        const games = [];
        stressTest(() => {
            const clonedGame = new MockGame(Player.black, game);
            games.push(clonedGame);
        });
    });
});
