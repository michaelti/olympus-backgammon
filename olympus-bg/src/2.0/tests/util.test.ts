import { otherPlayer, rollDie, stringToPips } from "../util.js";
import { Player } from "../types.js";
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
        const player = otherPlayer(Player.black);
        expect(player).toBe(Player.white);
    });

    test("Returns black given white", () => {
        const player = otherPlayer(Player.white);
        expect(player).toBe(Player.black);
    });
});

describe("stringToPips", () => {
    test("Returns portes setup", () => {
        const pips = stringToPips(`
            5b 0 0 0 3w 0 5w 0 0 0 0 2b
            5w 0 0 0 3b 0 5b 0 0 0 0 2w
        `);

        expect(pips).toEqual([
            { owner: Player.white, size: 0, isPinned: false },
            { owner: Player.white, size: 2, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.black, size: 5, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.black, size: 3, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.white, size: 5, isPinned: false },
            { owner: Player.black, size: 5, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.white, size: 3, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.white, size: 5, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.black, size: 2, isPinned: false },
            { owner: Player.black, size: 0, isPinned: false },
        ]);
    });

    test("Returns bars", () => {
        const pips = stringToPips(`
            0 0 0 0 0 0 0 0 0 0 0 0
            0 0 0 0 0 0 0 0 0 0 0 0
            2b 1w
        `);

        expect(pips).toEqual([
            { owner: Player.white, size: 1, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.neither, size: 0, isPinned: false },
            { owner: Player.black, size: 2, isPinned: false },
        ]);
    });
});
