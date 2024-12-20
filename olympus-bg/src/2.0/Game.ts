import { Bar, GameData, Off, Player, PlayerBW } from "./types.js";
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
    // #possibleTurns: Move[][] = [];

    constructor(initial: GameData | { player: PlayerBW }) {
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
        this.bar = { [Player.black]: 0, [Player.white]: 0 };
        this.off = { [Player.black]: 0, [Player.white]: 0 };
    }

    abstract isMoveValid(from: number, to: number): boolean;
    abstract doMove(from: number, to: number): void;

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
