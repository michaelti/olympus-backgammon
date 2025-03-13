import { rollDie } from "./util.js";

export class Dice {
    remaining: number[];
    isDoubles: boolean;

    /**
     * Rolls a pair of dice.
     * @param init Optionally provide initial values for the dice. Random if omitted.
     */
    constructor(init?: { remaining: number[]; isDoubles: boolean }) {
        if (init) {
            this.remaining = [...init.remaining];
            this.isDoubles = init.isDoubles;
            return;
        }

        this.remaining = [rollDie(), rollDie()];
        this.isDoubles = this.remaining[0] === this.remaining[1];
        if (this.isDoubles) this.remaining = [...this.remaining, ...this.remaining];
    }

    getLargestRemaining(): number {
        return Math.max(...this.remaining);
    }

    getSmallestRemaining(): number {
        return Math.min(...this.remaining);
    }

    /**
     * Uses a die from remaining dice
     * @param die The number to use
     * @returns true if it was successfully used, false otherwise
     */
    use(die: number): boolean {
        const index = this.remaining.indexOf(die);

        if (index === -1) {
            return false;
        }

        this.remaining.splice(index, 1);
        return true;
    }
}
