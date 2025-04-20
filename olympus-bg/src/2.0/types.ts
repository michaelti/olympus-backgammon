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

export enum TurnValidity {
    valid = 1,
    validZero = 2,
    invalid = 0,
    invalidMoreMoves = -1,
    invalidLongerMove = -2,
}

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
