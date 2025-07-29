// TODO:
// 1. Add ability to animate individual *checkers* (not just pip/top)
//    - Option 1: the parent manages this. that would give us full control.
//    - **Option 2**: use `out` on each checker. if we assume moves only happen 1 at
//      a time, we can just grab any pending (correct color) snapshot from the queue
// 2. Make multi-usable (context, not global DOM)

import type { PlayerBW } from "olympus-bg";

/**
 * **Key:** The pip which will *receive* this animation
 *
 * **Value:** Snapshot of the pip *from which* the recipient will transition
 */
type AnimationQueue = { black: Snapshot[]; white: Snapshot[] };
type Snapshot = { x: number; y: number };

class AnimationSystem {
    #queue: AnimationQueue = { black: [], white: [] };

    enqueue(color: PlayerBW, node: HTMLElement): void {
        const { x, y } = node.getBoundingClientRect();
        this.#queue[color].push({ x, y });
    }

    dequeue(color: PlayerBW): Snapshot | undefined {
        const result = this.#queue[color].shift();
        return result;
    }
}

export const animations = new AnimationSystem();
