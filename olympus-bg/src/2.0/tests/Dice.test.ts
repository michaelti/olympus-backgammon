import { describe, expect, test } from "vitest";
import { Dice } from "../Dice.js";

describe("constructor", () => {
    test("Constructs dice", () => {
        const dice = new Dice({ remaining: [6, 3] });
        expect(dice).toMatchObject({ remaining: [6, 3] });
    });

    test.todo("Rolls randomly", () => {
        // TODO: mock the random numbers
    });
});

describe("getLargestRemaining", () => {
    test("Gets largest number", () => {
        const dice = new Dice({ remaining: [1, 2] });
        const dice2 = new Dice({ remaining: [2, 1] });

        expect(dice.getLargestRemaining()).toEqual(2);
        expect(dice2.getLargestRemaining()).toEqual(2);
    });
});

describe("getSmallestRemaining", () => {
    test("Gets smallest number", () => {
        const dice = new Dice({ remaining: [1, 2] });
        const dice2 = new Dice({ remaining: [2, 1] });

        expect(dice.getSmallestRemaining()).toEqual(1);
        expect(dice2.getSmallestRemaining()).toEqual(1);
    });
});

describe("use", () => {
    test("Removes the number from remaining", () => {
        const dice = new Dice({ remaining: [1, 2] });
        dice.use(2);
        expect(dice.remaining).not.toContain(2);
    });

    test("Removes the number from remaining for doubles", () => {
        const dice = new Dice({ remaining: [1, 1, 1, 1] });
        dice.use(1);
        expect(dice.remaining).toHaveLength(3);
    });

    test("Does nothing if given invalid die", () => {
        const dice = new Dice({ remaining: [1, 2] });
        dice.use(3);
        expect(dice.remaining).toEqual([1, 2]);
    });
});
