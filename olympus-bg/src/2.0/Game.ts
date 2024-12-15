import { Player, PlayerBW } from "./types.js";
import { Move } from "./Move.js";
import { Dice } from "./Dice.js";
import { Pip } from "./Pip.js";
import { otherPlayer } from "./util.js";

export abstract class Game {
    player: PlayerBW;
    moves: Move[] = [];
    dice: Dice;
    pips: Pip[] = Array.from({ length: 26 }, () => new Pip());
    bar = { [Player.black]: 0, [Player.white]: 0 };
    off = { [Player.black]: 0, [Player.white]: 0 };

    // #firstPip = 1;
    // #lastPip = 24;
    // #possibleTurns: Move[][] = [];

    constructor(startPlayer: PlayerBW) {
        this.player = startPlayer;
        this.dice = new Dice();
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
