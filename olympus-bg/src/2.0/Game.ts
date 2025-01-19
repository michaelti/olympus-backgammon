import { Bar, GameData, Off, PlayerBW, TurnValidity } from "./types.js";
import { Move } from "./Move.js";
import { Dice } from "./Dice.js";
import { Pip } from "./Pip.js";
import { otherPlayer, pipDistance } from "./util.js";

export abstract class Game {
    player: PlayerBW;
    dice: Dice;
    moves: Move[];
    pips: Pip[];
    bar: Bar;
    off: Off;
    #possibleTurns: Move[][] = [];
    #longestPossibleTurn: number = 0;

    constructor(initial: GameData | { player: PlayerBW }) {
        // TODO: there is a bug here where we can end up with incomplete gamedata
        // - Option 1: make each of these keys optional for real
        // - Option 2: update the types so that a partial object isn't accepted
        //   (currently it's using the second type and 'allowing' extra keys)
        if ("pips" in initial) {
            this.player = initial.player;
            this.moves = initial.moves.map((move) => new Move(move.from, move.to, move.dieUsed));
            this.dice = new Dice(initial.dice.initial, initial.dice.remaining);
            this.pips = initial.pips.map((pip) => new Pip(pip.size, pip.owner, pip.isPinned));
            this.bar = { ...initial.bar };
            this.off = { ...initial.off };
            return;
        }

        this.player = initial.player;
        this.dice = new Dice();
        this.moves = [];
        this.pips = Array.from({ length: 26 }, () => new Pip());
        this.bar = { black: 0, white: 0 };
        this.off = { black: 0, white: 0 };

        this.startTurn();
    }

    abstract isMoveValid(from: number, to: number): boolean;
    abstract doMove(from: number, to: number): void;

    startTurn() {
        this.dice.roll();
        this.#generateAllPossibleTurns();
    }

    getTurnValidity(): TurnValidity {
        // If there are no possible moves, the turn is valid
        if (this.#longestPossibleTurn === 0) {
            return TurnValidity.validZero;
        }

        // Validate turn length. Players must make as many moves as possible
        if (this.moves.length !== this.#longestPossibleTurn) {
            // Unless they are bearing off their final checker
            const isLastChecker = this.off[this.player] === 14;
            const isBearingOff = this.moves[0].to === 0 || this.moves[0].to === 25;

            if (!(isLastChecker && isBearingOff)) {
                return TurnValidity.invalidMoreMoves;
            }
        }

        // Validate single move turn uses the largest die
        if (this.#longestPossibleTurn === 1 && !this.dice.isDoubles()) {
            // If the supplied move matches the smaller dice
            // then check if there's a possible move with the larger dice
            if (pipDistance(this.moves[0].from, this.moves[0].to) === this.dice.getSmallest()) {
                for (const possibleTurn of this.#possibleTurns) {
                    const distance = pipDistance(possibleTurn[0].from, possibleTurn[0].to);
                    if (distance === this.dice.getLargest()) {
                        return TurnValidity.invalidLongerMove;
                    }
                }
            }
        }

        return TurnValidity.valid;
    }

    #generateAllPossibleTurns(): void {
        // TODoozy
        this.#possibleTurns = [[]];

        for (const turn of this.#possibleTurns) {
            if (turn.length > this.#longestPossibleTurn) {
                this.#longestPossibleTurn = turn.length;
            }
        }

        this.#longestPossibleTurn = 0;
    }

    isGameOver(): 0 | 1 | 2 {
        return 0;
    }

    getDestination(start: number, die: number): number {
        return start + die;
    }

    otherPlayer(): PlayerBW {
        return otherPlayer(this.player);
    }
}
