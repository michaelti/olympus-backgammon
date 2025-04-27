export type Player = "black" | "white" | "neither";

export type PlayerBW = "black" | "white";

export type Bar = {
    black: number;
    white: number;
};

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
    | { valid: false; reason: "MorePossibleMoves" | "LargerPossibleMove" };

export type InitialGameData = {
    player: PlayerBW;
    moves?: MoveData[];
    dice?: number[];
    pips?: PipData[];
    bar?: BarData;
    off?: OffData;
};

export type GameData = {
    player: PlayerBW;
    moves: MoveData[];
    dice: number[];
    pips: PipData[];
    bar: BarData;
    off: OffData;
};

export type BoardData = {
    dice: number[];
    pips: PipData[];
    bar: BarData;
    off: OffData;
};

export type MoveData = {
    from: number;
    to: number;
    die: number;
};

export type PipData = {
    size: number;
    owner: Player;
    isPinned: boolean;
};

type BarData = {
    black: number;
    white: number;
};

type OffData = {
    black: number;
    white: number;
};

export type Variant = "Portes" | "Plakoto" | "Fevga";

export type OnGameOver = (winner: Player, points: number) => void;
