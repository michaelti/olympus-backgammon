import { Move, Moves, Pip, Player, TurnMessage, clamp, random, pipDistance } from "./util.js";
// import clone from "ramda.clone";
import { clone } from "ramda";

type Turn = Moves[];

export const Board = () => ({
    turn: null as Player | null,
    winner: null as Player | null,
    off: { [Player.white]: 0, [Player.black]: 0 },
    pips: new Array(26).fill(undefined).map(() => Pip()),
    diceRolled: new Array(2),
    dice: new Array(2),
    recentMove: {},
    possibleTurns: null as Turn[] | null,
    maxTurnLength: 0,
    turnValidity: TurnMessage.invalid,
    firstPip: 1,
    lastPip: 24,
    // Property used by bot
    uniqueTurns: null,
    // Fevga properties
    state: undefined,

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
        this.possibleTurns = this.allPossibleTurns(false);

        this.maxTurnLength = 0;
        for (const turn of this.possibleTurns) {
            if (turn.length > this.maxTurnLength) this.maxTurnLength = turn.length;
        }
        this.turnValidity = this.maxTurnLength === 0 ? TurnMessage.validZero : TurnMessage.invalid;
    },

    // Returns the player who's turn it ISN'T
    otherPlayer(player?: Player.white | Player.black): Player.white | Player.black {
        if (player === undefined) {
            if (this.turn === null) throw "this.turn musn't be null"; // TODO: appeasing typescript
            if (this.turn === Player.neither) throw "this.turn musn't be Player.neither"; // TODO: appeasing typescript
            player = this.turn;
        }

        if (player === Player.black) return Player.white;
        else return Player.black;
    },

    // Is the board in a state where either player has won?
    // Returns the number of points won
    isGameOver(): number {
        if (this.turn === null) throw "this.turn musn't be null"; // TODO: appeasing typescript
        if (this.turn === Player.neither) throw "this.turn musn't be Player.neither"; // TODO: appeasing typescript

        if (this.off[this.turn] === 15) {
            this.winner = this.turn;
            this.turn = Player.neither;
            // if the other player has borne off 0 checkers, return 2 points
            const loser = this.otherPlayer(this.winner);
            return this.off[loser] === 0 ? 2 : 1;
        }
        return 0;
    },

    // Validates a turn of 0–4 moves
    turnValidator(moves: Turn): TurnMessage {
        if (this.turn === null) throw "this.turn musn't be null"; // TODO: appeasing typescript
        if (this.turn === Player.neither) throw "this.turn musn't be Player.neither"; // TODO: appeasing typescript
        if (this.possibleTurns === null) throw "this.possibleTurns musn't be null"; // TODO: appeasing typescript

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
    getDestination(start: number, die: number): number {
        if (this.turn === null) throw "this.turn musn't be null"; // TODO: appeasing typescript
        return clamp(this.turn * die + start);
    },

    // Returns a 2D array of Move objects
    allPossibleTurns(isBot: boolean): Turn[] {
        if (this.dice.length === 0) return [];
        const allTurns = [];
        const uniqueDice = this.dice[0] === this.dice[1] ? [this.dice[0]] : this.dice;
        for (const die of uniqueDice) {
            for (let pipStart = this.firstPip; pipStart <= this.lastPip; pipStart++) {
                if (this.pips[pipStart].top === this.turn) {
                    const pipEnd = this.getDestination(pipStart, die);
                    const currentMove = Move(pipStart, pipEnd);
                    if (this.isMoveValid(currentMove.from, currentMove.to)) {
                        // deep copy game board using ramda
                        const newBoard = clone(this);
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
