import { bench } from "vitest";
import { Portes } from "../Portes.js";
import { Board } from "../../game.js";
import { clone } from "ramda";

// This benchmark can be run using `npx vitest bench`

// TODO: Remove this?

bench("Old (Board) implementation", () => {
    const board = Board();
    clone(board);
});

bench("New (Game) implementation", () => {
    const game = new Portes({ player: "black" });
    game.clone();
});
