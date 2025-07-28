<script lang="ts">
    import type { GameData } from "olympus-bg";
    import type { AnimationQueue } from "../routes/+page.svelte";
    import Pip from "./Pip.svelte";

    interface Props {
        data: GameData;
        animationQueue: AnimationQueue;
    }

    let { data, animationQueue }: Props = $props();
</script>

<div class="grid w-full max-w-xl grid-cols-12 gap-2">
    <!-- PIPS -->
    {#each data.pips.slice(1, 25) as pip, i}
        <Pip
            isPinned={pip.isPinned}
            owner={pip.owner}
            size={pip.size}
            pipNumber={i + 1}
            {animationQueue}
        />
    {/each}

    <!-- BAR -->
    Bar white:
    <Pip
        isPinned={data.pips[0].isPinned}
        owner={data.pips[0].owner}
        size={data.pips[0].size}
        pipNumber={0}
        {animationQueue}
    />
    Bar black:
    <Pip
        isPinned={data.pips[25].isPinned}
        owner={data.pips[25].owner}
        size={data.pips[25].size}
        pipNumber={25}
        {animationQueue}
    />

    <!-- OFF -->
    <!-- TODO:
      there is ambiguity about the pip number here
      it shouldn't matter because off and bar can't usually have checkers on at the same time? or can they?
      anyway, we should split this apart
    -->
    Off white:
    <Pip isPinned={false} owner={"white"} size={data.off.white} pipNumber={25} {animationQueue} />
    Off black:
    <Pip isPinned={false} owner={"black"} size={data.off.black} pipNumber={0} {animationQueue} />
</div>
