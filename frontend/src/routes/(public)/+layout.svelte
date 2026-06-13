<script lang="ts">
	import PublicFooter from '$lib/components/layout/public-footer.svelte';
	import PublicHeader from '$lib/components/layout/public-header.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col bg-[var(--color-background-muted)]">
	<PublicHeader />

	<main class="flex-1">
		{@render children()}
	</main>

	<PublicFooter />
</div>
