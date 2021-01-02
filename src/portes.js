const { Board, Pip, Move, Player, TurnMessage, clamp } = require("./gameUtil");
const clone = require("ramda.clone");
const { range } = require("./util");

const Portes = () => ({
    // Inherit from generic board
    ...Board(),

    // Implement Portes-specific methods and variables
    bar: new Object(),

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

        // Aliases so we can access the bar using a Player as the key
        this.bar[Player.black] = this.pips[25];
        this.bar[Player.white] = this.pips[0];
    },

    // Is the move valid?
    // from:    Move from pip # <eg. 1>
    // to:      Move to pip # <eg. 4>
    // return:  Returns a boolean
    isMoveValid(from, to) {
        to = clamp(to);
        if (this.pips[from].top !== this.turn) return false;

        // Entering the board
        if (this.bar[this.turn].size > 0) {
            if (from !== 25 && from !== 0) return false;
            if (this.pips[to].top !== this.turn && this.pips[to].size > 1) return false;
            if (!this.dice.includes(this.turn * (to - from))) return false;
        }
        // Bearing off
        else if (to === 25 || to === 0) {
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
            if (this.pips[to].top !== this.turn && this.pips[to].size > 1) return false;
            if (!this.dice.includes(this.turn * (to - from))) return false;
        }

        return true;
    },

    doMove(from, to) {
        to = clamp(to);
        this.recentMove = Move(from, to);

        // From pip
        if (this.bar[this.turn].size > 0) {
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
                this.bar[this.otherPlayer()].size++;
                if (this.turn === Player.white) this.recentMove.subMove = Move(to, 25);
                if (this.turn === Player.black) this.recentMove.subMove = Move(to, 0);
            } else {
                this.pips[to].size++;
            }
            this.pips[to].top = this.turn;
            this.pips[to].bot = this.turn;
        }

        // Handle dice. NOTE: this will only work for 2 distinct values or 4 identical values
        if (this.dice[0] >= Math.abs(from - to)) this.dice.shift();
        else this.dice.pop();
    },

    // Returns 2D array
    allPossibleTurns() {
        if (this.dice.length === 0) return [];
        let ret = new Array();
        let uniqueDice = this.dice[0] === this.dice[1] ? [this.dice[0]] : this.dice;
        for (const die of uniqueDice) {
            for (let pipIndex = 0; pipIndex <= 25; pipIndex++) {
                if (this.pips[pipIndex].top === this.turn) {
                    let currentMove = Move(pipIndex, clamp(this.turn * die + pipIndex));
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
            const moveDistance = (m) => Math.abs(m.from - m.to);
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

exports.Board = Portes;
