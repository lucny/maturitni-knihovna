<script lang="ts">
	import PublicFooter from '$lib/components/layout/public-footer.svelte';
	import PublicHeader from '$lib/components/layout/public-header.svelte';

	import type { LayoutData } from './$types';

	let { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props();
</script>

<div class="flex min-h-screen flex-col bg-[var(--color-background-muted)]">
	<PublicHeader user={data.user} />

	<main class="flex-1">
		{@render children()}
	</main>

	<PublicFooter />
</div>
