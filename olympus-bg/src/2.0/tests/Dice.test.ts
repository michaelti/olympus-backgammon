import { describe, expect, test } from "vitest";
import { Dice } from "../Dice.js";

describe("constructor", () => {
    test("Constructs doubles", () => {
        const dice = new Dice([1, 1]);
        expect(dice.initial).toEqual([1, 1, 1, 1]);
        expect(dice.remaining).toEqual([1, 1, 1, 1]);
        expect(dice.isDoubles()).toBe(true);
    });

    test("Constructs regular numbers", () => {
        const dice = new Dice([2, 1]);
        expect(dice.initial).toEqual([2, 1]);
        expect(dice.remaining).toEqual([2, 1]);
        expect(dice.isDoubles()).toBe(false);
    });

    test("Constructs remaining dice", () => {
        const dice = new Dice([2, 1], [1]);
        expect(dice.remaining).toEqual([1]);
    });

    test("Rolls randomly", () => {
        const dice = new Dice();

        if (dice.initial[0] === dice.initial[1]) {
            expect(dice.initial).toHaveLength(4);
            expect(dice.remaining).toHaveLength(4);
        } else {
            expect(dice.initial).toHaveLength(2);
            expect(dice.remaining).toHaveLength(2);
        }
    });
});

describe("includes", () => {
    test("If it includes", () => {
        const dice = new Dice([1, 2]);
        expect(dice.includes(3)).toBe(false);
        expect(dice.includes(1)).toBe(true);
        dice.remaining = [2];
        expect(dice.includes(1)).toBe(false);
    });
});

describe("getLargestRemaining", () => {
    test("Gets largest number", () => {
        const dice = new Dice([1, 2]);
        expect(dice.getLargestRemaining()).toEqual(2);

        const dice2 = new Dice([2, 1]);
        expect(dice2.getLargestRemaining()).toEqual(2);
    });
});

describe("getSmallestRemaining", () => {
    test("Gets smallest number", () => {
        const dice = new Dice([1, 2]);
        expect(dice.getSmallestRemaining()).toEqual(1);

        const dice2 = new Dice([2, 1]);
        expect(dice2.getSmallestRemaining()).toEqual(1);
    });
});

describe("isDoubles", () => {
    test("Returns true for doubles", () => {
        const dice = new Dice([1, 1]);
        expect(dice.isDoubles()).toEqual(true);
    });

    test("Returns false for regular roll", () => {
        const dice = new Dice([1, 2]);
        expect(dice.isDoubles()).toEqual(false);
    });
});

describe("use", () => {
    test("Removes the number from remaining", () => {
        const dice = new Dice([1, 2]);
        dice.use(2);
        expect(dice.remaining).not.toContain(2);

        const dice2 = new Dice([2, 1]);
        expect(dice2.getSmallestRemaining()).toEqual(1);
    });

    test("Shortens remaining for doubles", () => {
        const dice = new Dice([1, 1]);
        dice.use(1);
        expect(dice.remaining).toHaveLength(3);
    });

    test("Does nothing if given invalid die", () => {
        const dice = new Dice([1, 2]);
        dice.use(3);
        expect(dice.remaining).toEqual([1, 2]);
    });
});

describe("unUse", () => {
    test("Adds the number to remaining", () => {
        const dice = new Dice([1, 2]);
        dice.remaining = [1];
        dice.unUse(2);
        expect(dice.remaining).toEqual([1, 2]);
    });

    test("Adds the number to remaining in the correct position", () => {
        const dice = new Dice([1, 2]);
        dice.remaining = [2];
        dice.unUse(1);
        expect(dice.remaining).toEqual([1, 2]);
    });

    test("Lengthens remaining for doubles", () => {
        const dice = new Dice([1, 1]);
        dice.remaining = [1, 1, 1];
        dice.unUse(1);
        expect(dice.remaining).toHaveLength(4);
    });

    test("Does nothing if given invalid die", () => {
        const dice = new Dice([1, 2]);
        dice.remaining = [1];
        dice.unUse(3);
        expect(dice.remaining).toEqual([1]);
    });
});
