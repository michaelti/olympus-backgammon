const { Board, Pip, Move, Player, clamp, pipDistance } = require("./gameUtil");
const clone = require("ramda.clone");
const { range } = require("./util");

const Plakoto = () => ({
    // Inherit from generic board
    ...Board(),

    // Implement Plakoto-specific methods and variables
    // Initialize the board for a game of plakoto
    initGame() {
        this.pips[24] = Pip(15, Player.black); // Black moves towards pip 1 (decreasing)
        this.pips[1] = Pip(15, Player.white); // White moves towards pip 24 (increasing)
    },

    // Is the move valid?
    // from:    Move from pip # <eg. 1>
    // to:      Move to pip # <eg. 4>
    // return:  Returns a boolean
    isMoveValid(from, to) {
        to = clamp(to);
        if (this.pips[from].top !== this.turn) return false;

        // Bearing off
        if (to === 25 || to === 0) {
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

    doMove(from, to) {
        to = clamp(to);
        this.recentMove = Move(from, to);

        // From pip
        if (this.pips[from].size === 1) {
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
            if (this.pips[to].size === 0) {
                this.pips[to].bot = this.turn;
            }
            this.pips[to].top = this.turn;
            this.pips[to].size++;
        }

        // Handle dice. NOTE: this will only work for 2 distinct values or 4 identical values
        if (this.dice[0] >= pipDistance(from, to)) this.dice.shift();
        else this.dice.pop();
    },

    // Returns 2D array of Move objects
    allPossibleTurns() {
        if (this.dice.length === 0) return [];
        let allTurns = new Array();
        const uniqueDice = this.dice[0] === this.dice[1] ? [this.dice[0]] : this.dice;
        for (const die of uniqueDice) {
            for (let pipIndex = 1; pipIndex <= 24; pipIndex++) {
                if (this.pips[pipIndex].top === this.turn) {
                    const currentMove = Move(pipIndex, clamp(this.turn * die + Number(pipIndex)));
                    if (this.isMoveValid(currentMove.from, currentMove.to)) {
                        // deep copy game board using ramda
                        let newBoard = clone(this);
                        newBoard.doMove(currentMove.from, currentMove.to);
                        const nextTurns = newBoard.allPossibleTurns();
                        if (nextTurns.length) {
                            for (const nextMoves of nextTurns) {
                                allTurns.push([currentMove, ...nextMoves]);
                                if ([currentMove, ...nextMoves].length === 4)
                                    throw "Possible turn of length 4 detected";
                            }
                        } else {
                            allTurns.push([currentMove]);
                        }
                    }
                }
            }
        }
        return allTurns;
    },

    // Is the board in a state where the game has just ended?
    // Returns the number of points won
    isGameOver() {
        const home = { [Player.white]: this.pips[1], [Player.black]: this.pips[24] };

        // Both player's starting checkers have been trapped: game is a draw
        if (this.pips[1].top !== this.pips[1].bot && this.pips[24].top !== this.pips[24].bot) {
            this.winner = Player.neither;
            this.turn = Player.neither;
            return 1;
        }
        // Player has beared off all of their checkers
        else if (this.off[this.turn] === 15) {
            this.winner = this.turn;
            this.turn = Player.neither;
            // if the other player has born off 0 checkers, return 2 points
            return this.off[this.otherPlayer(this.winner)] === 0 ? 2 : 1;
        }
        // If other player's starting checker has been pinned and current player's is safe
        else if (
            home[this.otherPlayer()].top !== home[this.otherPlayer()].bot &&
            home[this.turn].bot !== this.turn
        ) {
            this.winner = this.turn;
            this.turn = Player.neither;
            return 2;
        }

        return 0;
    },
});

exports.Board = Plakoto;
