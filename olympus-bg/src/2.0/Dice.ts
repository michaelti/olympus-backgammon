import { rollDie } from "./util.js";

export class Dice {
    initial: [number, number] | [number, number, number, number];
    remaining: number[];

    /**
     * Rolls a pair of dice.
     * @param values Optionally provide values for the dice. Random if omitted.
     * @param remaining Optionally provide values for remaining dice. Initial if omitted.
     */
    constructor(values?: [number, number], remaining?: number[]) {
        let dice = values;

        if (!dice) dice = [rollDie(), rollDie()];

        if (dice[0] === dice[1]) {
            this.initial = [dice[0], dice[0], dice[0], dice[0]];
        } else {
            this.initial = [dice[0], dice[1]];
        }

        this.remaining = remaining ?? [...this.initial];
    }

    /**
     * Does the remaining dice include die
     * @param die
     * @returns true or false
     */
    includes(die: number): boolean {
        return this.remaining.includes(die);
    }

    getLargest(): number {
        return Math.max(...this.remaining);
    }

    getSmallest(): number {
        return Math.min(...this.remaining);
    }

    isDoubles(): boolean {
        return this.initial.length === 4;
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

    /**
     * Adds a die back into remaining dice
     * @param die The number to add
     * @returns true if it was successfully added, false otherwise
     */
    unUse(die: number): boolean {
        const index = this.initial.indexOf(die);

        if (index === -1) {
            return false;
        }

        if (index === 0) {
            this.remaining.unshift(die);
            return true;
        }

        this.remaining.push(die);
        return true;
    }
}
