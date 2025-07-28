<script lang="ts">
    import type { Player } from "olympus-bg";
    import { otherPlayer } from "olympus-bg";
    import type { AnimationQueue } from "../routes/+page.svelte";
    import Checker from "./Checker.svelte";

    interface Props {
        isPinned: boolean;
        owner: Player;
        size: number;
        animationQueue: AnimationQueue;
        pipNumber: number;
    }

    let { isPinned, owner, size, animationQueue, pipNumber }: Props = $props();

    let checkers: Player[] = $derived.by(() => {
        if (owner === "neither") {
            return [];
        }

        return Array.from({ length: size }, (_, i) => {
            let color = owner;

            if (isPinned && i === 0) {
                color = otherPlayer(owner);
            }

            return color;
        });
    });
</script>

<div class="grid aspect-[1/6] w-full grid-cols-1 grid-rows-6 bg-red-600" data-pip={pipNumber}>
    {#each checkers as checker, i (checker + i)}
        <Checker color={checker} index={i} {pipNumber} {animationQueue} />
    {/each}
</div>
