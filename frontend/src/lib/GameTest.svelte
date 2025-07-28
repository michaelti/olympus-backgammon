<script lang="ts">
    import { BAR, OFF, type GameData } from "olympus-bg";
    import Pip from "./Pip.svelte";

    interface Props {
        data: GameData;
    }

    let { data }: Props = $props();
</script>

<div class="grid w-full max-w-xl grid-cols-12 gap-2">
    <!-- PIPS -->
    {#each data.pips.slice(1, 25) as pip, i}
        <Pip isPinned={pip.isPinned} owner={pip.owner} size={pip.size} pipNumber={i + 1} />
    {/each}

    <!-- BAR -->
    <Pip
        isPinned={data.pips[BAR.white].isPinned}
        owner={data.pips[BAR.white].owner}
        size={data.pips[BAR.white].size}
        pipNumber={BAR.white}
    />
    <Pip
        isPinned={data.pips[BAR.black].isPinned}
        owner={data.pips[BAR.black].owner}
        size={data.pips[BAR.black].size}
        pipNumber={BAR.black}
    />

    <!-- OFF -->
    <!-- TODO:
      there is ambiguity about the pip number here
      it shouldn't matter because off and bar can't usually have checkers on at the same time? or can they?
      anyway, we should split this apart
    -->
    <!-- Also: watch out for Fevga -->
    <Pip isPinned={false} owner={"white"} size={data.off.white} pipNumber={OFF.white} />
    <Pip isPinned={false} owner={"black"} size={data.off.black} pipNumber={OFF.black} />
</div>
