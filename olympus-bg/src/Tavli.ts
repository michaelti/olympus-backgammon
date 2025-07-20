import { Game } from "./Game.js";
import { Portes } from "./Portes.js";
import { Player, PlayerBW, Variant } from "./types.js";
import { rollDie } from "./util.js";

const GameMap = {
    Portes: Portes,
    Plakoto: Portes,
    Fevga: Portes,
} as const;

export class Tavli {
    score: {
        black: number;
        white: number;
        neither: number;
    };
    startingRolls: {
        black: number;
        white: number;
    };
    step: "PickVariant" | "StartingRoll" | "Game";
    lastWinner: Player;
    variant: Variant | null;
    game: Game | null;

    constructor() {
        this.score = { black: 0, white: 0, neither: 0 };
        this.startingRolls = { black: 0, white: 0 };
        this.step = "PickVariant";
        this.lastWinner = "neither";
        this.variant = null;
        this.game = null;
    }

    rollToStart(player: PlayerBW) {
        if (this.step !== "StartingRoll") return;
        if (!this.variant) throw "Pick a variant";

        // If this player has already rolled
        if (this.startingRolls[player]) return;

        this.startingRolls[player] = rollDie();

        const black = this.startingRolls["black"];
        const white = this.startingRolls["white"];

        // If someone hasn't rolled yet
        if (!black || !white) return;

        // If it's a draw
        if (black === white) {
            this.startingRolls["black"] = 0;
            this.startingRolls["white"] = 0;
            return;
        }

        let starter: Player;

        if (black > white) {
            starter = "black";
        } else {
            starter = "white";
        }

        const game = GameMap[this.variant];
        this.game = new game({ player: starter }, this.#handleGameOver);

        this.startingRolls["black"] = 0;
        this.startingRolls["white"] = 0;

        this.step = "Game";
    }

    pickVariant(variant: Variant) {
        if (this.step !== "PickVariant") return;

        this.variant = variant;

        if (this.lastWinner === "neither") {
            this.step = "StartingRoll";
            return;
        }

        const game = GameMap[this.variant];
        this.game = new game({ player: this.lastWinner }, this.#handleGameOver);

        this.step = "Game";
    }

    #handleGameOver(winner: Player, points: number) {
        if (this.step !== "Game") return;

        this.score[winner] += points;
        this.lastWinner = winner;

        this.step = "PickVariant";
    }
}
