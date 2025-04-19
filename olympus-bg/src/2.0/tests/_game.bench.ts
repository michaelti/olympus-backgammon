import { bench } from "vitest";
import { Portes } from "../Portes.js";
import { Board } from "../../game.js";
import { clone } from "ramda";

// Run using `npx vitest bench`

bench("Old (Board) implementation", () => {
    const board = Board();
    clone(board);
});

bench("New (Game) implementation", () => {
    const game = new Portes({ player: "black" });
    game.clone();
});
