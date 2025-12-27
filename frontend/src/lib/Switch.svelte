<script lang="ts">
    import { Switch, Label, type WithoutChildrenOrChild } from "bits-ui";

    interface Props extends WithoutChildrenOrChild<Switch.RootProps> {
        label: string;
    }

    let { checked = $bindable(false), label, ...rest }: Props = $props();

    let id = $props.id();
</script>

<div class="flex items-center gap-2">
    <Switch.Root
        {id}
        bind:checked
        name="example"
        class="flex h-6 w-12 cursor-pointer rounded-full bg-neutral-300 p-0.5 transition-colors data-[state=checked]:bg-green-600"
        {...rest}
    >
        <Switch.Thumb
            class="h-5 w-6 rounded-full bg-white transition-transform data-[state=checked]:translate-x-5"
        />
    </Switch.Root>

    <Label.Root for={id}>
        {label}
    </Label.Root>
</div>
