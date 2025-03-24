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
    #longestPossibleTurn: number = 0;
    #possibleTurns: Move[][] = [];

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
        // this.dice = new Dice();
        const { longest, turns } = Game.getAllPossibleTurns(this);
        this.#longestPossibleTurn = longest;
        this.#possibleTurns = turns;
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

    isGameOver(): 0 | 1 | 2 {
        return 0;
    }

    otherPlayer(): PlayerBW {
        return otherPlayer(this.player);
    }

    /**
     * Must be called at the beginning of a turn
     * May contain some invalid turns (TODO: is this true? copied from old version)
     * TODO: add a rewind to the beginning of this so it can be used at any time?
     * DECISION:
     * - either add config: { stopEarly: boolean, onlyValidTurns: boolean }
     * - or change this to just getLongestPossibleTurn, and implement allPossibleValidTurns separately for bot
     */
    static getAllPossibleTurns(game: Game): {
        turns: Move[][];
        longest: number;
    } {
        const diceLength = game.dice.remaining.length;
        let foundTurnThatUsesAllDice = false;

        return recurse(game);

        function recurse(game: Game): { turns: Move[][]; longest: number } {
            if (game.dice.remaining.length === 0) return { turns: [], longest: 0 };
            if (foundTurnThatUsesAllDice) return { turns: [], longest: 0 };

            const turns: Move[][] = [];
            let maxTurnLength = 0;

            // Optimization: for doubles, the order in which they are played doesn't matter
            const uniqueDice = new Set(game.dice.remaining);

            for (const die of uniqueDice) {
                for (let pipStart = 0; pipStart <= 25; pipStart++) {
                    if (game.pips[pipStart].owner !== game.player) continue;
                    if (game.pips[pipStart].size < 1) continue; // Added

                    const pipTo = game.getDestination(pipStart, die);
                    const move = new Move(pipStart, pipTo, die);

                    if (!game.isMoveValid(move.from, move.to)) continue;

                    const gameClone = game.clone();

                    gameClone.doMove(move.from, move.to);
                    const nextTurns = recurse(gameClone).turns;

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
                            if (maxTurnLength === diceLength) {
                                foundTurnThatUsesAllDice = true;
                                break;
                            }
                        }
                    }
                }
            }

            return { turns: turns, longest: maxTurnLength };
        }
    }
}
