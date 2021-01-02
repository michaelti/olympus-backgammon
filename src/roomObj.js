const clone = require("ramda.clone");
const portes = require("./portes");
const plakoto = require("./plakoto");
const fevga = require("./fevga");
const { Board, Player, Variant, reverseMove, rollDie } = require("./gameUtil");

const Step = Object.freeze({
    setup: 1,
    startingRoll: 2,
    game: 3,
});

// Base Room object
exports.Room = () => ({
    board: Board(),
    boardBackups: null,
    variant: null,
    moves: null,
    players: {},
    score: { [Player.white]: 0, [Player.black]: 0, [Player.neither]: 0 },
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
        this.boardBackups = [clone(this.board)];
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
        if (this.board.isMoveValid(from, to)) {
            this.boardBackups.push(clone(this.board));
            this.board.doMove(from, to);
            this.moves.push(this.board.recentMove);
            // Validate the whole turn by evaluating the staged moves on the original board
            this.board.turnValidity = this.boardBackups[0].turnValidator(this.moves);
        }
    },

    gameUndoMove() {
        if (this.moves.length > 0) {
            const move = this.moves.pop();
            const boardBackup = this.boardBackups.pop();
            this.board = clone(boardBackup);
            this.board.recentMove = reverseMove(move);
            if (move.subMove) this.board.recentMove.subMove = reverseMove(move.subMove);
        }
    },

    // Frontend should ensure this function is only called if the turn is valid
    gameApplyTurn() {
        // Valid turns are positive numbers; invalid turns are negative
        if (this.board.turnValidity > 0) {
            const points = this.board.isGameWon();
            if (points) {
                this.score[this.board.winner] += points;
                this.step = Step.setup;
            } else {
                this.board.turn = this.board.otherPlayer();
                this.board.rollDice();
                this.boardBackups = [clone(this.board)];
                this.moves = [];
                this.board.recentMove = {};
            }
        }
    },
});

exports.Step = Step;
