<script lang="ts">
    import type { GameData } from "olympus-bg";
    import { cubicOut } from "svelte/easing";
    import type { AnimationState } from "../routes/+page.svelte";

    interface Props {
        data: GameData;
        animationState: AnimationState;
    }

    let { data, animationState }: Props = $props();

    // Pips without 0 and 25 (bar)
    let pips = $derived(data.pips.slice(1, 25));

    function animate(node: HTMLElement, params: {}) {
        const { x, y } = node.getBoundingClientRect();

        if (animationState.status !== "start") {
            console.log("No animation: status is not start");
            return {};
        }

        const dataCheckerPip = node.getAttribute("data-checker-pip");
        if (!dataCheckerPip) {
            console.log("No animation: dataCheckerPip is missing");
            return {};
        }

        const whereFrom = animationState.pairs.get(Number(dataCheckerPip));

        if (whereFrom === undefined) {
            console.log("No animation: whereFrom is undefined");
            return {};
        }

        const fromSnapshot = animationState.pipSnapshot.get(whereFrom);

        if (!fromSnapshot) {
            console.error("No animation: fromSnapshot is undefined");
            return {};
        }

        // TODO: account for scale
        // TODO: account for rotation by making these relative to center of the board?
        const diffX = fromSnapshot.x - x;
        const diffY = fromSnapshot.y - y;

        return {
            delay: 0,
            duration: 5000,
            easing: cubicOut,
            css: (t: number, u: number) =>
                `transform: translateX(${diffX * u}px) translateY(${diffY * u}px)`,
        };
    }
</script>

<div class="grid w-full max-w-xl grid-cols-12 gap-2">
    {#each pips as pip, i}
        <div class="grid aspect-[1/6] w-full grid-cols-1 grid-rows-6 bg-red-600" data-pip={i + 1}>
            {#each { length: pip.size } as foo, j (j + pip.owner)}
                <div
                    in:animate={{}}
                    data-checker={j + 1}
                    data-checker-pip={i + 1}
                    class={[
                        "aspect-square w-full rounded-full shadow",
                        {
                            "bg-black": pip.owner === "black",
                            "bg-white": pip.owner === "white",
                        },
                        {
                            // Temp fix for pips becoming way too long
                            "col-start-1 row-start-1": j % 6 === 0,
                            "col-start-1 row-start-2": j % 6 === 1,
                            "col-start-1 row-start-3": j % 6 === 2,
                            "col-start-1 row-start-4": j % 6 === 3,
                            "col-start-1 row-start-5": j % 6 === 4,
                            "col-start-1 row-start-6": j % 6 === 5,
                        },
                    ]}
                ></div>
            {/each}
        </div>
    {/each}

    <!-- BAR -->
    <div class="grid aspect-[1/6] min-h-32 w-full grid-rows-6 bg-blue-600" data-pip={0}>
        {#each { length: data.pips[0].size }, j}
            <div
                in:animate={{}}
                data-checker={j + 1}
                data-checker-pip={0}
                class={[
                    "aspect-square w-full rounded-full shadow",
                    {
                        "bg-black": data.pips[0].owner === "black",
                        "bg-white": data.pips[0].owner === "white",
                    },
                ]}
            ></div>
        {/each}
    </div>
    <div class="grid aspect-[1/6] min-h-32 w-full grid-rows-6 bg-blue-600" data-pip={25}>
        {#each { length: data.pips[25].size }, j}
            <div
                in:animate={{}}
                data-checker={j + 1}
                data-checker-pip={25}
                class={[
                    "aspect-square w-full rounded-full shadow",
                    {
                        "bg-black": data.pips[25].owner === "black",
                        "bg-white": data.pips[25].owner === "white",
                    },
                ]}
            ></div>
        {/each}
    </div>

    <!-- OFF -->
    <!-- TODO:
      there is ambiguity about the pip number here
      it shouldn't matter because off and bar can't usually have checkers on at the same time? or can they?
      anyway, we should split this apart
    -->
    <div class="grid aspect-[1/6] min-h-32 w-full grid-rows-6 bg-green-600" data-pip={0}>
        {#each { length: data.off.black }, j}
            <div
                in:animate={{}}
                data-checker={j + 1}
                data-checker-pip={0}
                class={["aspect-square w-full rounded-full shadow", { "bg-black": true }]}
            ></div>
        {/each}
    </div>
    <div class="grid aspect-[1/6] min-h-32 w-full grid-rows-6 bg-green-600" data-pip={25}>
        {#each { length: data.off.white }, j}
            <div
                in:animate={{}}
                data-checker={j + 1}
                data-checker-pip={25}
                class={["aspect-square w-full rounded-full shadow", { "bg-white": true }]}
            ></div>
        {/each}
    </div>
</div>
