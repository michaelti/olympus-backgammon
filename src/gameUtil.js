// Enum-like object
const Player = Object.freeze({
    neither: 0,
    white: 1,
    black: -1,
});

// Variant of backgammon
exports.Variant = Object.freeze({
    portes: 1,
    plakoto: 2,
    fevga: 3,
});

// Clamps "to" in range 0–25
exports.clamp = (to) => (to < 0 ? 0 : to > 25 ? 25 : to);

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

    rollDice() {
        this.diceRolled = [rollDie(), rollDie()];

        // Doubles
        if (this.diceRolled[0] === this.diceRolled[1])
            this.diceRolled = this.diceRolled.concat(this.diceRolled);

        // Sort smallest to largest
        this.dice = [...this.diceRolled].sort((a, b) => a - b);
    },

    // Returns the player who's turn it ISN'T
    otherPlayer() {
        if (this.turn === Player.black) return Player.white;
        if (this.turn === Player.white) return Player.black;
        return Player.neither;
    },

    // Is the board in a state where either player has won?
    isGameWon() {
        if (this.off[this.turn] === 15) {
            this.winner = this.turn;
            this.turn = Player.neither;
            return true;
        }
        return false;
    },
});

const Pip = (size = 0, owner = Player.neither) => ({
    size: size,
    top: owner,
    bot: owner,
});

const rollDie = () => Math.floor(Math.random() * 6) + 1;

exports.Player = Player;
exports.Pip = Pip;
exports.rollDie = rollDie;
