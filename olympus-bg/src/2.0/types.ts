export type Player = "black" | "white" | "neither";

export type PlayerBW = "black" | "white";

// export type Place = number | "bar" | "off";

export type Bar = {
    black: number;
    white: number;
};

export type Off = {
    black: number;
    white: number;
};

export enum TurnValidity {
    valid = 1,
    validZero = 2,
    invalid = 0,
    invalidMoreMoves = -1,
    invalidLongerMove = -2,
}

// TODO: consider whether this is the right approach
// can we have the classes implement these types or vice versa?
// (for snapshots/restoration of game state)
export type GameData = {
    player: PlayerBW;
    moves: MoveData[];
    dice: DiceData;
    pips: PipData[];
    bar: BarData;
    off: OffData;
};

export type MoveData = {
    from: number;
    to: number;
    dieUsed: number;
};

export type DiceData = {
    remaining: number[];
    isDoubles: boolean;
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
// END TODO
//
