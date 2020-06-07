const prompt = require('prompt-sync')({sigint: true});
const clone = require('ramda.clone');

// Enum-like object
const Player = Object.freeze({
    empty : {direction: 0, name: "Empty", code: "-"},
    white : {direction: 1, name: "White", code: "W"},
    black : {direction:-1, name: "Black", code: "B"},
});

function Pip(size = 0, owner = Player.empty) {
    this.size = size;
    this.top = owner;
    this.bot = owner;
};

function Submove(from, to){
    this.from = from;
    this.to = to;
};

let Board = {
    turn: Player.empty,
    off1: 0, off2: 0,
    bar1: 0, bar2: 0,
    pips: new Array(25),
    dice: new Array(2),

    // Initialize the board for a game of plakoto
    initPlakoto() {
        this.turn = Player.black;   // Later, players will roll to see who goes first
        this.rollDice();
        for (i=0; i<=24; i++) {
            this.pips[i] = new Pip();
        }
        this.pips[24] = new Pip(15, Player.black);  // Black moves towards pip 1 (decreasing)
        this.pips[1] = new Pip(15, Player.white);   // White moves towards pip 24 (increasing)
    },

    rollDice() {
        this.dice = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
        if (this.dice[0] === this.dice[1]) {
            this.dice = this.dice.concat(this.dice);
        }
    },

    // Print an ASCII game board to console
    print() {
        let temp = "";
        for (i=13; i<=24; i++) {
            temp += `(${ i })${ this.pips[i].top.code }${ this.pips[i].size }${ this.pips[i].bot.code } `;
        }
        console.log(temp);
        temp = "";
        for (i=12; i>=1; i--) {
            if (i < 10)
                temp += `( ${ i })${ this.pips[i].top.code }${ this.pips[i].size }${ this.pips[i].bot.code } `;
            else
                temp += `(${ i })${ this.pips[i].top.code }${ this.pips[i].size }${ this.pips[i].bot.code } `;
        }
        console.log(temp + '\n');
    },

    // Is the move valid?
    // from:    Move from pip # <eg. 1>
    // to:      Move to pip # <eg. 4>
    // return:  Returns a boolean
    isValid(from, to) {
        if (from < 1 || from > 24 || to < 1 || to > 24){
            return false;
        }
        if (this.pips[from].top !== this.turn) {
            return false;
        }
        if (this.pips[to].top === this.otherPlayer() && this.pips[to].size > 1) {
            return false;
        }
        if (! this.dice.includes( this.turn.direction * (to - from) ) ) {
            return false;
        }
        return true;
    },

    doSubmove(from, to) {
        // From pip
        if (this.pips[from].size === 1) {
            this.pips[from].top = Player.empty;
            this.pips[from].bot = Player.empty;
        }
        else if (this.pips[from].size === 2 && this.pips[from].top !== this.pips[from].bot){
            this.pips[from].top = this.pips[from].bot;
        }
        this.pips[from].size --;

        // To pip
        if (this.pips[to].size === 0) {
            this.pips[to].bot = this.turn;
        }
        this.pips[to].top = this.turn;
        this.pips[to].size ++;

        // Handle dice. NOTE: this will only work for 2 distinct values or 4 idencital values
        if (this.dice[0] === Math.abs(from - to)) {
            this.dice.shift();
        } else {
            this.dice.pop();
        }
    },

    // Returns the player who's turn it ISN'T
    otherPlayer() {
        if (this.turn === Player.black) return Player.white;
        if (this.turn === Player.white) return Player.black;
        return Player.empty;
    },

    // Returns 2D array
    allPossibleMoves() {
        if (this.dice.length === 0) return [];
        let ret = new Array();
        let uniqueDice = (this.dice[0] === this.dice[1]) ? [this.dice[0]] : this.dice;
        for (const die of uniqueDice) {
            for (let pipIndex=1; pipIndex<=24; pipIndex++) {
                if (this.pips[pipIndex].top === this.turn) {
                    let currentMove = new Submove(pipIndex, this.turn.direction * die + Number(pipIndex));
                    if (this.isValid(currentMove.from, currentMove.to)) {
                        // deep copy game board using ramda
                        let newBoard = clone(this);
                        newBoard.doSubmove(currentMove.from, currentMove.to);
                        let nextMoves = newBoard.allPossibleMoves();
                        if (nextMoves.length){
                            for (const nextMove of nextMoves) {
                                ret.push([currentMove, ...nextMove]);
                            }
                        }
                        else {
                            ret.push([currentMove]);
                        }
                    }
                }
            }
        }
        return ret;
    }
};

function playPlakoto() {
    let board = Object.create(Board);
    board.initPlakoto();
    board.print();
    let from, to;

    while (true) {
        while (board.dice.length > 0) {
            console.log("Your dice are: " + board.dice);
            console.log(board.allPossibleMoves());
            from = prompt(`${board.turn.name} move from: `);
            to   = prompt(`${board.turn.name} move to  : `);
            if (board.isValid(from, to)) {
                board.doSubmove(from, to);
                board.print();
            }
        }
        board.turn = board.otherPlayer();
        board.rollDice();
    }
};

playPlakoto();
