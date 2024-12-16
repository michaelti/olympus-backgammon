import { Game } from "./Game.js";
import { clamp, pipDistance, range } from "./util.js";
import { Player, PlayerBW } from "./types.js";
import { Pip } from "./Pip.js";

export class Portes extends Game {
    // firstPip = 0;
    // lastPip = 25;
    constructor(startPlayer: PlayerBW) {
        super(startPlayer);

        // What's better? Creating a new object, or changing one?
        // this.pips[25].set(0, Player.black);
        this.pips[25] = new Pip(0, Player.black);
        this.pips[24] = new Pip(2, Player.black); // Black moves towards pip 1 (decreasing)
        this.pips[19] = new Pip(5, Player.white);
        this.pips[17] = new Pip(3, Player.white);
        this.pips[13] = new Pip(5, Player.black);
        this.pips[12] = new Pip(5, Player.white);
        this.pips[8] = new Pip(3, Player.black);
        this.pips[6] = new Pip(5, Player.black);
        this.pips[1] = new Pip(2, Player.white); // White moves towards pip 24 (increasing)
        this.pips[0] = new Pip(0, Player.white);
    }

    isMoveValid(from: number, to: number): boolean {
        to = clamp(to);
        const barId = this.player === Player.white ? 0 : 25;
        if (this.pips[from].owner !== this.player) return false;

        // Entering the board
        if (this.pips[barId].size > 0) {
            if (from !== 25 && from !== 0) return false;
            if (this.pips[to].owner !== this.player && this.pips[to].size > 1) return false;
            if (!this.dice.includes(pipDistance(from, to))) return false;
        }
        // Bearing off
        else if (to === 25 || to === 0) {
            if (this.player === Player.white && from < 19) return false;
            if (this.player === Player.black && from > 6) return false;
            // Range of all pips excluding the current player's home quadrant
            const nonHomePips = this.player === Player.white ? range(1, 18) : range(7, 24);
            for (const i of nonHomePips) {
                if (this.pips[i].owner === this.player || this.pips[i].isPinned) return false;
            }
            // If bearing off from an non-exact number of pips
            if (!this.dice.includes(pipDistance(from, to))) {
                // Check if there's a big enough dice
                if (this.dice.getLargest() > pipDistance(from, to)) {
                    // Range of pips in the player's home quadrant that are further away than the pip they are trying to bear off of
                    const farHomePips =
                        this.player === Player.white ? range(19, from - 1) : range(from + 1, 6);
                    for (const i of farHomePips) {
                        if (this.pips[i].owner === this.player || this.pips[i].isPinned)
                            return false;
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
        throw new Error("Method not implemented.");
    }
}
