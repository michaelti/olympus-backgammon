import { describe, test } from "vitest";
import { Portes } from "../Portes.js";
import { Board } from "../../game.js";
import { clone } from "ramda";

// TODO: Remove this or do it properly with vitest `bench`

function stressTest(fn: () => void) {
    // Enough times to force vitest to show the 'slow test' time
    const iterations = 200000;

    for (let i = 0; i < iterations; i++) {
        fn();
    }
}

describe("Approaches to cloning boards", { skip: true }, () => {
    test("Old (Board) implementation", () => {
        const board = Board();
        const boards = [];

        stressTest(() => {
            const clonedBoard = clone(board);
            boards.push(clonedBoard);
        });
    });

    test("New (Game) implementation", () => {
        const game = new Portes({ player: "black" });
        const games = [];
        stressTest(() => {
            const clonedGame = new Portes(game);
            games.push(clonedGame);
        });
    });
});
