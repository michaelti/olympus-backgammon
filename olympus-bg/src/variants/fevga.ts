import { Board as GenericBoard } from "../game.js";
import { range, Pip, Player, clamp, pipDistance, TODO_DELETE_THIS_isTurnPlayer } from "../util.js";
enum State {
    start = 1,
    firstAway = 2,
    default = 3,
}

const Fevga = () => ({
    // Inherit from generic board
    ...GenericBoard(),

    // Implement Fevga-specific methods and variables
    state: { [Player.white]: State.start, [Player.black]: State.start },

    // Initialize the board for a game of fevga
    initGame() {
        this.pips[24] = Pip(15, Player.black); // Black moves towards pip 1 (decreasing)
        this.pips[12] = Pip(15, Player.white); // White moves towards pip 13 (decreasing)
    },

    // Is the move valid?
    // from:    Move from pip # <eg. 1>
    // to:      Move to pip # <eg. 4>
    // return:  Returns a boolean
    isMoveValid(from: number, to: number): boolean {
        TODO_DELETE_THIS_isTurnPlayer(this.turn);

        to = clamp(to);
        if (this.pips[from].top !== this.turn) return false;

        // You can't move from your big pile until you move past the other player's big pile
        if (this.state[this.turn] === State.firstAway) {
            if (from === 12 || from === 24) return false;
        }

        // Bearing off
        if (to === 25 || to === 0) {
            if (to === 25) to = 12;

            if (this.turn === Player.white && (from > 18 || from < 13)) return false;
            if (this.turn === Player.black && from > 6) return false;
            // Range of all pips excluding the current player's home quadrant
            const nonHomePips = this.turn === Player.white ? range(18, 35) : range(6, 23); // 1–12, 19–24 : 7–24
            for (const i of nonHomePips) {
                if (this.pips[(i % 24) + 1].top === this.turn) return false;
            }
            // If bearing off from an non-exact number of pips
            if (!this.dice.includes(pipDistance(from, to))) {
                // Check if there's a big enough dice
                if (this.dice[0] > pipDistance(from, to) || this.dice[1] > pipDistance(from, to)) {
                    // Range of pips in the player's home quadrant that are further away than the pip they are trying to bear off of
                    const farHomePips =
                        this.turn === Player.white ? range(from + 1, 18) : range(from + 1, 6);
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
            if (this.pips[to].top !== this.turn && this.pips[to].size > 0) return false;
            if (this.turn === Player.white && from >= 13 && to <= 12) return false;
            if (this.turn === Player.black && from <= 12 && to >= 13) return false;

            // Don't allow player to block all home pips
            const homePips = this.turn === Player.white ? range(7, 12) : range(19, 24);
            const pipBackup = this.pips[to].top;
            this.pips[to].top = this.turn; // See what would happen IF the player were to move there
            let owned = 0;
            for (const i of homePips) if (this.pips[i].top === this.turn) owned++;
            this.pips[to].top = pipBackup; // Restore original board state
            if (owned >= 6 && this.pips[from].size > 1) return false;

            // Make sure one of your dice is the number of spaces you want to move
            if (!this.dice.includes(pipDistance(from, to))) return false;
        }

        return true;
    },

    doMove(from: number, to: number) {
        TODO_DELETE_THIS_isTurnPlayer(this.turn);

        to = clamp(to);
        this.recentMove = { from, to };

        // From pip
        if (this.pips[from].size === 1) {
            this.pips[from].top = Player.neither;
            this.pips[from].bot = Player.neither;
        }
        this.pips[from].size--;

        // To pip
        if (to === 0 || to === 25) {
            // Bearing off
            this.off[this.turn]++;
            if (to === 25) to = 12;
        } else {
            if (this.pips[to].size === 0) {
                this.pips[to].top = this.turn;
                this.pips[to].bot = this.turn;
            }
            this.pips[to].size++;
        }

        // Handle dice. NOTE: this will only work for 2 distinct values or 4 identical values
        if (this.dice[0] >= pipDistance(from, to)) this.dice.shift();
        else this.dice.pop();

        // Handle game state
        if (this.state[this.turn] === State.start) this.state[this.turn]++;
        else if (this.state[this.turn] === State.firstAway) {
            if (
                (this.turn === Player.white && to > 12) ||
                (this.turn === Player.black && to < 13)
            ) {
                this.state[this.turn]++;
            }
        }
    },

    // Calculates destination pip of a move
    getDestination(start: number, die: number): number {
        let end = start - die;
        if (this.turn === Player.white) {
            if (start >= 13 && end <= 12) end = 25;
            if (end < 1) end += 24;
        }
        return clamp(end);
    },
});

export const Board = Fevga;
