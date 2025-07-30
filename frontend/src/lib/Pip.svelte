<script lang="ts">
    import type { Player, PlayerBW } from "olympus-bg";
    import { BAR, OFF, otherPlayer } from "olympus-bg";
    import Checker from "./Checker.svelte";

    interface Props {
        isPinned: boolean;
        owner: Player;
        size: number;
        pipNumber: number;
        reverse?: boolean;
    }

    let { isPinned, owner, size, pipNumber, reverse }: Props = $props();

    let checkers: PlayerBW[] = $derived.by(() => {
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

<div
    class={[
        "flex aspect-[1/6] w-full bg-stone-300",
        { "flex-col": !reverse },
        { "flex-col-reverse": reverse },
    ]}
    data-pip={pipNumber}
>
    <!-- TEMP: debug -->
    <div class="absolute w-min text-gray-500">
        {pipNumber}<br />
        {pipNumber === BAR.black && owner === "black" ? "bar black" : ""}
        {pipNumber === BAR.white && owner === "white" ? "bar white" : ""}
        {pipNumber === OFF.black && owner === "black" ? "off black" : ""}
        {pipNumber === OFF.white && owner === "white" ? "off white" : ""}
    </div>

    {#each checkers as checker, i (checker + i)}
        <div
            class={[
                "relative",
                {
                    "top-[8.33%] -mt-[200%]": i >= 6 && !reverse,
                    "top-[83.33%]!": i >= 11 && !reverse,
                    "bottom-[8.33%] -mb-[200%]": i >= 6 && reverse,
                    "bottom-[83.33%]!": i >= 11 && reverse,
                },
            ]}
        >
            <Checker color={checker} index={i} {pipNumber} />
        </div>
    {/each}
</div>
