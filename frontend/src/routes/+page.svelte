<script lang="ts">
    import DicesIcon from "@lucide/svelte/icons/dices";
    import { Fevga, Plakoto, Portes, type GameData, type Variant } from "olympus-bg";
    import Board from "$lib/Board.svelte";
    import { canMoveFrom, getDestinations } from "$lib/game-util";

    let game = new Portes({
        player: "white",
    });

    let data: GameData = $state({ ...game });
    let gameVariant: Variant = $state("Portes");

    let move: {
        from: number | null;
        to: number | null;
    } = $state({
        from: null,
        to: null,
    });

    let destinations = $derived(move.from !== null ? getDestinations(move.from, game) : null);

    let turnValidity = $state(game.getTurnValidity());

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
        gameVariant = variant;
        move = { from: null, to: null };
        turnValidity = game.getTurnValidity();
    };

    const roll = () => {
        game.startTurn();
        data = { ...game };
        turnValidity = game.getTurnValidity();
    };

    const doMove = () => {
        if (move.from === null || move.to === null) {
            return;
        }

        game.doMove(move.from, move.to);

        move = { from: null, to: null };
        data = { ...game, pips: game.pips.map((pip) => ({ ...pip })) };
        turnValidity = game.getTurnValidity();
    };

    const undoMove = () => {
        game.undoMove();

        data = { ...game, pips: game.pips.map((pip) => ({ ...pip })) };
        turnValidity = game.getTurnValidity();
    };

    const endTurn = () => {
        game.endTurn();
        data = { ...game };
        turnValidity = game.getTurnValidity();
    };

    const handleClickPip = (pip: number) => {
        if (move.from !== null) {
            if (game.isMoveValid(move.from, pip)) {
                move.to = pip;
                doMove();
            } else if (destinations?.has(pip)) {
                const moves = destinations.get(pip) ?? [];
                // TODO: sort larger move first
                for (const currentMove of moves) {
                    move.from = currentMove.from;
                    move.to = currentMove.to;
                    doMove();
                }
            } else if (canMoveFrom(pip, data)) {
                move.from = pip;
            } else {
                move.from = null;
            }
        } else {
            if (canMoveFrom(pip, data)) {
                move.from = pip;
            } else {
                move.from = null;
            }
        }
    };
</script>

<div class="flex touch-manipulation flex-col items-center gap-8 py-8">
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

    <div class="flex flex-wrap justify-center gap-2 px-2">
        <button
            onclick={roll}
            class="w-24 cursor-pointer rounded border border-stone-300 bg-white px-4 py-2 aria-disabled:cursor-not-allowed aria-disabled:bg-stone-200 aria-disabled:text-stone-500"
            aria-disabled={!(!data.dice.length && !data.moves.length)}
        >
            {data.dice.length > 0 ? data.dice : "Roll"}
        </button>
        <button
            onclick={undoMove}
            class="w-24 cursor-pointer rounded border border-stone-300 bg-white px-4 py-2 aria-disabled:cursor-not-allowed aria-disabled:bg-stone-200 aria-disabled:text-stone-500"
            aria-disabled={!data.moves.length}
        >
            Undo
        </button>

        <button
            onclick={endTurn}
            class="w-24 cursor-pointer rounded border border-stone-300 bg-white px-4 py-2 aria-disabled:cursor-not-allowed aria-disabled:bg-stone-200 aria-disabled:text-stone-500"
            aria-disabled={!turnValidity.valid}
        >
            Finish
        </button>
    </div>

    <Board {data} onClickPip={handleClickPip} {destinations} {move} variant={gameVariant} />
</div>
