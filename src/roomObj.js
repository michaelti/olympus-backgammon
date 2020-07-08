const clone = require("ramda.clone");
const plakoto = require("./plakoto.js");
const { Player } = require("./gameUtil");

// Base Room object
const Room = () => ({
    board: null,
    boardBackup: null,
    moves: null,
    players: null,

    initRoom() {
        // Initialize a game
        this.board = plakoto.Board();
        this.board.initPlakoto();
        this.boardBackup = clone(this.board);
        this.moves = new Array();

        // Initialize a list of players
        this.players = {};
    },

    addPlayer(id) {
        if (this.players[id]) return;

        // Add entry to the players list for this room, if there's space
        if (Object.keys(this.players).length < 2) {
            if (!Object.values(this.players).includes(Player.white)) {
                this.players[id] = Player.white;
            } else {
                this.players[id] = Player.black;
            }
        }
    },

    removePlayer(id) {
        delete this.players[id];
    },

    isPlayerTurn(id) {
        return this.players[id] === this.board.turn;
    },

    gameMove(from, to) {
        if (this.board.tryMove(from, to)) {
            this.moves.push(plakoto.Move(from, to));
        }
    },

    gameApplyTurn() {
        /* Validate the whole turn by passing the array of moves to a method
         * If the turn is valid, end the player's turn
         * Else, return an error and undo the partial turn
         */
        if (this.boardBackup.isTurnValid(this.moves)) {
            this.board.turn = this.board.otherPlayer();
            this.board.rollDice();
            this.boardBackup = clone(this.board);
        } else {
            this.board = clone(this.boardBackup);
        }

        this.moves = [];
    },

    gameUndoTurn() {
        this.moves = [];
        this.board = clone(this.boardBackup);
    },
});

module.exports = Room;
