const clone = require("ramda.clone");
const portes = require("./portes");
const plakoto = require("./plakoto");
const fevga = require("./fevga");
const { Player, Variant, Move, rollDie } = require("./gameUtil");

const Step = Object.freeze({
    setup: 1,
    startingRoll: 2,
    game: 3,
});

// Base Room object
exports.Room = () => ({
    board: null,
    boardBackup: null,
    variant: null,
    moves: null,
    players: {},
    dice: { [Player.white]: undefined, [Player.black]: undefined, draw: null },
    step: Step.setup,

    initGame(type) {
        const prevWinner = this.board ? this.board.winner : null;
        // Game type selector
        if (type === Variant.portes) this.board = portes.Board();
        else if (type === Variant.plakoto) this.board = plakoto.Board();
        else if (type === Variant.fevga) this.board = fevga.Board();
        else console.error("This type is unavailable");
        this.variant = type;
        this.board.initGame();
        this.moves = new Array();
        if (prevWinner) this.startGame(prevWinner);
        else this.step = Step.startingRoll;
    },

    startGame(startingPlayer) {
        this.board.turn = startingPlayer;
        this.board.rollDice();
        this.boardBackup = clone(this.board);
        this.step = Step.game;
        this.dice = {
            [Player.white]: undefined,
            [Player.black]: undefined,
            draw: null,
        };
    },

    startingRoll(player) {
        if (!this.dice[player]) this.dice[player] = rollDie();

        // If both players have rolled
        if (this.dice[Player.white] > this.dice[Player.black]) {
            this.startGame(Player.white);
        } else if (this.dice[Player.black] > this.dice[Player.white]) {
            this.startGame(Player.black);
        } else if (this.dice[Player.white] === this.dice[Player.black]) {
            this.dice = {
                [Player.white]: undefined,
                [Player.black]: undefined,
                draw: this.dice[player],
            };
        }
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

    gameApplyTurn() {
        /* Validate the whole turn by passing the array of moves to a method
         * If the turn is valid, end the player's turn
         * Else, return an error and undo the partial turn */
        if (this.boardBackup.isTurnValid(this.moves)) {
            if (this.board.isGameWon()) {
                this.step = Step.setup;
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

exports.Step = Step;
