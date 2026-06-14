<script lang="ts">
	import { resolve } from '$app/paths';

	import type { PageData } from './$types';

	type EditorStats = {
		books: number;
		authors: number;
		literaryPeriods: number;
		studyMaterials: number;
	};

	const fallbackStats: EditorStats = {
		books: 0,
		authors: 0,
		literaryPeriods: 0,
		studyMaterials: 0
	};

	let { data }: { data?: PageData } = $props();

	const stats = $derived(data?.stats ?? fallbackStats);
	const loadError = $derived(data?.loadError);

	const statItems = $derived([
		{ label: 'Knihy', value: stats.books },
		{ label: 'Autori', value: stats.authors },
		{ label: 'Literarni obdobi', value: stats.literaryPeriods },
		{ label: 'Studijni materialy', value: stats.studyMaterials }
	]);
</script>

<svelte:head>
	<title>Editor | Maturitni knihovna</title>
	<meta name="description" content="Zakladni redakcni prehled." />
</svelte:head>

<section class="space-y-8">
	<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
		<div class="max-w-3xl space-y-2">
			<p class="text-sm font-semibold tracking-wide text-[var(--color-primary)] uppercase">
				Redakce
			</p>
			<h1 class="text-3xl font-semibold text-slate-950">Editor dashboard</h1>
			<p class="text-base leading-7 text-slate-700">
				Zakladni prehled obsahu a rychly vstup do spravy verejnych entit.
			</p>
		</div>

		<a
			href={resolve('/editor/content')}
			class="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
		>
			Sprava obsahu
		</a>
	</div>

	{#if loadError}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
			{loadError}
		</div>
	{/if}

	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
		{#each statItems as item (item.label)}
			<div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
				<p class="text-sm font-medium text-slate-600">{item.label}</p>
				<p class="mt-2 text-3xl font-semibold text-slate-950">{item.value}</p>
			</div>
		{/each}
	</div>

	<div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
		<h2 class="text-xl font-semibold text-slate-950">Rychle odkazy</h2>
		<div class="mt-4 flex flex-wrap gap-3">
			<a
				href={resolve('/editor/content/books')}
				class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
			>
				Knihy
			</a>
			<a
				href={resolve('/editor/content/authors')}
				class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
			>
				Autori
			</a>
			<a
				href={resolve('/editor/content/periods')}
				class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
			>
				Literarni obdobi
			</a>
		</div>
	</div>
</section>
