<script lang="ts">
	import { resolve } from '$app/paths';

	const contentSections = [
		{
			title: 'Knihy',
			description: 'Sprava zakladnich metadat, vztahu a publikace knih.',
			href: '/editor/content/books',
			enabled: true
		},
		{
			title: 'Autori',
			description: 'Sprava autoru a jejich verejnych profilu.',
			href: '/editor/content/authors',
			enabled: true
		},
		{
			title: 'Literarni obdobi',
			description: 'Sprava obdobi, popisu a historickeho kontextu.',
			href: '/editor/content/periods',
			enabled: true
		},
		{
			title: 'Zanry',
			description: 'Zanry jsou v teto fazi dostupne pres PocketBase Admin UI.',
			href: undefined,
			enabled: false
		},
		{
			title: 'Studijni materialy',
			description: 'Materialy se spravuji v ucitelske casti.',
			href: '/teacher/materials',
			enabled: true
		}
	] as const;
</script>

<svelte:head>
	<title>Sprava obsahu | Maturitni knihovna</title>
	<meta name="description" content="Rozcestnik redakcni spravy obsahu." />
</svelte:head>

<section class="space-y-8">
	<div class="max-w-3xl space-y-2">
		<p class="text-sm font-semibold tracking-wide text-[var(--color-primary)] uppercase">Obsah</p>
		<h1 class="text-3xl font-semibold text-slate-950">Sprava obsahu</h1>
		<p class="text-base leading-7 text-slate-700">
			Zakladni redakcni rozcestnik pro spravu verejneho obsahu.
		</p>
	</div>

	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
		{#each contentSections as section (section.title)}
			<article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
				<div class="space-y-3">
					<h2 class="text-xl font-semibold text-slate-950">{section.title}</h2>
					<p class="text-sm leading-6 text-slate-700">{section.description}</p>
					{#if section.enabled && section.href}
						<a
							href={resolve(section.href)}
							class="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
						>
							Otevrit
						</a>
					{:else}
						<span
							class="inline-flex rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500"
						>
							Zatim bez vlastniho CRUD
						</span>
					{/if}
				</div>
			</article>
		{/each}
	</div>
</section>
