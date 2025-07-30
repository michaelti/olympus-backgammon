<script lang="ts">
    import type { PlayerBW } from "olympus-bg";
    import { cubicOut } from "svelte/easing";
    import type { TransitionConfig } from "svelte/transition";
    import { animations } from "./animation.svelte";

    interface Props {
        pipNumber: number;
        color: PlayerBW;
        index: number;
    }

    let { pipNumber, color, index }: Props = $props();

    function animate(node: HTMLElement): TransitionConfig {
        const { from, delay, duration } = animations.dequeue(color);

        if (!from) {
            console.warn(`Pip ${pipNumber}: No animation in queue for pip`);
            return {};
        }

        const { x, y } = node.getBoundingClientRect();

        // TODO: account for scale
        // TODO: account for rotation by making these relative to center of the board?
        const diffX = from.x - x;
        const diffY = from.y - y;

        const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

        return {
            // TODO: move delay and duration to the queue.
            // Then we can do funky stuff.
            delay,
            duration,
            easing: cubicOut,
            css: (_t, u) => `
                transform: translateX(${diffX * u}px) translateY(${diffY * u}px);
                z-index: ${u > 0.5 ? from.index : index};
            `,
        };
    }

    function snapshot(node: HTMLElement): TransitionConfig {
        animations.enqueue(color, index, node);
        return {};
    }
</script>

<!-- TODO: why doesn't {#key} work here instead of in the Pip each? -->
<div
    in:animate
    out:snapshot
    style={`z-index:${index}`}
    class={[
        "relative aspect-square w-full rounded-full border-b-2 ring-2 ring-inset backdrop-blur",
        {
            "border-b-neutral-800 bg-black/80 ring-neutral-400": color === "black",
            "border-b-neutral-400 bg-white/80 ring-neutral-400": color === "white",
        },
    ]}
>
    <!-- TEMP: debug -->
    <div class="flex h-full items-center justify-center text-xs text-gray-400">
        {pipNumber}.{index}
    </div>
</div>
