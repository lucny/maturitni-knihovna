<script lang="ts">
	import { resolve } from '$app/paths';

	export type BookFilterOption = {
		slug: string;
		label: string;
	};

	export type BookFilterSelection = {
		author?: string;
		period?: string;
		genre?: string;
	};

	export type ActiveBookFilter = {
		label: string;
		value: string;
		filters: BookFilterSelection;
	};

	export type BookFilterPanelData = {
		authors: BookFilterOption[];
		literaryPeriods: BookFilterOption[];
		genres: BookFilterOption[];
	};

	let {
		filterOptions,
		filters,
		activeFilters
	}: {
		filterOptions: BookFilterPanelData;
		filters: BookFilterSelection;
		activeFilters: ActiveBookFilter[];
	} = $props();
</script>

<aside class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
	<div class="flex items-start justify-between gap-4">
		<div>
			<h2 class="text-xl font-medium text-[var(--color-secondary)]">Filtry</h2>
			<p class="mt-2 text-sm leading-6 text-slate-600">Zuzte katalog podle zakladnich vztahu.</p>
		</div>

		{#if activeFilters.length > 0}
			<form action={resolve('/books')} method="GET">
				<button
					type="submit"
					class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium whitespace-nowrap text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
				>
					Zrusit vse
				</button>
			</form>
		{/if}
	</div>

	<form action={resolve('/books')} method="GET" class="mt-5 space-y-4">
		<div>
			<label for="book-filter-author" class="text-sm font-medium text-slate-700">Autor</label>
			<select
				id="book-filter-author"
				name="author"
				class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>
				<option value="" selected={!filters.author}>Vsichni autori</option>
				{#each filterOptions.authors as author (author.slug)}
					<option value={author.slug} selected={filters.author === author.slug}>
						{author.label}
					</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="book-filter-period" class="text-sm font-medium text-slate-700"
				>Literarni obdobi</label
			>
			<select
				id="book-filter-period"
				name="period"
				class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>
				<option value="" selected={!filters.period}>Vsechna obdobi</option>
				{#each filterOptions.literaryPeriods as literaryPeriod (literaryPeriod.slug)}
					<option value={literaryPeriod.slug} selected={filters.period === literaryPeriod.slug}>
						{literaryPeriod.label}
					</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="book-filter-genre" class="text-sm font-medium text-slate-700">Zanr</label>
			<select
				id="book-filter-genre"
				name="genre"
				class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>
				<option value="" selected={!filters.genre}>Vsechny zanry</option>
				{#each filterOptions.genres as genre (genre.slug)}
					<option value={genre.slug} selected={filters.genre === genre.slug}>
						{genre.label}
					</option>
				{/each}
			</select>
		</div>

		<button
			type="submit"
			class="w-full rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none"
		>
			Pouzit filtry
		</button>
	</form>

	{#if activeFilters.length > 0}
		<div class="mt-5 border-t border-slate-200 pt-5">
			<h3 class="text-sm font-medium text-slate-700">Aktivni filtry</h3>
			<div class="mt-3 flex flex-wrap gap-2">
				{#each activeFilters as activeFilter (activeFilter.label)}
					<form action={resolve('/books')} method="GET">
						{#if activeFilter.filters.author}
							<input type="hidden" name="author" value={activeFilter.filters.author} />
						{/if}

						{#if activeFilter.filters.period}
							<input type="hidden" name="period" value={activeFilter.filters.period} />
						{/if}

						{#if activeFilter.filters.genre}
							<input type="hidden" name="genre" value={activeFilter.filters.genre} />
						{/if}

						<button
							type="submit"
							class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
						>
							{activeFilter.label}: {activeFilter.value} x
						</button>
					</form>
				{/each}
			</div>
		</div>
	{/if}
</aside>
