export enum Player {
    neither = 0,
    white = 1,
    black = -1,
}

export type PlayerBW = Player.black | Player.white;

// TODO: consider whethere this is the right approach
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
    isDoubles: boolean;
};

type PipData = {
    size: number;
    owner: Player;
    isPinned: boolean;
};

type BarData = {
    [Player.black]: number;
    [Player.white]: number;
};

type OffData = {
    [Player.black]: number;
    [Player.white]: number;
};
// END TODO
//
