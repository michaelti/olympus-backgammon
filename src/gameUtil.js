// Enum-like object
const Player = Object.freeze({
    neither: 0,
    white: 1,
    black: -1,
});

// Variant of backgammon
exports.Variant = Object.freeze({
    undefined: 0,
    portes: 1,
    plakoto: 2,
    fevga: 3,
});

// Clamps "to" in range 0–25
exports.clamp = (to) => (to < 0 ? 0 : to > 25 ? 25 : to);

exports.Move = (from, to) => ({ from, to });

exports.Board = () => ({
    turn: Player.neither,
    winner: Player.neither,
    offWhite: 0,
    barWhite: 0,
    offBlack: 0,
    barBlack: 0,
    pips: Array.from({ length: 25 }, Pip),
    diceRolled: new Array(2),
    dice: new Array(2),

    rollDice() {
        this.diceRolled = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];

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

    // Returns true if the move was successful
    tryMove(from, to) {
        if (this.isMoveValid(from, to)) {
            this.doMove(from, to);
            return true;
        }
        return false;
    },

    // Is the board in a state where either player has won?
    isGameWon() {
        return this.offWhite === 15 || this.offBlack === 15 ? true : false;
    },
});

const Pip = (size = 0, owner = Player.neither) => ({
    size: size,
    top: owner,
    bot: owner,
});

exports.Player = Player;
exports.Pip = Pip;
