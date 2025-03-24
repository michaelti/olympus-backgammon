export class Move {
    from: number;
    to: number;
    die: number;
    sideEffect?: { from: number; to: number };

    constructor(from: number, to: number, die: number, sideEffect?: { from: number; to: number }) {
        this.from = from;
        this.to = to;
        this.die = die;
        if (sideEffect) this.sideEffect = sideEffect;
    }

    setSideEffect(from: number, to: number) {
        this.sideEffect = { from, to };
    }

    getReversed(): Move {
        const reversedMove = new Move(this.to, this.from, this.die);

        if (this.sideEffect) {
            reversedMove.setSideEffect(this.sideEffect.to, this.sideEffect.from);
        }

        return reversedMove;
    }
}
