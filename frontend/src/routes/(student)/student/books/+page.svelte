<script lang="ts">
	import { resolve } from '$app/paths';

	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | undefined } = $props();
</script>

<svelte:head>
	<title>Moje knihy | Maturitni knihovna</title>
	<meta name="description" content="Oblibene knihy prihlaseneho studenta." />
</svelte:head>

<section class="space-y-6">
	<div class="max-w-3xl space-y-2">
		<p class="text-sm font-semibold tracking-wide text-[var(--color-primary)] uppercase">
			Moje knihy
		</p>
		<h1 class="text-3xl font-semibold text-slate-950">Oblibene knihy</h1>
		<p class="text-base leading-7 text-slate-700">
			{data.user.displayName}, zde najdete knihy ulozene do vaseho osobniho seznamu.
		</p>
	</div>

	{#if data.loadError}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
			{data.loadError}
		</div>
	{/if}

	{#if form?.message}
		<div class="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
			{form.message}
		</div>
	{/if}

	{#if data.favoriteBooks.length > 0}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.favoriteBooks as book (book.favoriteId)}
				<article class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
					<a href={resolve(`/books/${book.slug}`)} class="block">
						<div class="aspect-[2/3] bg-slate-100">
							{#if book.coverUrl}
								<img
									src={book.coverUrl}
									alt={`Obalka knihy ${book.title}`}
									class="h-full w-full object-cover"
								/>
							{:else}
								<div
									class="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500"
								>
									Obalka neni k dispozici
								</div>
							{/if}
						</div>
					</a>
					<div class="space-y-4 p-4">
						<a
							href={resolve(`/books/${book.slug}`)}
							class="block text-lg font-semibold text-slate-950 hover:text-[var(--color-primary)]"
						>
							{book.title}
						</a>
						<form method="POST" action="?/remove">
							<input type="hidden" name="favoriteId" value={book.favoriteId} />
							<button
								type="submit"
								class="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:outline-none"
							>
								Odebrat z oblibenych
							</button>
						</form>
					</div>
				</article>
			{/each}
		</div>
	{:else if !data.loadError}
		<div class="rounded-lg border border-dashed border-slate-300 bg-white p-8">
			<p class="text-sm font-medium text-slate-700">Zatim nemate zadne oblibene knihy.</p>
			<p class="mt-2 text-sm leading-6 text-slate-600">
				Knihu pridate do oblibenych z jejiho verejneho detailu.
			</p>
		</div>
	{/if}
</section>
