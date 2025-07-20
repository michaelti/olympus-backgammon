import { Game } from "./Game.js";
import { clamp, pipDistance, range, OFF } from "./util.js";
import { InitialGameData, OnGameOver } from "./types.js";
import { Move } from "./Move.js";

export class Plakoto extends Game {
    constructor(initial: InitialGameData, onGameOver?: OnGameOver) {
        super(initial, onGameOver);
        if ("pips" in initial) return;

        // Black moves towards pip 1 (off: 0)
        // White moves towards pip 24  (off: 25)
        this.pips[24].set(15, "black");
        this.pips[1].set(15, "white");
    }

    isMoveValid(from: number, to: number): boolean {
        to = clamp(to);
        if (this.pips[from].owner !== this.player) return false;

        // Prevent backwards movements
        if (this.player === "black" && to >= from) return false;
        if (this.player === "white" && to <= from) return false;

        // Bearing off
        if (to === OFF[this.player]) {
            // Range of all pips in current player's home quandrant
            const homePips = this.player === "white" ? range(19, 24) : range(1, 6);
            for (const i of homePips) {
                if (this.pips[i].owner === this.otherPlayer() && this.pips[i].isPinned) {
                    return false;
                }
            }

            // Range of all pips excluding the current player's home quadrant
            const nonHomePips = this.player === "white" ? range(1, 18) : range(7, 24);
            for (const i of nonHomePips) {
                if (this.pips[i].owner === this.player) return false;
                if (this.pips[i].owner === this.otherPlayer() && this.pips[i].isPinned) {
                    return false;
                }
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

    doMove(from: number, to: number): boolean {
        if (!this.isMoveValid(from, to)) {
            return false;
        }

        super.saveBoardHistory();

        // From pip
        this.pips[from].size--;

        if (this.pips[from].size === 1 && this.pips[from].isPinned) {
            this.pips[from].isPinned = false;
            this.pips[from].owner = this.otherPlayer();
        }

        if (this.pips[from].size === 0) {
            this.pips[from].owner = "neither";
        }

        // To pip
        if (to === OFF[this.player]) {
            // Bearing off
            this.off[this.player]++;
        } else {
            // Pinning opponent
            if (this.pips[to].owner === this.otherPlayer()) {
                this.pips[to].isPinned = true;
            }

            this.pips[to].size++;
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

        this.moves.push(new Move(from, to, die));

        return true;
    }

    getDestination(start: number, die: number): number {
        const direction = this.player == "black" ? -1 : 1;
        return clamp(direction * die + start);
    }

    clone(): Plakoto {
        return new Plakoto(this);
    }
}
