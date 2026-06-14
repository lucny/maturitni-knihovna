<script lang="ts">
	import { resolve } from '$app/paths';

	import type { ActionData } from './$types';
	import type { PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | undefined } = $props();
</script>

<svelte:head>
	<title>{data.book?.seoTitle ?? 'Kniha nenalezena | Maturitni knihovna'}</title>
	<meta
		name="description"
		content={data.book?.seoDescription ?? 'Pozadovana kniha nebyla v katalogu nalezena.'}
	/>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-8">
	{#if data.loadError}
		<div class="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
			{data.loadError}
		</div>
	{:else if data.notFound || !data.book}
		<div class="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm">
			<p class="text-sm font-medium text-[var(--color-primary)]">Detail knihy</p>
			<h1 class="mt-3 text-3xl font-bold text-[var(--color-secondary)]">Kniha nenalezena</h1>
			<p class="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-700">
				Pozadovana kniha neni dostupna ve verejnem katalogu.
			</p>
		</div>
	{:else}
		<article class="grid gap-10 lg:grid-cols-[280px_1fr]">
			<aside>
				<div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
					<div class="aspect-[2/3] bg-slate-100">
						{#if data.book.coverUrl}
							<img
								src={data.book.coverUrl}
								alt={`Obalka knihy ${data.book.title}`}
								loading="eager"
								decoding="async"
								fetchpriority="high"
								width="400"
								height="600"
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
				</div>

				<dl
					class="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-5 text-sm shadow-sm"
				>
					<div>
						<dt class="font-medium text-[var(--color-secondary)]">Autor</dt>
						<dd class="mt-1 text-slate-700">{data.book.authorName}</dd>
					</div>

					{#if data.book.publicationYear}
						<div>
							<dt class="font-medium text-[var(--color-secondary)]">Rok vydani</dt>
							<dd class="mt-1 text-slate-700">{data.book.publicationYear}</dd>
						</div>
					{/if}

					{#if data.book.literaryPeriodTitle}
						<div>
							<dt class="font-medium text-[var(--color-secondary)]">Literarni obdobi</dt>
							<dd class="mt-1 text-slate-700">{data.book.literaryPeriodTitle}</dd>
						</div>
					{/if}
				</dl>
			</aside>

			<div>
				<p class="text-sm font-medium text-[var(--color-primary)]">Detail knihy</p>
				<h1 class="mt-3 text-4xl font-bold text-[var(--color-secondary)]">{data.book.title}</h1>
				<p class="mt-4 text-base leading-7 text-slate-700">{data.book.authorName}</p>

				<div class="mt-6">
					{#if form?.message}
						<div
							class="mb-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700"
						>
							{form.message}
						</div>
					{/if}

					{#if data.book.canManageFavorite}
						{#if data.book.isFavorite}
							<form method="POST" action="?/removeFavorite">
								<button
									type="submit"
									class="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:outline-none"
								>
									Odebrat z oblibenych
								</button>
							</form>
						{:else}
							<form method="POST" action="?/addFavorite">
								<button
									type="submit"
									class="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none"
								>
									Pridat do oblibenych
								</button>
							</form>
						{/if}
					{:else}
						<a
							href={resolve('/login')}
							class="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
						>
							Prihlasit se pro ulozeni do oblibenych
						</a>
					{/if}
				</div>

				{#if data.book.genreTitles.length > 0}
					<div class="mt-6 flex flex-wrap gap-2">
						{#each data.book.genreTitles as genreTitle (genreTitle)}
							<span
								class="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
							>
								{genreTitle}
							</span>
						{/each}
					</div>
				{/if}

				<div class="mt-10 space-y-8">
					{#if data.book.annotation}
						<section>
							<h2 class="text-3xl font-semibold text-[var(--color-secondary)]">Anotace</h2>
							<p class="mt-4 max-w-4xl whitespace-pre-wrap text-base leading-7 text-slate-700">
								{data.book.annotation}
							</p>
						</section>
					{/if}

					{#if data.book.contentSummary}
						<section>
							<h2 class="text-3xl font-semibold text-[var(--color-secondary)]">Obsah dila</h2>
							<p class="mt-4 max-w-4xl whitespace-pre-wrap text-base leading-7 text-slate-700">
								{data.book.contentSummary}
							</p>
						</section>
					{/if}

					{#if data.book.interpretation}
						<section>
							<h2 class="text-3xl font-semibold text-[var(--color-secondary)]">Interpretace</h2>
							<p class="mt-4 max-w-4xl whitespace-pre-wrap text-base leading-7 text-slate-700">
								{data.book.interpretation}
							</p>
						</section>
					{/if}
				</div>
			</div>
		</article>
	{/if}
</section>
