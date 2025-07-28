import { SvelteMap } from "svelte/reactivity";

// TODO:
// 1. Add ability to animate individual *checkers* (not just pip/top)
// 2. Make multi-usable (context, not global DOM)

/**
 * **Key:** The pip which will *receive* this animation
 *
 * **Value:** Snapshot of the pip *from which* the recipient will transition
 */
type AnimationQueue = Map<number, Snapshot>;
type Snapshot = { x: number; y: number };

class AnimationSystem {
    #queue: AnimationQueue = new SvelteMap();

    enqueue(fromPip: number, toPip: number): void {
        const topCheckerFrom = document.querySelector(
            `[data-pip="${fromPip}"] [data-checker]:last-child`,
        );

        if (!topCheckerFrom) {
            console.error("Animation failed: missing topCheckerFrom");
            return;
        }

        const { x, y } = topCheckerFrom.getBoundingClientRect();

        this.#queue.set(toPip, { x, y });
    }

    dequeue(pip: number): Snapshot | undefined {
        const result = this.#queue.get(pip);
        this.#queue.delete(pip);
        return result;
    }
}

export const animations = new AnimationSystem();
