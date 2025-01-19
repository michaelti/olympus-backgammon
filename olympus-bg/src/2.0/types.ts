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

// TODO: consider whether this is the right approach
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
    initial: [number, number] | [number, number, number, number];
    remaining: number[];
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
