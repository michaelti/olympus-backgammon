import { Game } from "./Game.js";
import { clamp, pipDistance, range } from "./util.js";
import { GameData, Player, PlayerBW } from "./types.js";

export class Portes extends Game {
    constructor(initial: GameData | { player: PlayerBW }) {
        super(initial);
        if ("pips" in initial) return;

        // Black moves towards pip 1 (decreasing)
        // White moves towards pip 24 (increasing)
        this.pips[25].set(0, Player.black);
        this.pips[24].set(2, Player.black);
        this.pips[19].set(5, Player.white);
        this.pips[17].set(3, Player.white);
        this.pips[13].set(5, Player.black);
        this.pips[12].set(5, Player.white);
        this.pips[8].set(3, Player.black);
        this.pips[6].set(5, Player.black);
        this.pips[1].set(2, Player.white);
        this.pips[0].set(0, Player.white);
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

    doMove(from: number, to: number) {
        TODO_DELETE_THIS_isTurnPlayer(this.turn);

        to = clamp(to);
        const bar = this.turn === Player.white ? 0 : 25;
        const otherBar = this.turn === Player.white ? 25 : 0;
        this.recentMove = { from, to };

        // From pip
        if (this.pips[bar].size > 0) {
            // Don't change owner of the bar ever
        } else if (this.pips[from].size === 1) {
            this.pips[from].top = Player.neither;
            this.pips[from].bot = Player.neither;
        } else if (this.pips[from].size === 2 && this.pips[from].top !== this.pips[from].bot) {
            this.pips[from].top = this.pips[from].bot;
        }
        this.pips[from].size--;

        // To pip
        if (to === 0 || to === 25) {
            // Bearing off
            if (this.turn === Player.white) this.off[Player.white]++;
            if (this.turn === Player.black) this.off[Player.black]++;
        } else {
            // Sending opponent to the bar
            if (this.pips[to].bot === this.otherPlayer()) {
                this.pips[otherBar].size++;
                if (this.turn === Player.white) this.recentMove.subMove = { from: to, to: 25 };
                if (this.turn === Player.black) this.recentMove.subMove = { from: to, to: 0 };
            } else {
                this.pips[to].size++;
            }
            this.pips[to].top = this.turn;
            this.pips[to].bot = this.turn;
        }

        // Handle dice. NOTE: this will only work for 2 distinct values or 4 identical values
        if (this.dice[0] >= pipDistance(from, to)) this.dice.shift();
        else this.dice.pop();
    }
}
