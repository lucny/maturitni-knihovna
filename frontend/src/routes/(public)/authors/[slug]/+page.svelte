<script lang="ts">
	import { resolve } from '$app/paths';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function createBookHref(slug: string): `/books/${string}` {
		return `/books/${slug}`;
	}
</script>

<svelte:head>
	<title>{data.author?.seoTitle ?? 'Autor nenalezen | Maturitni knihovna'}</title>
	<meta
		name="description"
		content={data.author?.seoDescription ?? 'Pozadovany autor nebyl v katalogu nalezen.'}
	/>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-8">
	{#if data.loadError}
		<div class="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
			{data.loadError}
		</div>
	{:else if data.notFound || !data.author}
		<div class="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm">
			<p class="text-sm font-medium text-[var(--color-primary)]">Detail autora</p>
			<h1 class="mt-3 text-3xl font-bold text-[var(--color-secondary)]">Autor nenalezen</h1>
			<p class="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-700">
				Pozadovany autor neni dostupny ve verejnem katalogu.
			</p>
		</div>
	{:else}
		<article class="grid gap-10 lg:grid-cols-[280px_1fr]">
			<aside>
				<div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
					<div class="aspect-[4/3] bg-slate-100">
						{#if data.author.portraitUrl}
							<img
								src={data.author.portraitUrl}
								alt={`Portret autora ${data.author.fullName}`}
								loading="eager"
								decoding="async"
								fetchpriority="high"
								width="400"
								height="300"
								class="h-full w-full object-cover"
							/>
						{:else}
							<div
								class="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500"
							>
								Portret neni k dispozici
							</div>
						{/if}
					</div>
				</div>

				<dl
					class="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-5 text-sm shadow-sm"
				>
					{#if data.author.nationality}
						<div>
							<dt class="font-medium text-[var(--color-secondary)]">Narodnost</dt>
							<dd class="mt-1 text-slate-700">{data.author.nationality}</dd>
						</div>
					{/if}

					{#if data.author.lifeYears}
						<div>
							<dt class="font-medium text-[var(--color-secondary)]">Roky zivota</dt>
							<dd class="mt-1 text-slate-700">{data.author.lifeYears}</dd>
						</div>
					{/if}

					{#if data.author.occupation}
						<div>
							<dt class="font-medium text-[var(--color-secondary)]">Zamereni</dt>
							<dd class="mt-1 text-slate-700">{data.author.occupation}</dd>
						</div>
					{/if}
				</dl>
			</aside>

			<div>
				<p class="text-sm font-medium text-[var(--color-primary)]">Detail autora</p>
				<h1 class="mt-3 text-4xl font-bold text-[var(--color-secondary)]">
					{data.author.fullName}
				</h1>

				{#if data.author.biography}
					<section class="mt-10">
						<h2 class="text-3xl font-semibold text-[var(--color-secondary)]">Zivotopis</h2>
						<p class="mt-4 max-w-4xl whitespace-pre-wrap text-base leading-7 text-slate-700">
							{data.author.biography}
						</p>
					</section>
				{/if}

				<section class="mt-10">
					<h2 class="text-3xl font-semibold text-[var(--color-secondary)]">Knihy autora</h2>

					{#if data.author.books.length === 0}
						<p class="mt-4 text-base leading-7 text-slate-700">
							Pro tohoto autora zatim nejsou dostupne zadne publikovane knihy.
						</p>
					{:else}
						<ul class="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
							{#each data.author.books as book (book.id)}
								<li>
									<a
										href={resolve(createBookHref(book.slug))}
										class="block px-5 py-4 transition-colors hover:bg-slate-50"
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
			</div>
		</article>
	{/if}
</section>
