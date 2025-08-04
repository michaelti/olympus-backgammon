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
        onClick?: (pip: number) => void;
    }

    let { isPinned, owner, size, pipNumber, reverse, onClick }: Props = $props();

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

    const stackingOrder = {
        normal: [
            { y: 0, z: 1 },
            { y: 1, z: 1 },
            { y: 2, z: 1 },
            { y: 3, z: 1 },
            { y: 4, z: 1 },
            { y: 5, z: 1 },
            { y: 4.5, z: 2 },
            { y: 3.5, z: 2 },
            { y: 2.5, z: 2 },
            { y: 1.5, z: 2 },
            { y: 0.5, z: 2 },
            { y: 4, z: 3 },
            { y: 3, z: 3 },
            { y: 2, z: 3 },
            { y: 1, z: 3 },
        ],
        start: [
            { y: 0, z: 1 },
            { y: 1, z: 1 },
            { y: 2, z: 1 },
            { y: 0, z: 2 },
            { y: 1, z: 2 },
            { y: 2, z: 2 },
            { y: 0, z: 3 },
            { y: 1, z: 3 },
            { y: 2, z: 3 },
            { y: 0, z: 4 },
            { y: 1, z: 4 },
            { y: 2, z: 4 },
            { y: 0, z: 5 },
            { y: 1, z: 5 },
            { y: 2, z: 5 },
        ],
    };

    // TODO: logic to switch this for Fevga/Plakoto start
    const offsets = stackingOrder.normal;

    const handleClick = () => {
        onClick?.(pipNumber);
    };
</script>

<button class={["relative aspect-[1/6] w-full bg-stone-300"]} onclick={handleClick}>
    {#each checkers as checker, i (checker + i)}
        <div
            class={[
                "absolute aspect-square w-full",
                { "top-(--offset)": !reverse },
                { "bottom-(--offset)": reverse },
            ]}
            style={`--offset: calc(${offsets[i].y * (1 / 6) * 100}% + ${reverse ? offsets[i].z - 1 : 1 - offsets[i].z} * 2%)`}
        >
            <Checker color={checker} index={i} {pipNumber} --offsetZ={offsets[i].z} />
        </div>
    {/each}

    <!-- TEMP: debug pip numbers -->
    <div class="absolute top-0 w-min text-gray-500">
        {pipNumber}<br />
        {pipNumber === BAR.black && owner === "black" ? "bar black" : ""}
        {pipNumber === BAR.white && owner === "white" ? "bar white" : ""}
        {pipNumber === OFF.black && owner === "black" ? "off black" : ""}
        {pipNumber === OFF.white && owner === "white" ? "off white" : ""}
    </div>
</button>
