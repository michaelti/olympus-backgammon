const clone = require("ramda.clone");
const Player = require("./gameUtil").Player;

const Pip = (size = 0, owner = Player.neither) => ({
    size: size,
    top: owner,
    bot: owner,
});

const Submove = (from, to) => ({ from, to });

const range = (start, end, length = end - start + 1) => Array.from({ length }, (_, i) => start + i);

const Board = () => ({
    turn: Player.neither,
    offWhite: 0,
    barWhite: 0,
    offBlack: 0,
    barBlack: 0,
    pips: new Array(25),
    dice: new Array(2),

    // Initialize the board for a game of plakoto
    initPlakoto() {
        this.turn = Player.white; // Later, players will roll to see who goes first
        this.rollDice();
        for (let i = 0; i <= 24; i++) {
            this.pips[i] = Pip();
        }
        this.pips[24] = Pip(15, Player.black); // Black moves towards pip 1 (decreasing)
        this.pips[1] = Pip(15, Player.white); // White moves towards pip 24 (increasing)
    },

    rollDice() {
        this.dice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
        // Sort smallest to largest
        if (this.dice[0] > this.dice[1]) this.dice.reverse();
        // Doubles
        if (this.dice[0] === this.dice[1]) this.dice = this.dice.concat(this.dice);
    },

    // Is the move valid?
    // from:    Move from pip # <eg. 1>
    // to:      Move to pip # <eg. 4>
    // return:  Returns a boolean
    isValid(from, to) {
        // Clamps "to" in range 0–25
        to = to < 0 ? 0 : to > 25 ? 25 : to;
        if (this.pips[from].top !== this.turn) return false;

        // Bearing off
        if (to === 25 || to === 0) {
            if (this.turn === Player.white && from < 19) return false;
            if (this.turn === Player.black && from > 6) return false;
            // Range of all pips excluding the current player's home quadrant
            const nonHomePips = this.turn === Player.white ? range(1, 18) : range(7, 24);
            for (let i of nonHomePips) {
                if (this.pips[i].top === this.turn || this.pips[i].bot === this.turn) return false;
            }
            // If bearing off from an non-exact number of pips
            if (!this.dice.includes(Math.abs(from - to))) {
                // Check if there's a big enough dice
                if (this.dice[0] > Math.abs(from - to) || this.dice[1] > Math.abs(from - to)) {
                    // Range of pips in the player's home quadrant that are further away than the pip they are trying to bear off of
                    const farHomePips =
                        this.turn === Player.white ? range(19, from - 1) : range(from + 1, 6);
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
            if (this.pips[to].top === this.otherPlayer() && this.pips[to].size > 1) return false;
            if (!this.dice.includes(this.turn * (to - from))) return false;
        }

        return true;
    },

    doSubmove(from, to) {
        // Clamps "to" in range 0–25
        to = to < 0 ? 0 : to > 25 ? 25 : to;

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
            if (this.turn === Player.white) this.offWhite++;
            if (this.turn === Player.black) this.offBlack++;
        } else {
            if (this.pips[to].size === 0) {
                this.pips[to].bot = this.turn;
            }
            this.pips[to].top = this.turn;
            this.pips[to].size++;
        }

        // Handle dice. NOTE: this will only work for 2 distinct values or 4 identical values
        if (this.dice[0] >= Math.abs(from - to)) {
            this.dice.shift();
        } else {
            this.dice.pop();
        }
    },

    // Returns the player who's turn it ISN'T
    otherPlayer() {
        if (this.turn === Player.black) return Player.white;
        if (this.turn === Player.white) return Player.black;
        return Player.neither;
    },

    // Returns 2D array
    allPossibleMoves() {
        if (this.dice.length === 0) return [];
        let ret = new Array();
        let uniqueDice = this.dice[0] === this.dice[1] ? [this.dice[0]] : this.dice;
        for (const die of uniqueDice) {
            for (let pipIndex = 1; pipIndex <= 24; pipIndex++) {
                if (this.pips[pipIndex].top === this.turn) {
                    let currentMove = Submove(pipIndex, this.turn * die + Number(pipIndex));
                    if (this.isValid(currentMove.from, currentMove.to)) {
                        // deep copy game board using ramda
                        let newBoard = clone(this);
                        newBoard.doSubmove(currentMove.from, currentMove.to);
                        let nextMoves = newBoard.allPossibleMoves();
                        if (nextMoves.length) {
                            for (const nextMove of nextMoves) {
                                ret.push([currentMove, ...nextMove]);
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

    // Returns true if the move was successful
    trySubmove(from, to) {
        if (this.isValid(from, to)) {
            this.doSubmove(from, to);
            return true;
        }
        return false;
    },

    isTurnValid() {
        return true;
    },
});

exports.Board = Board;
exports.Submove = Submove;
