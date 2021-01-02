const { Board, Pip, Move, Player, TurnMessage, clamp } = require("./gameUtil");
const clone = require("ramda.clone");
const { range } = require("./util");
const State = Object.freeze({ start: 1, firstAway: 2, default: 3 });

const Fevga = () => ({
    // Inherit from generic board
    ...Board(),

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
    isMoveValid(from, to) {
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
            for (let i of nonHomePips) {
                if (this.pips[(i % 24) + 1].top === this.turn) return false;
            }
            // If bearing off from an non-exact number of pips
            if (!this.dice.includes(Math.abs(from - to))) {
                // Check if there's a big enough dice
                if (this.dice[0] > Math.abs(from - to) || this.dice[1] > Math.abs(from - to)) {
                    // Range of pips in the player's home quadrant that are further away than the pip they are trying to bear off of
                    const farHomePips =
                        this.turn === Player.white ? range(from + 1, 18) : range(from + 1, 6);
                    for (let i of farHomePips) {
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

            // Both players move in the same direction (decreasing). The exception is when we wrap
            // around the edge of the board, we jump by 24 (i.e. 3, 2, 1, 24, 23, 22)
            if (to > from) to -= 24;
            if (!this.dice.includes(from - to)) return false;
        }

        return true;
    },

    doMove(from, to) {
        to = clamp(to);
        this.recentMove = Move(from, to);

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
        const fevgaTo = to > from ? to - 24 : to; // For wrapping around the right edge
        if (this.dice[0] >= from - fevgaTo) this.dice.shift();
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

    // Returns 2D array
    allPossibleTurns() {
        if (this.dice.length === 0) return [];
        let ret = new Array();
        let uniqueDice = this.dice[0] === this.dice[1] ? [this.dice[0]] : this.dice;
        for (const die of uniqueDice) {
            for (let pipIndex = 1; pipIndex <= 24; pipIndex++) {
                if (this.pips[pipIndex].top === this.turn) {
                    let temp = pipIndex - die;
                    if (this.turn === Player.white) {
                        if (pipIndex >= 13 && temp <= 12) temp = 25;
                        if (temp < 1) temp += 24;
                    }
                    let currentMove = Move(pipIndex, clamp(temp));
                    if (this.isMoveValid(currentMove.from, currentMove.to)) {
                        // deep copy game board using ramda
                        let newBoard = clone(this);
                        newBoard.doMove(currentMove.from, currentMove.to);
                        let nextTurns = newBoard.allPossibleTurns();
                        if (nextTurns.length) {
                            for (const nextMoves of nextTurns) {
                                ret.push([currentMove, ...nextMoves]);
                                if ([currentMove, ...nextMoves].length === 4)
                                    throw "Possible turn of length 4 detected";
                            }
                        } else {
                            ret.push([currentMove]);
                        }
                    }
                }
            }
        }
        return ret;
    },

    // Validates a turn of 0–4 moves
    turnValidator(moves) {
        // Validate turn length. Players must make as many moves as possible
        if (this.maxTurnLength !== moves.length) {
            // unless they have 14 checkers off and are bearing off their 15th (final)
            if (!(this.off[this.turn] == 14 && (moves[0].to === 0 || moves[0].to === 25)))
                return TurnMessage.invalidMoreMoves;
        }
        // Validate single move turn uses the largest dice value possible
        if (this.maxTurnLength === 1 && this.dice.length === 2) {
            const moveDistance = (m) => m.from - m.to;
            // if the supplied move matches the smaller dice
            // then check if there's a possible move with the larger dice
            if (moveDistance(moves[0]) === this.dice[0]) {
                for (let turn of this.possibleTurns) {
                    if (moveDistance(turn[0]) === this.dice[1])
                        return TurnMessage.invalidLongerMove;
                }
            }
        }
        return TurnMessage.valid;
    },
});

exports.Board = Fevga;
