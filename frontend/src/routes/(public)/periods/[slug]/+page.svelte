<script lang="ts">
	import { resolve } from '$app/paths';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function createBookHref(slug: string): `/books/${string}` {
		return `/books/${slug}`;
	}
</script>

<svelte:head>
	<title>{data.period?.seoTitle ?? 'Obdobi nenalezeno | Maturitni knihovna'}</title>
	<meta
		name="description"
		content={data.period?.seoDescription ?? 'Pozadovane literarni obdobi nebylo nalezeno.'}
	/>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-8">
	{#if data.loadError}
		<div class="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
			{data.loadError}
		</div>
	{:else if data.notFound || !data.period}
		<div class="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm">
			<p class="text-sm font-medium text-[var(--color-primary)]">Detail obdobi</p>
			<h1 class="mt-3 text-3xl font-bold text-[var(--color-secondary)]">Obdobi nenalezeno</h1>
			<p class="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-700">
				Pozadovane literarni obdobi neni dostupne ve verejnem katalogu.
			</p>
		</div>
	{:else}
		<article>
			<div class="max-w-4xl">
				<p class="text-sm font-medium text-[var(--color-primary)]">Literarni obdobi</p>
				<h1 class="mt-3 text-4xl font-bold text-[var(--color-secondary)]">
					{data.period.title}
				</h1>

				{#if data.period.yearRange}
					<p class="mt-4 text-base font-medium leading-7 text-slate-700">
						{data.period.yearRange}
					</p>
				{/if}

				{#if data.period.description}
					<p class="mt-6 whitespace-pre-wrap text-base leading-7 text-slate-700">
						{data.period.description}
					</p>
				{/if}
			</div>

			<div class="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
				<div class="space-y-8">
					{#if data.period.historicalContext}
						<section>
							<h2 class="text-3xl font-semibold text-[var(--color-secondary)]">
								Historicky kontext
							</h2>
							<p class="mt-4 max-w-4xl whitespace-pre-wrap text-base leading-7 text-slate-700">
								{data.period.historicalContext}
							</p>
						</section>
					{/if}

					{#if data.period.characteristics}
						<section>
							<h2 class="text-3xl font-semibold text-[var(--color-secondary)]">
								Charakteristika obdobi
							</h2>
							<p class="mt-4 max-w-4xl whitespace-pre-wrap text-base leading-7 text-slate-700">
								{data.period.characteristics}
							</p>
						</section>
					{/if}
				</div>

				<aside>
					<section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
						<h2 class="text-xl font-medium text-[var(--color-secondary)]">Knihy v obdobi</h2>

						{#if data.period.books.length === 0}
							<p class="mt-4 text-sm leading-6 text-slate-600">
								Pro toto obdobi zatim nejsou dostupne zadne publikovane knihy.
							</p>
						{:else}
							<ul class="mt-4 divide-y divide-slate-200">
								{#each data.period.books as book (book.id)}
									<li>
										<a
											href={resolve(createBookHref(book.slug))}
											class="block py-3 transition-colors hover:text-[var(--color-primary)]"
										>
											<span class="font-medium text-[var(--color-secondary)]">{book.title}</span>

											{#if book.publicationYear}
												<span class="ml-2 text-sm text-slate-600">{book.publicationYear}</span>
											{/if}
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</section>
				</aside>
			</div>
		</article>
	{/if}
</section>
