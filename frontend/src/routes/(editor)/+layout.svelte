<script lang="ts">
	import type { Snippet } from 'svelte';

	import EditorShell from '$lib/components/layout/editor-shell.svelte';

	import type { LayoutData } from './$types';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<EditorShell user={data.user}>
	{@render children()}
</EditorShell>
