<script lang="ts">
	import BookCard from '$lib/components/domain/book-card.svelte';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Knihy | Maturitni knihovna</title>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-8">
	<div class="max-w-3xl">
		<p class="text-sm font-medium text-[var(--color-primary)]">Katalog</p>
		<h1 class="mt-3 text-3xl font-bold text-[var(--color-secondary)]">Knihy</h1>
		<p class="mt-4 text-base leading-7 text-slate-700">
			Verejny katalog literarnich del pripravenych pro maturitni studium.
		</p>
	</div>

	{#if data.loadError}
		<div class="mt-10 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
			{data.loadError}
		</div>
	{:else if data.books.length === 0}
		<div class="mt-10 rounded-xl border border-slate-200 bg-white px-5 py-8 text-center shadow-sm">
			<h2 class="text-xl font-medium text-[var(--color-secondary)]">Zadne knihy k zobrazeni</h2>
			<p class="mt-3 text-sm leading-6 text-slate-600">
				Katalog zatim neobsahuje zadne publikovane knihy.
			</p>
		</div>
	{:else}
		<div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each data.books as book (book.id)}
				<BookCard {book} />
			{/each}
		</div>
	{/if}
</section>
