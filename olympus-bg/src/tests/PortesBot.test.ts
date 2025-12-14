import { describe, expect, test } from "vitest";
import { Portes } from "../Portes.js";
import { rankBoard } from "../PortesBot.js";

describe("rankBoard", () => {
    test("Returns a number", () => {
        const game = new Portes({ player: "black" });
        const rank = rankBoard(game);
        expect(rank).toBeGreaterThan(-Infinity);
    });
});
