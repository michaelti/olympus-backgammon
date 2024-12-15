import { rollDie } from "../util.js";

import { expect, describe, test } from "vitest";

describe("rollDie", () => {
    test("Only results in numbers between 1 and 6", () => {
        const numberOfRolls = 100;

        for (let i = 0; i < numberOfRolls; i++) {
            const die = rollDie();
            expect(die).toBeGreaterThanOrEqual(1);
            expect(die).toBeLessThanOrEqual(6);
        }
    });

    test("Results in an even distribution after many rolls", () => {
        const numberOfRolls = 600;
        const idealCountEach = 100;
        const acceptableMargin = 25;

        const results = [0, 0, 0, 0, 0, 0];

        for (let i = 0; i < numberOfRolls; i++) {
            const die = rollDie();
            results[die - 1]++;
        }

        results.forEach((result, i) => {
            expect(result).approximately(
                idealCountEach,
                acceptableMargin,
                `Unexpected number of ${i + 1}s`,
            );
        });
    });
});
