<script lang="ts">
    import type { Player } from "olympus-bg";
    import { BAR, OFF, otherPlayer } from "olympus-bg";
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

<div class="grid aspect-[1/6] w-full grid-cols-1 grid-rows-6 bg-stone-300" data-pip={pipNumber}>
    <!-- TEMP: debug -->
    <div class="absolute w-min">
        {pipNumber}<br />
        {pipNumber === BAR.black && owner === "black" ? "bar black" : ""}
        {pipNumber === BAR.white && owner === "white" ? "bar white" : ""}
        {pipNumber === OFF.black && owner === "black" ? "off black" : ""}
        {pipNumber === OFF.white && owner === "white" ? "off white" : ""}
    </div>

    {#each checkers as checker, i (checker + i)}
        <Checker color={checker} index={i} {pipNumber} {animationQueue} />
    {/each}
</div>
