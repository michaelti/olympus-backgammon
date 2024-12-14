export class Move {
    dieUsed: number | null;
    sideEffect: { from: number; to: number } | null;
    constructor(public from: number, public to: number) {
        this.dieUsed = null;
        this.sideEffect = null;
    }
    getReversed() {
        return { from: this.to, to: this.from };
    }
}
