<script lang="ts">
    import DicesIcon from "@lucide/svelte/icons/dices";
    import { Fevga, Plakoto, Portes, pipsToString, type GameData, type Variant } from "olympus-bg";
    import GameTest from "$lib/GameTest.svelte";
    import { animations } from "$lib/animation.svelte";

    let game = new Portes({
        // TODO: it would be nice for this to default instead of required
        player: "white",
    });

    let data: GameData = $state({ ...game });

    let move: {
        from: number | null;
        to: number | null;
    } = $state({
        from: null,
        to: null,
    });

    const newGame = (variant: Variant) => {
        switch (variant) {
            case "Portes":
                game = new Portes({ player: "white" });
                break;
            case "Plakoto":
                game = new Plakoto({ player: "white" });
                break;
            case "Fevga":
                game = new Fevga({ player: "white" });
                break;
        }

        data = { ...game };
        move = { from: null, to: null };
    };

    const roll = () => {
        game.startTurn();
        data = { ...game };
    };

    const doMove = () => {
        if (move.from === null || move.to === null) {
            return;
        }

        game.doMove(move.from, move.to);

        const madeMove = game.moves.at(-1);
        // TODO: It would be helpful if doMove and undoMove returned the move they made/undid,
        // which would make the above unnecessary

        if (!madeMove) {
            console.log("Something went wrong. No move was made");
            return;
        }

        animations.enqueue(madeMove.from, madeMove.to);

        if (madeMove.sideEffect) {
            animations.enqueue(madeMove.sideEffect.from, madeMove.sideEffect.to);
        }

        move = { from: null, to: null };
        data = { ...game, pips: game.pips.map((pip) => ({ ...pip })) };
    };

    const undoMove = () => {
        const moveToUndo = game.moves.at(-1);
        // TODO: It would be helpful if doMove and undoMove returned the move they made/undid,
        // which would make the above unnecessary

        game.undoMove();

        if (moveToUndo) {
            animations.enqueue(moveToUndo.to, moveToUndo.from);

            if (moveToUndo.sideEffect) {
                animations.enqueue(moveToUndo.sideEffect.to, moveToUndo.sideEffect.from);
            }
        }

        data = { ...game };
    };

    const endTurn = () => {
        game.endTurn();
        data = { ...game };
    };

    const isMoveValid = () => {
        if (move.from === null || move.to === null) {
            return false;
        }

        console.log(data); // TODO: How to make these reactive?
        return game.isMoveValid(move.from, move.to);
    };

    const isTurnValid = () => {
        console.log(data); // TODO: How to make these reactive?
        const validity = game.getTurnValidity();
        return validity.valid;
    };
</script>

<div class="flex flex-col items-center gap-8 py-8">
    <h1 class="flex gap-1 text-lg font-bold">
        <DicesIcon aria-hidden="true" />
        Olympus Backgammon
    </h1>

    <div class="flex gap-2">
        <button
            onclick={() => newGame("Portes")}
            class="cursor-pointer rounded border border-stone-300 bg-white px-2"
        >
            New Portes
        </button>
        <button
            onclick={() => newGame("Plakoto")}
            class="cursor-pointer rounded border border-stone-300 bg-white px-2"
        >
            New Plakoto
        </button>
        <button
            onclick={() => newGame("Fevga")}
            class="cursor-pointer rounded border border-stone-300 bg-white px-2"
        >
            New Fevga
        </button>
    </div>

    <div
        class="flex h-40 w-full flex-col items-center gap-2 overflow-y-auto rounded bg-stone-200 p-4 text-sm"
    >
        <p>
            player: {data.player}
            | dice: {JSON.stringify(data.dice)}
            | moves: {JSON.stringify(data.moves)}
        </p>
        <p>
            off black: {data.off.black}
            | off white: {data.off.white}
        </p>
        <pre class="text-center">{pipsToString(data.pips)}</pre>
    </div>

    <div class="flex flex-wrap justify-center gap-2 px-2">
        <button
            onclick={roll}
            class="cursor-pointer rounded border border-stone-300 bg-white px-4 py-2 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500"
            disabled={!(!data.dice.length && !data.moves.length)}
        >
            Roll
        </button>
        <button
            onclick={undoMove}
            class="cursor-pointer rounded border border-stone-300 bg-white px-4 py-2 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500"
            disabled={!data.moves.length}
        >
            Undo
        </button>
        <input
            type="number"
            class="w-24 rounded border border-stone-300 bg-white px-4 py-2 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500"
            placeholder="From"
            disabled={!data.dice.length}
            pattern="[0-9]*"
            min="0"
            max="25"
            bind:value={move.from}
        />
        <input
            type="number"
            class="w-24 rounded border border-stone-300 bg-white px-4 py-2 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500"
            placeholder="To"
            disabled={!data.dice.length}
            pattern="[0-9]*"
            min="0"
            max="25"
            bind:value={move.to}
        />
        <button
            onclick={doMove}
            class="cursor-pointer rounded border border-stone-300 bg-white px-4 py-2 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500"
            disabled={!isMoveValid()}
        >
            Move
        </button>
        <button
            onclick={endTurn}
            class="cursor-pointer rounded border border-stone-300 bg-white px-4 py-2 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500"
            disabled={!isTurnValid()}
        >
            End turn
        </button>
    </div>

    <GameTest {data} />
</div>
