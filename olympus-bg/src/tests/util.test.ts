import { otherPlayer, pipsToString, rollDie, stringToPips } from "../util.js";
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

describe("otherPlayer", () => {
    test("Returns white given black", () => {
        const player = otherPlayer("black");
        expect(player).toBe("white");
    });

    test("Returns black given white", () => {
        const player = otherPlayer("white");
        expect(player).toBe("black");
    });
});

describe("stringToPips", () => {
    test("Returns portes setup", () => {
        const pips = stringToPips(`
            5b 0 0 0 3w 0 5w 0 0 0 0 2b
            5w 0 0 0 3b 0 5b 0 0 0 0 2w
        `);

        expect(pips).toEqual([
            { owner: "white", size: 0, isPinned: false },
            { owner: "white", size: 2, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "black", size: 5, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "black", size: 3, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "white", size: 5, isPinned: false },
            { owner: "black", size: 5, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "white", size: 3, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "white", size: 5, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "black", size: 2, isPinned: false },
            { owner: "black", size: 0, isPinned: false },
        ]);
    });

    test("Returns bars", () => {
        const pips = stringToPips(`
            0 0 0 0 0 0 0 0 0 0 0 0
            0 0 0 0 0 0 0 0 0 0 0 0
            2b 1w
        `);

        expect(pips).toEqual([
            { owner: "white", size: 1, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "black", size: 2, isPinned: false },
        ]);
    });

    test("Returns pinned", () => {
        const pips = stringToPips(`
            0 0 0 0 0 0 0 0 0 0 0 14b
            0 2b* 0 0 0 0 0 0 0 0 0 14w
        `);

        expect(pips).toEqual([
            { owner: "white", size: 0, isPinned: false },
            { owner: "white", size: 14, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "black", size: 2, isPinned: true },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "black", size: 14, isPinned: false },
            { owner: "black", size: 0, isPinned: false },
        ]);
    });
});

describe("pipsToString", () => {
    test("Returns portes setup", () => {
        const string = pipsToString([
            { owner: "white", size: 0, isPinned: false },
            { owner: "white", size: 2, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "black", size: 5, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "black", size: 3, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "white", size: 5, isPinned: false },
            { owner: "black", size: 5, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "white", size: 3, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "white", size: 5, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "black", size: 2, isPinned: false },
            { owner: "black", size: 0, isPinned: false },
        ]);

        const rows = string.trim().split("\n");

        expect(rows[0]).toEqual("5b 0 0 0 3w 0 5w 0 0 0 0 2b");
        expect(rows[1]).toEqual("5w 0 0 0 3b 0 5b 0 0 0 0 2w");
        expect(rows[2]).toBeUndefined();
    });

    test("Returns bars", () => {
        const string = pipsToString([
            { owner: "white", size: 1, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "black", size: 2, isPinned: false },
        ]);

        const rows = string.trim().split("\n");

        expect(rows[0]).toEqual("0 0 0 0 0 0 0 0 0 0 0 0");
        expect(rows[1]).toEqual("0 0 0 0 0 0 0 0 0 0 0 0");
        expect(rows[2] === "2b 1w" || rows[2] === "1w 2b").toBe(true);
    });

    test("Returns pinned", () => {
        const string = pipsToString([
            { owner: "white", size: 0, isPinned: false },
            { owner: "white", size: 14, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "black", size: 2, isPinned: true },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "neither", size: 0, isPinned: false },
            { owner: "black", size: 14, isPinned: false },
            { owner: "black", size: 0, isPinned: false },
        ]);

        const rows = string.trim().split("\n");

        expect(rows[0]).toEqual("0 0 0 0 0 0 0 0 0 0 0 14b");
        expect(rows[1]).toEqual("0 2b* 0 0 0 0 0 0 0 0 0 14w");
        expect(rows[2]).toBeUndefined();
    });
});
