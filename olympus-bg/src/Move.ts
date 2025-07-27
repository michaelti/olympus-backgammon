export class Move {
    from: number;
    to: number;
    die: number;
    sideEffect?: { from: number; to: number };

    constructor(from: number, to: number, die: number, sideEffect?: { from: number; to: number }) {
        this.from = from;
        this.to = to;
        this.die = die;
        // TODO: this has been renamed to `effect` elsewhere
        if (sideEffect) this.sideEffect = sideEffect;
    }
}
