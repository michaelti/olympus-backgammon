import { Game } from "./Game.js";
import { clamp, pipDistance, range, OFF } from "./util.js";
import { InitialGameData, OnGameOver, PlayerBW, TurnValidity } from "./types.js";
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

    distanceFromOff(x: number): number {
        if (this.player === "black") {
            return x;
        }
        if (x >= OFF.white) return 0; // OFF.white is 0 spaces from off
        if (x >= 13)
            return x - 12; // Pips 13-24 correspond to 1-12 spaces
        else return x + 12; // Pips 12-1 correspond to 24-13 spaces away
    }

    isMoveValid(fromId: number, toId: number): boolean {
        let to = this.distanceFromOff(toId);
        let from = this.distanceFromOff(fromId);
        toId = clamp(toId);
        if (this.pips[fromId].owner !== this.player) return false;

        // Prevent backwards movements: ending pip must be closer to "off"
        if (to >= from) return false;

        // You can't move a second checker from the start until you move your first
        // checker past the other player's start.
        if (this.isFirstAway()) {
            if (from === 24) return false;
        }

        // Bearing off
        if (to === 0) {
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
                        this.player === "white" ? range(fromId + 1, 18) : range(fromId + 1, 6);
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
            if (this.pips[toId].owner === this.otherPlayer()) return false;
            if (!this.dice.includes(pipDistance(from, to))) return false;

            // TODO: Don't allow player to block all starting quadrant pips.
            // Evaluate this at the end of the turn?
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

    // 2025-07-09 Michael
    // Idea 1: override getTurnValidity
    getTurnValidity(): TurnValidity {
        const validity = super.getTurnValidity();

        if (!validity.valid) {
            return validity;
        }

        // Don't allow player to block all home pips
        const homePips = this.player === "white" ? range(7, 12) : range(19, 24);
        const allHomeBlocked = homePips.every((i) => this.pips[i].owner === this.player);
        if (allHomeBlocked) {
            return { valid: false, reason: "StartPrime" };
        }

        // TODO: don't allow player to keep a prime if opponent has stacked all checkers right before
        // (probably not worth implementing; we didn't before)
        const opponentStackPip = this.pips.findIndex(
            (pip) => pip.owner === this.otherPlayer() && pip.size === 15,
        );

        if (opponentStackPip !== -1) {
            // Check the next 6 pips after opponentStackPip
            // If we own them all, turn is invalid
        }

        // TODO: what if validity was 'true, NoPossibleMoves', but we hit the conditions above?
        return validity;
    }

    // Idea 2: add `hooks` to getTurnValidity, endTurn, etc to allow variants to add logic
    // this would be invoked inside getTurnValidity in Game.ts before the final return
    turnRules(): TurnValidity {
        // ...
    }
}
