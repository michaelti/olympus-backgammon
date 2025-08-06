<script lang="ts">
    import { BAR, OFF, type GameData, type Move } from "olympus-bg";
    import Pip from "./Pip.svelte";
    import { canMoveFrom } from "./game-util";

    interface Props {
        data: GameData;
        onClickPip?: (pip: number) => void;
        destinations: Map<number, Move[]> | null;
        move: {
            from: number | null;
            to: number | null;
        };
    }

    let { data, onClickPip, destinations, move }: Props = $props();

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
                highlight={destinations?.has(i + 1) || move.from === i + 1}
                interactive={destinations?.has(i + 1) || canMoveFrom(i + 1, data)}
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
        reverse={false}
        onClick={onClickPip}
        highlight={destinations?.has(BAR.white) || move.from === BAR.white}
        interactive={destinations?.has(BAR.white) || canMoveFrom(BAR.white, data)}
    />
    <Pip
        isPinned={data.pips[BAR.black].isPinned}
        owner={data.pips[BAR.black].owner}
        size={data.pips[BAR.black].size}
        pipNumber={BAR.black}
        reverse={false}
        onClick={onClickPip}
        highlight={destinations?.has(BAR.black) || move.from === BAR.black}
        interactive={destinations?.has(BAR.black) || canMoveFrom(BAR.black, data)}
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
