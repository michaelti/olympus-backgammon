<script lang="ts">
    import Die from "./Die.svelte";

    interface Props {
        numbers: number[];
    }

    const { numbers }: Props = $props();
</script>

<div class="flex gap-1 *:shrink-0">
    {#each numbers as number, i (i)}
        <Die {number} />
    {/each}
</div>
