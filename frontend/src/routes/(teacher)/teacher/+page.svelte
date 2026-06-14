<script lang="ts">
	import { resolve } from '$app/paths';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Ucitelsky prehled | Maturitni knihovna</title>
	<meta name="description" content="Zakladni dashboard pro spravu studijnich materialu." />
</svelte:head>

<section class="space-y-8">
	<div class="max-w-3xl space-y-2">
		<p class="text-sm font-semibold tracking-wide text-[var(--color-primary)] uppercase">
			Ucitelska cast
		</p>
		<h1 class="text-3xl font-semibold text-slate-950">Sprava studijnich materialu</h1>
		<p class="text-base leading-7 text-slate-700">
			Zakladni prehled materialu dostupnych v systemu.
		</p>
	</div>

	{#if data.loadError}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
			{data.loadError}
		</div>
	{/if}

	<div class="grid gap-4 md:grid-cols-3">
		<article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
			<p class="text-sm font-medium text-slate-600">Materialy celkem</p>
			<p class="mt-3 text-3xl font-semibold text-slate-950">{data.totalMaterials}</p>
		</article>
		<article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
			<p class="text-sm font-medium text-slate-600">Publikovane</p>
			<p class="mt-3 text-3xl font-semibold text-slate-950">{data.publishedMaterials}</p>
		</article>
		<a
			href={resolve('/teacher/materials')}
			class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-[var(--color-primary)]"
		>
			<p class="text-sm font-medium text-slate-600">Sprava</p>
			<h2 class="mt-3 text-xl font-semibold text-slate-950">Materialy</h2>
			<p class="mt-2 text-sm leading-6 text-slate-600">Vytvorit nebo upravit studijni material.</p>
		</a>
	</div>
</section>
