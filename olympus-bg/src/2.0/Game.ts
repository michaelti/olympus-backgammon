import { Bar, GameData, Off, PlayerBW, TurnValidity } from "./types.js";
import { Move } from "./Move.js";
import { Dice } from "./Dice.js";
import { Pip } from "./Pip.js";
import { otherPlayer } from "./util.js";

export abstract class Game {
    player: PlayerBW;
    dice: Dice;
    moves: Move[];
    pips: Pip[];
    bar: Bar;
    off: Off;
    // TODO: sleep on these
    #possibleTurns: Move[][] = [];
    #longestPossibleTurn: number = 0;
    #areWeDone: boolean = false;

    constructor(initial: GameData | { player: PlayerBW }) {
        // TODO: there is a bug here where we can end up with incomplete gamedata
        // - Option 1: make each of these keys optional for real
        // - Option 2: update the types so that a partial object isn't accepted
        //   (currently it's using the second type and 'allowing' extra keys)
        if ("pips" in initial) {
            this.player = initial.player;
            this.moves = initial.moves.map((move) => new Move(move.from, move.to, move.dieUsed));
            this.dice = new Dice(initial.dice);
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
    }

    abstract isMoveValid(from: number, to: number): boolean;
    abstract doMove(from: number, to: number): void;
    abstract getDestination(start: number, die: number): number;
    abstract clone(): Game;

    startTurn() {
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
            const isBearingOff = this.moves[0]?.to === 0 || this.moves[0]?.to === 25;

            if (!(isLastChecker && isBearingOff)) {
                return TurnValidity.invalidMoreMoves;
            }
        }

        // Validate single move turn uses the largest possible die
        // If the supplied move is smaller than the remaining die,
        // then check if there's a possible move with the remaining die
        if (
            this.moves.length === 1 &&
            this.#longestPossibleTurn === 1 &&
            this.moves[0].dieUsed < this.dice.remaining[0]
        ) {
            for (const possibleTurn of this.#possibleTurns) {
                if (possibleTurn[0].dieUsed > this.moves[0].dieUsed) {
                    return TurnValidity.invalidLongerMove;
                }
            }
        }

        return TurnValidity.valid;
    }

    /**
     * Must be called at the beginning of a turn
     */
    #generateAllPossibleTurns(): void {
        if (this.dice.remaining.length === 0) return;
        if (this.#areWeDone) return;

        const turns: Move[][] = [];
        let maxTurnLength = 0;

        const initialDiceLength = this.dice.remaining.length;

        // Optimization for doubles since the order in which they are played doesn't matter
        const uniqueDice = this.dice.isDoubles ? [this.dice.remaining[0]] : this.dice.remaining;

        for (const die of uniqueDice) {
            for (let pipStart = 0; pipStart <= 25; pipStart++) {
                if (this.pips[pipStart].owner !== this.player) continue;
                if (this.pips[pipStart].size < 1) continue; // Added

                const pipTo = this.getDestination(pipStart, die);
                const move = new Move(pipStart, pipTo, die);

                if (!this.isMoveValid(move.from, move.to)) continue;

                const gameClone = this.clone();

                gameClone.doMove(move.from, move.to);
                gameClone.#generateAllPossibleTurns();
                const nextTurns = gameClone.#possibleTurns;

                if (!nextTurns.length) {
                    const turn = [move];
                    turns.push(turn);

                    if (turn.length > maxTurnLength) {
                        maxTurnLength = turn.length;
                    }

                    continue;
                }

                for (const nextMoves of nextTurns) {
                    const turn = [move, ...nextMoves];
                    turns.push(turn);

                    if (turn.length > maxTurnLength) {
                        maxTurnLength = turn.length;
                        // Optimization: if we've used all dice, we can't do better
                        if (maxTurnLength === initialDiceLength) {
                            this.#areWeDone = true;
                            break;
                        }
                    }
                }
            }
        }

        this.#possibleTurns = turns;
        this.#longestPossibleTurn = maxTurnLength;
    }

    isGameOver(): 0 | 1 | 2 {
        return 0;
    }

    otherPlayer(): PlayerBW {
        return otherPlayer(this.player);
    }
}
