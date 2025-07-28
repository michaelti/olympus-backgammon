<script lang="ts">
    import type { Player } from "olympus-bg";
    import { cubicOut } from "svelte/easing";
    import type { TransitionConfig } from "svelte/transition";
    import { animations } from "./animation.svelte";

    interface Props {
        pipNumber: number;
        color: Player;
        index: number;
    }

    let { pipNumber, color, index }: Props = $props();

    function animate(node: HTMLElement, params: { pip: number }): TransitionConfig {
        const from = animations.dequeue(params.pip);

        if (!from) {
            console.warn(`Pip ${params.pip}: No animation in queue for pip`);
            return {};
        }

        const { x, y } = node.getBoundingClientRect();

        // TODO: account for scale
        // TODO: account for rotation by making these relative to center of the board?
        const diffX = from.x - x;
        const diffY = from.y - y;

        return {
            // TODO: move delay and duration to the queue.
            // Then we can do funky stuff.
            delay: 0,
            duration: 250,
            easing: cubicOut,
            css: (_t, u) => `transform: translateX(${diffX * u}px) translateY(${diffY * u}px)`,
        };
    }
</script>

<!-- TODO: why doesn't {#key} work here instead of in the Pip each? -->
<div
    in:animate={{ pip: pipNumber }}
    data-checker
    class={[
        "aspect-square w-full rounded-full shadow",
        {
            "bg-black": color === "black",
            "bg-white": color === "white",
        },
        {
            // Temp fix for pips becoming way too long
            "col-start-1 row-start-1": index % 6 === 0,
            "col-start-1 row-start-2": index % 6 === 1,
            "col-start-1 row-start-3": index % 6 === 2,
            "col-start-1 row-start-4": index % 6 === 3,
            "col-start-1 row-start-5": index % 6 === 4,
            "col-start-1 row-start-6": index % 6 === 5,
        },
    ]}
></div>
