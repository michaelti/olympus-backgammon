import { Game } from "./Game.js";
import { clamp, pipDistance, range, OFF, BAR } from "./util.js";
import { InitialGameData, OnGameOver } from "./types.js";
import { Move } from "./Move.js";

export class Portes extends Game {
    constructor(initial: InitialGameData, onGameOver?: OnGameOver) {
        super(initial, onGameOver);
        if ("pips" in initial) return;

        // Black moves towards pip 1 (off: 0, bar: 25)
        // White moves towards pip 24  (off: 25, bar: 0)
        this.pips[25].set(0, "black");
        this.pips[24].set(2, "black");
        this.pips[19].set(5, "white");
        this.pips[17].set(3, "white");
        this.pips[13].set(5, "black");
        this.pips[12].set(5, "white");
        this.pips[8].set(3, "black");
        this.pips[6].set(5, "black");
        this.pips[1].set(2, "white");
        this.pips[0].set(0, "white");
    }

    isMoveValid(from: number, to: number): boolean {
        to = clamp(to);
        if (this.pips[from].owner !== this.player) return false;

        // Entering the board
        if (this.pips[BAR[this.player]].size > 0) {
            if (from !== BAR[this.player]) return false;
            if (this.pips[to].owner !== this.player && this.pips[to].size > 1) return false;
            if (!this.dice.includes(pipDistance(from, to))) return false;
        }
        // Bearing off
        else if (to === OFF[this.player]) {
            // Range of all pips excluding the current player's home quadrant
            const nonHomePips = this.player === "white" ? range(1, 18) : range(7, 24);
            for (const i of nonHomePips) {
                if (this.pips[i].owner === this.player) return false;
            }
            // If bearing off from an non-exact number of pips
            if (!this.dice.includes(pipDistance(from, to))) {
                // Check if there's a big enough dice
                if (Math.max(...this.dice) > pipDistance(from, to)) {
                    // Range of pips in the player's home quadrant that are further away than the pip from which they are trying to bear off
                    const furtherHomePips =
                        this.player === "white" ? range(19, from - 1) : range(from + 1, 6);
                    for (const i of furtherHomePips) {
                        if (this.pips[i].owner === this.player) return false;
                    }
                } else {
                    return false;
                }
            }
        }
        // Standard move
        else {
            if (from < 1 || from > 24 || to < 1 || to > 24) return false;
            if (this.pips[to].owner !== this.player && this.pips[to].size > 1) return false;
            if (!this.dice.includes(pipDistance(from, to))) return false;
        }

        return true;
    }

    doMove(from: number, to: number): void {
        super.saveBoardHistory();

        to = clamp(to);
        // const bar = this.player === "white" ? 0 : 25;
        // const otherBar = this.player === "white" ? 25 : 0;
        let sideEffect;

        // From pip
        this.pips[from].size--;

        // Don't change the owner of the bar ever
        if (this.pips[from].size === 0 && from !== BAR[this.player]) {
            this.pips[from].owner = "neither";
        }

        // To pip
        if (to === OFF[this.player]) {
            // Bearing off
            this.off[this.player]++;
        } else {
            // Sending opponent to the bar
            if (this.pips[to].owner === this.otherPlayer()) {
                this.pips[BAR[this.otherPlayer()]].size++;
                sideEffect = { from: to, to: BAR[this.otherPlayer()] };
            }
            // Regular move
            else {
                this.pips[to].size++;
            }
            this.pips[to].owner = this.player;
        }

        // Try smallest dice possible
        let die = Math.min(...this.dice);

        if (die < pipDistance(from, to)) {
            die = Math.max(...this.dice);
        }

        // Consume the die
        const dieIndex = this.dice.indexOf(die);
        this.dice.splice(dieIndex, 1);

        this.moves.push(new Move(from, to, die, sideEffect));
    }

    getDestination(start: number, die: number): number {
        const direction = this.player == "black" ? -1 : 1;
        return clamp(direction * die + start);
    }

    clone(): Portes {
        return new Portes(this);
    }
}
