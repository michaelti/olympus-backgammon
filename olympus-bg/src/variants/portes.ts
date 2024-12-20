import { Board as GenericBoard } from "../game.js";
import { range, Pip, Player, clamp, pipDistance, TODO_DELETE_THIS_isTurnPlayer } from "../util.js";

const Portes = () => ({
    // Inherit from generic board
    ...GenericBoard(),

    // Portes-specific properties
    firstPip: 0,
    lastPip: 25,

    // Initialize the board for a game of portes
    initGame() {
        this.pips[25] = Pip(0, Player.black);
        this.pips[24] = Pip(2, Player.black); // Black moves towards pip 1 (decreasing)
        this.pips[19] = Pip(5, Player.white);
        this.pips[17] = Pip(3, Player.white);
        this.pips[13] = Pip(5, Player.black);
        this.pips[12] = Pip(5, Player.white);
        this.pips[8] = Pip(3, Player.black);
        this.pips[6] = Pip(5, Player.black);
        this.pips[1] = Pip(2, Player.white); // White moves towards pip 24 (increasing)
        this.pips[0] = Pip(0, Player.white);
    },

    // Is the move valid?
    // from:    Move from pip # <eg. 1>
    // to:      Move to pip # <eg. 4>
    // return:  Returns a boolean
    isMoveValid(from: number, to: number): boolean {
        to = clamp(to);
        const bar = this.turn === Player.white ? 0 : 25;
        if (this.pips[from].top !== this.turn) return false;

        // Entering the board
        if (this.pips[bar].size > 0) {
            if (from !== 25 && from !== 0) return false;
            if (this.pips[to].top !== this.turn && this.pips[to].size > 1) return false;
            if (!this.dice.includes(pipDistance(from, to))) return false;
        }
        // Bearing off
        else if (to === 25 || to === 0) {
            if (this.turn === Player.white && from < 19) return false;
            if (this.turn === Player.black && from > 6) return false;
            // Range of all pips excluding the current player's home quadrant
            const nonHomePips = this.turn === Player.white ? range(1, 18) : range(7, 24);
            for (const i of nonHomePips) {
                if (this.pips[i].top === this.turn || this.pips[i].bot === this.turn) return false;
            }
            // If bearing off from an non-exact number of pips
            if (!this.dice.includes(pipDistance(from, to))) {
                // Check if there's a big enough dice
                if (this.dice[0] > pipDistance(from, to) || this.dice[1] > pipDistance(from, to)) {
                    // Range of pips in the player's home quadrant that are further away than the pip they are trying to bear off of
                    const farHomePips =
                        this.turn === Player.white ? range(19, from - 1) : range(from + 1, 6);
                    for (const i of farHomePips) {
                        if (this.pips[i].top === this.turn || this.pips[i].bot === this.turn)
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
            if (this.pips[to].top !== this.turn && this.pips[to].size > 1) return false;
            if (!this.dice.includes(pipDistance(from, to))) return false;
        }

        return true;
    },

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
    },
});

export const Board = Portes;
