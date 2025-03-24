export class Move {
    from: number;
    to: number;
    dieUsed: number;
    sideEffect?: { from: number; to: number };

    constructor(
        from: number,
        to: number,
        dieUsed: number,
        sideEffect?: { from: number; to: number },
    ) {
        this.from = from;
        this.to = to;
        this.dieUsed = dieUsed;
        if (sideEffect) this.sideEffect = sideEffect;
    }

    setSideEffect(from: number, to: number) {
        this.sideEffect = { from, to };
    }

    getReversed(): Move {
        const reversedMove = new Move(this.to, this.from, this.dieUsed);

        if (this.sideEffect) {
            reversedMove.setSideEffect(this.sideEffect.to, this.sideEffect.from);
        }

        return reversedMove;
    }
}
