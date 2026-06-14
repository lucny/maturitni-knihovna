<script lang="ts">
	import { resolve } from '$app/paths';

	import type { PageData } from './$types';

	let { data }: { data?: PageData } = $props();

	const materials = $derived(data?.materials ?? []);
	const loadError = $derived(data?.loadError);
</script>

<svelte:head>
	<title>Studijni materialy | Maturitni knihovna</title>
	<meta name="description" content="Verejne dostupne studijni materialy k maturitni cetbe." />
</svelte:head>

<section class="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-8">
	<div class="max-w-3xl space-y-3">
		<p class="text-sm font-semibold tracking-wide text-[var(--color-primary)] uppercase">Studium</p>
		<h1 class="text-4xl font-bold text-slate-950">Studijni materialy</h1>
		<p class="text-base leading-7 text-slate-700">
			Publikovane pracovni listy, prezentace a dalsi materialy pro pripravu k maturite.
		</p>
	</div>

	{#if loadError}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
			{loadError}
		</div>
	{/if}

	{#if materials.length > 0}
		<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			{#each materials as material (material.id)}
				<article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
					<div class="space-y-3">
						<div class="space-y-1">
							<p class="text-xs font-semibold tracking-wide text-slate-500 uppercase">
								{material.materialType}
							</p>
							<h2 class="text-xl font-semibold text-slate-950">{material.title}</h2>
						</div>

						{#if material.description}
							<p class="line-clamp-3 text-sm leading-6 text-slate-700">{material.description}</p>
						{/if}

						{#if material.attachment && material.attachmentUrl}
							<a
								href={resolve(material.attachmentUrl as '/')}
								target="_blank"
								rel="noreferrer"
								class="inline-flex rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
							>
								Stahnout prilohu
							</a>
						{:else}
							<p class="text-sm text-slate-500">Material zatim nema prilozeny soubor.</p>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	{:else if !loadError}
		<div class="rounded-lg border border-dashed border-slate-300 bg-white p-8">
			<p class="text-sm font-medium text-slate-700">
				Zatim nejsou publikovane zadne studijni materialy.
			</p>
		</div>
	{/if}
</section>
