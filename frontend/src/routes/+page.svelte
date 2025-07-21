<script>
    import DicesIcon from "@lucide/svelte/icons/dices";
    import { Tavli } from "olympus-bg";

    const tavli = new Tavli();
    const display = () => JSON.stringify(tavli, null, 4);

    let string = $state(display());

    const start = () => {
        tavli.pickVariant("Portes");
        string = display();
    };

    const startRollB = () => {
        tavli.rollToStart("black");
        string = display();
    };
</script>

<div class="flex min-h-dvh flex-col items-center justify-center gap-8">
    <h1 class="flex gap-1 text-lg font-bold">
        <DicesIcon aria-hidden="true" />
        Olympus Backgammon
    </h1>

    <div class="flex w-full justify-center overflow-y-auto rounded bg-stone-200 p-4 text-sm">
        <pre>{string}</pre>
    </div>

    <div>
        <button onclick={start} class="cursor-pointer rounded border border-stone-300 px-4 py-2">
            Start game
        </button>
        <button
            onclick={startRollB}
            class="cursor-pointer rounded border border-stone-300 px-4 py-2"
        >
            Roll B
        </button>
    </div>
</div>
