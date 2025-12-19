import type { PlayerBW } from "olympus-bg";

type AnimationQueue = {
    black: Snapshot[];
    white: Snapshot[];
};

type Snapshot = {
    x: number;
    y: number;
};

class AnimationSystem {
    #queue: AnimationQueue = { black: [], white: [] };

    enqueue(color: PlayerBW, node: HTMLElement) {
        const { x, y } = node.getBoundingClientRect();
        this.#queue[color].push({ x, y });
    }

    dequeue(color: PlayerBW): { from: Snapshot | undefined; delay: number; duration: number } {
        const result = this.#queue[color].shift();

        const delay = 50 * this.#queue[color].length;
        const duration = delay + 50;

        return {
            from: result,
            delay,
            duration,
        };
    }
}

export const animations = new AnimationSystem();
