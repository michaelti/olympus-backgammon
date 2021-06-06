const { Move, Pip, Player, TurnMessage, clamp, random, pipDistance } = require("./util");
const clone = require("ramda.clone");

exports.Board = () => ({
    turn: null,
    winner: null,
    off: { [Player.white]: 0, [Player.black]: 0 },
    pips: new Array(26).fill().map(() => Pip()),
    diceRolled: new Array(2),
    dice: new Array(2),
    recentMove: {},
    possibleTurns: null,
    maxTurnLength: 0,
    turnValidity: TurnMessage.invalid,
    firstPip: 1,
    lastPip: 24,
    // Property used by bot
    uniqueTurns: null,

    publicProperties() {
        return {
            turn: this.turn,
            winner: this.winner,
            off: this.off,
            pips: this.pips,
            diceRolled: this.diceRolled,
            dice: this.dice,
            recentMove: this.recentMove,
            turnValidity: this.turnValidity,
            // Fevga properties
            state: this.state,
        };
    },

    rollDice() {
        // Roll a 6-sided die, 2 times
        this.diceRolled = random.dice(6, 2);

        // Doubles
        if (this.diceRolled[0] === this.diceRolled[1])
            this.diceRolled = this.diceRolled.concat(this.diceRolled);

        // Sort smallest to largest
        this.dice = [...this.diceRolled].sort((a, b) => a - b);

        // Set to null first to ensure garbage collection
        this.possibleTurns = null;
        this.possibleTurns = this.allPossibleTurns();

        this.maxTurnLength = 0;
        for (const turn of this.possibleTurns) {
            if (turn.length > this.maxTurnLength) this.maxTurnLength = turn.length;
        }
        this.turnValidity = this.maxTurnLength === 0 ? TurnMessage.validZero : TurnMessage.invalid;
    },

    // Returns the player who's turn it ISN'T
    otherPlayer(player = this.turn) {
        if (player === Player.black) return Player.white;
        if (player === Player.white) return Player.black;
        return Player.neither;
    },

    // Is the board in a state where either player has won?
    // Returns the number of points won
    isGameOver() {
        if (this.off[this.turn] === 15) {
            this.winner = this.turn;
            this.turn = Player.neither;
            // if the other player has born off 0 checkers, return 2 points
            return this.off[this.otherPlayer(this.winner)] === 0 ? 2 : 1;
        }
        return 0;
    },

    // Validates a turn of 0–4 moves
    turnValidator(moves) {
        // Validate turn length. Players must make as many moves as possible
        if (this.maxTurnLength !== moves.length) {
            // unless they have 14 checkers off and are bearing off their 15th (final)
            if (!(this.off[this.turn] === 14 && (moves[0].to === 0 || moves[0].to === 25)))
                return TurnMessage.invalidMoreMoves;
        }
        // Validate single move turn uses the largest dice value possible
        if (this.maxTurnLength === 1 && this.dice.length === 2) {
            // if the supplied move matches the smaller dice
            // then check if there's a possible move with the larger dice
            if (pipDistance(moves[0].from, moves[0].to) === this.dice[0]) {
                for (const turn of this.possibleTurns) {
                    if (pipDistance(turn[0].from, turn[0].to) === this.dice[1])
                        return TurnMessage.invalidLongerMove;
                }
            }
        }
        return TurnMessage.valid;
    },

    // Calculates destination pip of a move
    getDestination(start, die) {
        return clamp(this.turn * die + start);
    },

    // Returns a 2D array of Move objects
    allPossibleTurns(isBot) {
        if (this.dice.length === 0) return [];
        let allTurns = [];
        const uniqueDice = this.dice[0] === this.dice[1] ? [this.dice[0]] : this.dice;
        for (const die of uniqueDice) {
            for (let pipStart = this.firstPip; pipStart <= this.lastPip; pipStart++) {
                if (this.pips[pipStart].top === this.turn) {
                    const pipEnd = this.getDestination(pipStart, die);
                    const currentMove = Move(pipStart, pipEnd);
                    if (this.isMoveValid(currentMove.from, currentMove.to)) {
                        // deep copy game board using ramda
                        let newBoard = clone(this);
                        newBoard.doMove(currentMove.from, currentMove.to);
                        const nextTurns = newBoard.allPossibleTurns();
                        if (nextTurns.length) {
                            for (const nextMoves of nextTurns) {
                                const turn = [currentMove, ...nextMoves];
                                allTurns.push(turn);
                                if (isBot && turn.length === 4) {
                                    const destinations = turn.map((move) => move.to);
                                    const string = destinations.sort().join("");
                                    this.uniqueTurns.set(string, turn);
                                }
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
});
