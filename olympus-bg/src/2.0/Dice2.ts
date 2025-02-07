import { rollDie } from "./util.js";

// TODO: finish this
// or just make it an array in Game yolo

export class Dice {
    remaining: number[];
    isDoubles: boolean;

    constructor(initial?: number[]) {
        if (initial) {
            this.remaining = [...initial];
            return;
        }

        this.remaining = [];
    }

    roll() {
        const rolled = [rollDie(), rollDie()];

        if (rolled[0] === rolled[1]) {
            this.remaining = [...rolled, ...rolled];
            return;
        }

        this.remaining = rolled;
    }
}
