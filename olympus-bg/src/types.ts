export type Player = "black" | "white" | "neither";

export type PlayerBW = "black" | "white";

export type Off = {
    black: number;
    white: number;
};

export type Move = {
    from: number;
    to: number;
    effect?: { from: number; to: number };
};

export type TurnValidity =
    | { valid: true; reason: "Valid" | "NoPossibleMoves" }
    | { valid: false; reason: "MorePossibleMoves" | "LargerPossibleMove" | "MustRoll" };

// TODO: Refactor to Partial<GameData>
// TODO: That means `player` will need a default value
export type InitialGameData = {
    player: PlayerBW;
    moves?: MoveData[];
    dice?: number[];
    pips?: PipData[];
    off?: OffData;
};

export type GameData = {
    player: PlayerBW;
    moves: MoveData[];
    dice: number[];
    pips: PipData[];
    off: OffData;
};

export type BoardData = {
    dice: number[];
    pips: PipData[];
    off: OffData;
};

export type MoveData = {
    from: number;
    to: number;
    die: number;
    // TODO: this is missing `effect`
};

export type PipData = {
    size: number;
    owner: Player;
    isPinned: boolean;
};

type OffData = {
    black: number;
    white: number;
};

export type Variant = "Portes" | "Plakoto" | "Fevga";

export type OnGameOver = (winner: Player, points: number) => void;
