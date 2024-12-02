import { expect, test, describe } from "vitest";
import { clamp } from "./util.js";

describe("clamp", () => {
    test("Returns 0 for inputs 0 or smaller", () => {
        expect(clamp(0)).toBe(0);
        expect(clamp(-1)).toBe(0);
        expect(clamp(-5)).toBe(0);
    });

    test("Returns 25 for inputs 25 or larger", () => {
        expect(clamp(25)).toBe(25);
        expect(clamp(26)).toBe(25);
        expect(clamp(30)).toBe(25);
    });

    test("Returns the same value for inputs between 0 to 25", () => {
        expect(clamp(1)).toBe(1);
        expect(clamp(5)).toBe(5);
        expect(clamp(10)).toBe(10);
    });
});
