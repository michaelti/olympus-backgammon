import { describe, test } from "vitest";
import { Game } from "../Game.js";
import { Board } from "../../game.js";
import { clone } from "ramda";
import { GameData, PlayerBW } from "../types.js";

class MockGame extends Game {
    constructor(initial: GameData | { player: PlayerBW }) {
        super(initial);

        if ("pips" in initial) {
            return;
        }

        // Black moves towards pip 1 (decreasing)
        // White moves towards pip 24 (increasing)
        this.pips[25].set(0, "black");
        this.pips[24].set(2, "black");
        this.pips[19].set(5, "white");
        this.pips[17].set(3, "white");
        this.pips[13].set(5, "black");
        this.pips[12].set(5, "white");
        this.pips[8].set(3, "black");
        this.pips[6].set(5, "black");
        this.pips[1].set(2, "white");
        this.pips[0].set(0, "white");
    }

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
    const iterations = 200000;

    for (let i = 0; i < iterations; i++) {
        fn();
    }
}

describe(
    "Approaches to cloning boards",
    () => {
        test("Old (Board) implementation", () => {
            const board = Board();
            const boards = [];

            stressTest(() => {
                const clonedBoard = clone(board);
                boards.push(clonedBoard);
            });
        });

        test("New (Game) implementation", () => {
            const game = new MockGame({ player: "black" });
            const games = [];
            stressTest(() => {
                const clonedGame = new MockGame(game);
                games.push(clonedGame);
            });
        });
    },
    { skip: true },
);
