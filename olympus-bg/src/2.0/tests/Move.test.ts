import { describe, expect, test } from "vitest";
import { Move } from "../Move.js";

describe("getReversed", () => {
    test("Reverses a regular move", () => {
        const move = new Move(1, 3, 2);
        const reversed = move.getReversed();
        expect(reversed).toEqual({ from: 3, to: 1, die: 2 });
    });

    test("Reverses a move with a side effect", () => {
        const move = new Move(1, 3, 2);
        move.setSideEffect(3, 25);
        const reversed = move.getReversed();
        expect(reversed).toEqual({ from: 3, to: 1, die: 2, sideEffect: { from: 25, to: 3 } });
    });
});
