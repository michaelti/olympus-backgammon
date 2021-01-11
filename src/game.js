const { Random, MersenneTwister19937 } = require("random-js");
const random = new Random(MersenneTwister19937.autoSeed());

// Enum-like object
const Player = Object.freeze({
    neither: 0,
    white: 1,
    black: -1,
});

const TurnMessage = Object.freeze({
    valid: 1,
    validZero: 2,
    invalid: 0,
    invalidMoreMoves: -1,
    invalidLongerMove: -2,
});

// Variant of backgammon
exports.Variant = Object.freeze({
    portes: 1,
    plakoto: 2,
    fevga: 3,
});

// Clamps "to" in range 0–25
exports.clamp = (to) => (to < 0 ? 0 : to > 25 ? 25 : to);

// Returns the distance between two pips (1–6)
const pipDistance = function (from, to) {
    const dist = Math.abs(to - from);
    return dist <= 6 ? dist : 24 - dist;
};
exports.Move = (from, to) => ({ from, to });
exports.reverseMove = (move) => ({ from: move.to, to: move.from });

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
            // Portes properties
            bar: this.bar,
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

        this.maxTurnLength = 0;
        this.turnValidity = TurnMessage.invalid;
        try {
            this.possibleTurns = this.allPossibleTurns();
            for (const turn of this.possibleTurns) {
                if (turn.length > this.maxTurnLength) this.maxTurnLength = turn.length;
            }
            if (this.maxTurnLength === 0) this.turnValidity = TurnMessage.validZero;
        } catch (four) {
            // Code optimization when there's a possible 4-move turn
            this.maxTurnLength = 4;
        }
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
            if (!(this.off[this.turn] == 14 && (moves[0].to === 0 || moves[0].to === 25)))
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

    // Dummy function, must be implemented by each backgammon variant
    allPossibleTurns: () => null,
});

const Pip = (size = 0, owner = Player.neither) => ({
    size: size,
    top: owner,
    bot: owner,
});

const rollDie = () => random.die(6);

exports.Player = Player;
exports.TurnMessage = TurnMessage;
exports.pipDistance = pipDistance;
exports.Pip = Pip;
exports.rollDie = rollDie;
