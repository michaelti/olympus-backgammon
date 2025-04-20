import { Bar, InitialGameData, Off, PlayerBW, TurnValidity, OnGameOver } from "./types.js";
import { Move } from "./Move.js";
import { Pip } from "./Pip.js";
import { otherPlayer, rollDie } from "./util.js";

export abstract class Game {
    player: PlayerBW;
    dice: number[];
    moves: Move[];
    pips: Pip[];
    bar: Bar;
    off: Off;
    #longestPossibleTurn: number = 0;
    #largestPossibleDie: number = 0;
    onGameOver?: OnGameOver;

    constructor(initial: InitialGameData, onGameOver?: OnGameOver) {
        this.player = initial.player;
        this.dice = initial.dice ? [...initial.dice] : [];

        this.moves = initial.moves
            ? initial.moves.map((move) => new Move(move.from, move.to, move.die))
            : [];

        this.pips = initial.pips
            ? initial.pips.map((pip) => new Pip(pip.size, pip.owner, pip.isPinned))
            : Array.from({ length: 26 }, () => new Pip());

        this.bar = initial.bar ? { ...initial.bar } : { black: 0, white: 0 };
        this.off = initial.off ? { ...initial.off } : { black: 0, white: 0 };

        if (onGameOver) {
            this.onGameOver = onGameOver;
        }
    }

    abstract isMoveValid(from: number, to: number): boolean;
    abstract doMove(from: number, to: number): void;
    abstract getDestination(start: number, die: number): number;
    abstract clone(): Game;
    // TODO: abstract undo()

    rollDice() {
        this.dice = [rollDie(), rollDie()];
        const isDoubles = this.dice[0] === this.dice[1];
        if (isDoubles) this.dice = [...this.dice, ...this.dice];
    }

    startTurn() {
        const { longest, largest } = Game.getValidTurnCriteria(this);
        this.#longestPossibleTurn = longest;
        this.#largestPossibleDie = largest;
    }

    endTurn(): 0 | 1 | 2 {
        if (this.onGameOver) {
            this.onGameOver("neither", 0);
        }

        return 0;
    }

    otherPlayer(): PlayerBW {
        return otherPlayer(this.player);
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
            this.moves[0].die < this.dice[0]
        ) {
            if (this.moves[0].die < this.#largestPossibleDie) {
                return TurnValidity.invalidLongerMove;
            }
        }

        return TurnValidity.valid;
    }

    /**
     * Must be called at the beginning of a turn
     *
     * Returns:
     *  - The length of a turn that must be played if possible
     *  - The largest die that must be played in the case of a single-move turn
     *  - The list of turns that were generated to produce these values
     */
    static getValidTurnCriteria(game: Game): {
        longest: number;
        largest: number;
        turns: Move[][];
    } {
        const diceLength = game.dice.length;
        let foundTurnThatUsesAllDice = false;
        return recurse(game);

        function recurse(game: Game): { turns: Move[][]; longest: number; largest: number } {
            if (game.dice.length === 0) return { turns: [], longest: 0, largest: 0 };
            if (foundTurnThatUsesAllDice) return { turns: [], longest: 0, largest: 0 };

            const turns: Move[][] = [];
            let maxTurnLength = 0;
            let maxDieUsed = 0;

            // Optimization: for doubles, the order in which they are played doesn't matter
            const uniqueDice = new Set(game.dice);

            for (const die of uniqueDice) {
                for (let pipStart = 0; pipStart <= 25; pipStart++) {
                    if (game.pips[pipStart].owner !== game.player) continue;
                    if (game.pips[pipStart].size < 1) continue; // Added

                    const pipTo = game.getDestination(pipStart, die);
                    const move = new Move(pipStart, pipTo, die);

                    if (!game.isMoveValid(move.from, move.to)) continue;

                    if (die > maxDieUsed) {
                        maxDieUsed = die;
                    }

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

            return { turns: turns, longest: maxTurnLength, largest: maxDieUsed };
        }
    }
}
