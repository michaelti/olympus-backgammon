<script lang="ts">
    import { BAR, OFF, type GameData } from "olympus-bg";
    import Pip from "./Pip.svelte";

    interface Props {
        data: GameData;
        onClickPip?: (pip: number) => void;
    }

    let { data, onClickPip }: Props = $props();

    let pipOrder = {
        default: [
            24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
        ],
        rotated: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13,
        ],
    };
</script>

<div class="grid w-full max-w-xl grid-cols-12 gap-2">
    <!-- PIPS -->
    {#each data.pips.slice(1, 25) as pip, i}
        {@const order = pipOrder.default[i]}
        <div style={`order: ${order}`}>
            <Pip
                isPinned={pip.isPinned}
                owner={pip.owner}
                size={pip.size}
                pipNumber={i + 1}
                reverse={order > 12}
                onClick={onClickPip}
            />
        </div>
    {/each}
</div>

<div class="grid w-full max-w-xl grid-cols-12 gap-2">
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
