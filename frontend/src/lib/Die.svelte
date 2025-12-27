<script lang="ts">
    interface Props {
        number: number;
    }

    const { number }: Props = $props();
</script>

<svg viewBox="0 0 24 24" width="24" height="24" fill="#000" class="h-6 w-6 rounded border">
    <title>{number}</title>

    <rect x="0" y="0" width="100%" height="100%" fill="#fff" />

    {#if number === 1}
        <circle cx="50%" cy="50%" r="10%" />
    {/if}

    {#if number === 2}
        <circle cx="25%" cy="25%" r="10%" />
        <circle cx="75%" cy="75%" r="10%" />
    {/if}

    {#if number === 3}
        <circle cx="25%" cy="25%" r="10%" />
        <circle cx="50%" cy="50%" r="10%" />
        <circle cx="75%" cy="75%" r="10%" />
    {/if}

    {#if number === 4}
        <circle cx="25%" cy="25%" r="10%" />
        <circle cx="75%" cy="25%" r="10%" />
        <circle cx="75%" cy="75%" r="10%" />
        <circle cx="25%" cy="75%" r="10%" />
    {/if}

    {#if number === 5}
        <circle cx="25%" cy="25%" r="10%" />
        <circle cx="75%" cy="25%" r="10%" />
        <circle cx="75%" cy="75%" r="10%" />
        <circle cx="25%" cy="75%" r="10%" />
        <circle cx="50%" cy="50%" r="10%" />
    {/if}

    {#if number === 6}
        <circle cx="25%" cy="25%" r="10%" />
        <circle cx="75%" cy="25%" r="10%" />
        <circle cx="25%" cy="50%" r="10%" />
        <circle cx="75%" cy="50%" r="10%" />
        <circle cx="75%" cy="75%" r="10%" />
        <circle cx="25%" cy="75%" r="10%" />
    {/if}
</svg>
