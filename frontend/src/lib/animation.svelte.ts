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
type Snapshot = { x: number; y: number; index: number };

class AnimationSystem {
    #queue: AnimationQueue = { black: [], white: [] };

    enqueue(color: PlayerBW, index: number, node: HTMLElement) {
        const { x, y } = node.getBoundingClientRect();
        this.#queue[color].push({ x, y, index });
    }

    dequeue(color: PlayerBW): { from: Snapshot | undefined; delay: number; duration: number } {
        const length = this.#queue[color].length;
        const result = this.#queue[color].pop();

        const maxDelay = 15 * 20;
        const delay = maxDelay - length * 20;

        // Now something funky is happening with capturing in portes...

        // Something weird is happening animating to plakoto or fevga
        // We might need provisions for `out` order once we mess with the render order

        return {
            from: result,
            delay: 0 + delay,
            duration: 250,
        };
    }
}

export const animations = new AnimationSystem();
