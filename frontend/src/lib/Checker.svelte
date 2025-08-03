<script lang="ts">
    import type { PlayerBW } from "olympus-bg";
    import { cubicOut } from "svelte/easing";
    import type { TransitionConfig } from "svelte/transition";
    import { animations } from "./animation.svelte";
    import { getDistance } from "./util";

    interface Props {
        pipNumber: number;
        color: PlayerBW;
        index: number;
    }

    let { color }: Props = $props();

    function animateIn(node: HTMLElement): TransitionConfig {
        const { from, delay, duration } = animations.dequeue(color);

        // Don't animate if there was no checker in the queue
        if (!from) return {};

        const { x, y } = node.getBoundingClientRect();
        const { dX, dY, distance } = getDistance(from.x, from.y, x, y);

        return {
            delay,
            duration: duration + Math.random() * distance,
            easing: cubicOut,
            css: (_t, u) => `
                transform: translateX(${dX * u}px) translateY(${dY * u}px);
                z-index: calc(var(--offsetZ) + 1);
            `, // TODO: do `from` zOffset to `to` zOffset
        };
    }

    function animateOut(node: HTMLElement): TransitionConfig {
        animations.enqueue(color, node);
        return {};
    }
</script>

<div
    in:animateIn
    out:animateOut
    class={[
        "z-(--offsetZ) relative aspect-square w-full rounded-full ring-2 ring-inset ring-neutral-400",
        {
            "bg-black": color === "black",
            "bg-white": color === "white",
        },
    ]}
></div>
