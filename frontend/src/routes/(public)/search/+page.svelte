<script lang="ts">
	import { resolve } from '$app/paths';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function createBookHref(slug: string): `/books/${string}` {
		return `/books/${slug}`;
	}

	function createAuthorHref(slug: string): `/authors/${string}` {
		return `/authors/${slug}`;
	}

	const hasQuery = $derived(data.query.length > 0);
	const hasResults = $derived(data.books.length > 0 || data.authors.length > 0);
</script>

<svelte:head>
	<title>Vyhledavani | Maturitni knihovna</title>
	<meta name="description" content="Verejne vyhledavani knih a autoru v Maturitni knihovne." />
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-8">
	<div class="max-w-3xl">
		<p class="text-sm font-medium text-[var(--color-primary)]">Vyhledavani</p>
		<h1 class="mt-3 text-3xl font-bold text-[var(--color-secondary)]">Vyhledavani</h1>
		<p class="mt-4 text-base leading-7 text-slate-700">
			Zakladni verejne vyhledavani v knihach a autorech.
		</p>
	</div>

	<form
		action={resolve('/search')}
		method="GET"
		class="mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row"
	>
		<label for="search-query" class="sr-only">Hledany vyraz</label>
		<input
			id="search-query"
			name="q"
			type="search"
			maxlength="80"
			value={data.query}
			placeholder="Zadejte nazev knihy nebo jmeno autora"
			class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
		/>
		<button
			type="submit"
			class="rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-blue-800 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none"
		>
			Hledat
		</button>
	</form>

	{#if data.isQueryTooLong}
		<p class="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
			Dotaz byl zkracen na 80 znaku.
		</p>
	{/if}

	{#if !hasQuery}
		<div class="mt-10 rounded-xl border border-slate-200 bg-white px-5 py-8 shadow-sm">
			<h2 class="text-xl font-medium text-[var(--color-secondary)]">Zadejte hledany vyraz</h2>
			<p class="mt-3 text-sm leading-6 text-slate-600">
				Vyhledavat lze podle nazvu knihy nebo jmena autora.
			</p>
		</div>
	{:else if data.loadError}
		<div class="mt-10 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
			{data.loadError}
		</div>
	{:else}
		<p class="mt-8 text-sm leading-6 text-slate-600">
			Vysledky pro hledany vyraz <span class="font-medium text-slate-900">"{data.query}"</span>
		</p>

		{#if !hasResults}
			<div class="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-8 shadow-sm">
				<h2 class="text-xl font-medium text-[var(--color-secondary)]">Zadne vysledky</h2>
				<p class="mt-3 text-sm leading-6 text-slate-600">
					Pro zadany vyraz nebyly nalezeny zadne knihy ani autori.
				</p>
			</div>
		{:else}
			<div class="mt-10 grid gap-10 lg:grid-cols-2">
				<section aria-labelledby="search-books-heading">
					<h2
						id="search-books-heading"
						class="text-2xl font-semibold text-[var(--color-secondary)]"
					>
						Knihy
					</h2>

					{#if data.books.length === 0}
						<p
							class="mt-4 rounded-xl border border-slate-200 bg-white px-5 py-6 text-sm text-slate-600 shadow-sm"
						>
							Nebyly nalezeny zadne knihy.
						</p>
					{:else}
						<div class="mt-4 space-y-3">
							{#each data.books as book (book.id)}
								<a
									href={resolve(createBookHref(book.slug))}
									class="block rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-colors hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
								>
									<h3 class="text-lg font-medium text-[var(--color-secondary)]">{book.title}</h3>

									<div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm leading-6 text-slate-600">
										{#if book.originalTitle}
											<p>{book.originalTitle}</p>
										{/if}

										{#if book.publicationYear}
											<p>{book.publicationYear}</p>
										{/if}
									</div>

									{#if book.annotation}
										<p class="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
											{book.annotation}
										</p>
									{/if}
								</a>
							{/each}
						</div>
					{/if}
				</section>

				<section aria-labelledby="search-authors-heading">
					<h2
						id="search-authors-heading"
						class="text-2xl font-semibold text-[var(--color-secondary)]"
					>
						Autori
					</h2>

					{#if data.authors.length === 0}
						<p
							class="mt-4 rounded-xl border border-slate-200 bg-white px-5 py-6 text-sm text-slate-600 shadow-sm"
						>
							Nebyli nalezeni zadni autori.
						</p>
					{:else}
						<div class="mt-4 space-y-3">
							{#each data.authors as author (author.id)}
								<a
									href={resolve(createAuthorHref(author.slug))}
									class="block rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-colors hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
								>
									<h3 class="text-lg font-medium text-[var(--color-secondary)]">
										{author.fullName}
									</h3>

									{#if author.nationality}
										<p class="mt-2 text-sm leading-6 text-slate-600">{author.nationality}</p>
									{/if}
								</a>
							{/each}
						</div>
					{/if}
				</section>
			</div>
		{/if}
	{/if}
</section>
