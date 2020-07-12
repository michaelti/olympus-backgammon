const clone = require("ramda.clone");
const plakoto = require("./plakoto");
const { Player, Variant, Move } = require("./gameUtil");

const State = Object.freeze({
    undefined: 0,
    setup: 1,
    startingRoll: 2,
    game: 3,
});

// Base Room object
exports.Room = () => ({
    board: null,
    boardBackup: null,
    moves: null,
    players: {},
    state: State.setup,

    startGame(type) {
        // Initialize a game
        if (type === Variant.plakoto) this.board = plakoto.Board();
        else console.error("Only plakoto is currently available");
        this.board.initGame();
        this.boardBackup = clone(this.board);
        this.state = State.game;
        this.moves = new Array();
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
            this.moves.push(Move(from, to));
        }
    },

    // Returns the player who won the game: black, white, or neither
    gameApplyTurn() {
        /* Validate the whole turn by passing the array of moves to a method
         * If the turn is valid, end the player's turn
         * Else, return an error and undo the partial turn */
        if (this.boardBackup.isTurnValid(this.moves)) {
            if (this.board.isGameWon()) {
                this.board.winner = this.board.turn;
                this.board.turn = Player.neither;
            } else {
                this.board.turn = this.board.otherPlayer();
                this.board.rollDice();
                this.boardBackup = clone(this.board);
                this.moves = [];
            }
        } else {
            this.gameUndoTurn();
        }
    },

    gameUndoTurn() {
        this.moves = [];
        this.board = clone(this.boardBackup);
    },
});

exports.State = State;
