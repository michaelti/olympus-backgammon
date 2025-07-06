import { Game } from "./Game.js";
import { clamp, pipDistance, range, OFF } from "./util.js";
import { InitialGameData, OnGameOver, PlayerBW } from "./types.js";
import { Move } from "./Move.js";

type State = "Start" | "FirstAway" | "Default";
const START = { black: 24, white: 12 };

export class Fevga extends Game {
    state: { white: State; black: State };

    constructor(initial: InitialGameData, onGameOver?: OnGameOver) {
        super(initial, onGameOver);
        this.state = {
            white: "Start",
            black: "Start",
        };

        if ("pips" in initial) return;

        // Black moves towards pip 1 (off: 0)
        // White moves towards pip 13 (off: 25)
        this.pips[START.black].set(15, "black");
        this.pips[START.white].set(15, "white");
    }

    isFirstAway(): boolean {
        if (this.pips[START[this.player]].size === 15) return false;
        let farSidePips;
        if (this.player === "white") {
            farSidePips = range(13, 24);
        } else {
            farSidePips = range(1, 12);
        }
        for (const i in farSidePips) {
            if (this.pips[i].owner === this.player) return false;
        }
        return true;
    }

    isMoveValid(from: number, to: number): boolean {
        to = clamp(to);
        if (this.pips[from].owner !== this.player) return false;

        // Prevent backwards movements
        if (this.player === "black" && to >= from) return false;
        // TODO: prevent backwards movement for white

        // You can't move a second checker from the start until you move your first
        // checker past the other player's start.
        if (this.isFirstAway()) {
            if (from === START[this.player]) return false;
        }

        // Bearing off
        if (to === OFF[this.player]) {
            if (to === OFF.white) to = 12; // BAD. TODO: make good

            const nonHomePips =
                this.player === "white" ? [...range(1, 12), ...range(19, 24)] : range(7, 24);
            for (const i of nonHomePips) {
                if (this.pips[i].owner === this.player) return false;
            }

            // If bearing off from an non-exact number of pips
            if (!this.dice.includes(pipDistance(from, to))) {
                // Check if there's a big enough dice
                if (Math.max(...this.dice) > pipDistance(from, to)) {
                    // Range of pips in the player's home quadrant that are further away than the pip from which they are trying to bear off
                    const furtherHomePips =
                        this.player === "white" ? range(from + 1, 18) : range(from + 1, 6);
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
            if (this.pips[to].owner === this.otherPlayer()) return false;
            if (!this.dice.includes(pipDistance(from, to))) return false;
            // Prevent players from moving past their OFF
            if (this.player === "white" && from >= 13 && to <= 12) return false;
        }

        return true;
    }

    doMove(from: number, to: number): boolean {
        // TODO: Implement doMove
        return true;
    }

    getDestination(start: number, die: number): number {
        let destination = start - die;
        if (this.player === "white") {
            // White is bearing off
            if (start >= 13 && destination <= 12) destination = OFF.white;
            // White wraps around the board from 1 to 24
            if (destination < 1) destination += 24;
        }
        return clamp(destination);
    }

    clone(): Fevga {
        return new Fevga(this);
    }
}
