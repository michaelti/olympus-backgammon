<script lang="ts">
    import { BAR, OFF, START, type GameData, type Move, type Variant } from "olympus-bg";
    import Pip from "./Pip.svelte";
    import { canMoveFrom } from "./game-util";

    interface Props {
        data: GameData;
        variant: Variant;
        onClickPip?: (pip: number) => void;
        destinations: Map<number, Move[]> | null;
        moveFrom: number | null;
    }

    let { data, variant, onClickPip, destinations, moveFrom }: Props = $props();

    // [13, 14, 15, 16, 17, 18, BAR.black, 19, 20, 21, 22, 23, 24]
    // [12, 11, 10, 09, 08, 07, BAR.white, 06, 05, 04, 03, 02, 01]
    let pipLayout = [
        { col: 14, row: 2 }, // Pip 1
        { col: 13, row: 2 },
        { col: 12, row: 2 },
        { col: 11, row: 2 },
        { col: 10, row: 2 },
        { col: 9, row: 2 },
        { col: 7, row: 2 },
        { col: 6, row: 2 },
        { col: 5, row: 2 },
        { col: 4, row: 2 },
        { col: 3, row: 2 },
        { col: 2, row: 2 },
        { col: 2, row: 1 },
        { col: 3, row: 1 },
        { col: 4, row: 1 },
        { col: 5, row: 1 },
        { col: 6, row: 1 },
        { col: 7, row: 1 },
        { col: 9, row: 1 },
        { col: 10, row: 1 },
        { col: 11, row: 1 },
        { col: 12, row: 1 },
        { col: 13, row: 1 },
        { col: 14, row: 1 }, // Pip 25
    ];

    const getStackMode = (pipNum: number) => {
        if (variant === "Plakoto") {
            if (pipNum === START.black || pipNum === START.white) {
                return "3x5";
            }
        }

        return "normal";
    };
</script>

<div class="grid w-full max-w-xl grid-cols-15 gap-1">
    <!-- PIPS -->
    {#each data.pips.slice(1, 25) as pip, i (i)}
        {@const layout = pipLayout[i]}
        {@const pipNum = i + 1}
        <div style={`grid-column: ${layout.col}; grid-row: ${layout.row}`}>
            <Pip
                isPinned={pip.isPinned}
                owner={pip.owner}
                size={pip.size}
                pipNumber={pipNum}
                reverse={layout.row === 2}
                stackMode={getStackMode(pipNum)}
                onClick={onClickPip}
                highlight={destinations?.has(pipNum) || moveFrom === pipNum}
                interactive={destinations?.has(pipNum) || canMoveFrom(pipNum, data)}
            />
        </div>
    {/each}

    <!-- BAR -->
    <div style="grid-column: 8; grid-row: 2;">
        <Pip
            isPinned={data.pips[BAR.white].isPinned}
            owner={data.pips[BAR.white].owner}
            size={data.pips[BAR.white].size}
            pipNumber={BAR.white}
            reverse={false}
            onClick={onClickPip}
            highlight={moveFrom === BAR.white}
            interactive={canMoveFrom(BAR.white, data)}
        />
    </div>
    <div style="grid-column: 8; grid-row: 1;">
        <Pip
            isPinned={data.pips[BAR.black].isPinned}
            owner={data.pips[BAR.black].owner}
            size={data.pips[BAR.black].size}
            pipNumber={BAR.black}
            reverse={true}
            onClick={onClickPip}
            highlight={moveFrom === BAR.black}
            interactive={canMoveFrom(BAR.black, data)}
        />
    </div>

    <!-- OFF -->
    <!-- TODO:
          there is ambiguity about the pip number here
          it shouldn't matter because off and bar can't usually have checkers on at the same time? or can they?
          anyway, we should split this apart
        -->
    <!-- Also: watch out for Fevga -->
    <div style="grid-column: 15; grid-row: 1;">
        <Pip
            isPinned={false}
            owner="white"
            size={data.off.white}
            pipNumber={OFF.white}
            reverse={false}
            onClick={onClickPip}
            highlight={destinations?.has(OFF.white)}
            interactive={destinations?.has(OFF.white)}
            stackMode="3x5"
        />
    </div>
    <div style="grid-column: 15; grid-row: 2;">
        <Pip
            isPinned={false}
            owner="black"
            size={data.off.black}
            pipNumber={OFF.black}
            reverse={true}
            onClick={onClickPip}
            highlight={destinations?.has(OFF.black)}
            interactive={destinations?.has(OFF.black)}
            stackMode="3x5"
        />
    </div>

    <!-- Fake OFF -->
    <div style="grid-column: 1; grid-row: 1;" class="bg-stone-300"></div>
    <div style="grid-column: 1; grid-row: 2;" class="bg-stone-300"></div>
</div>
