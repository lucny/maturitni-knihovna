<script lang="ts">
	import { resolve } from '$app/paths';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const dashboardCards = [
		{
			label: 'Oblibene knihy',
			value: 'Dostupne',
			description: 'Oblibene knihy muzete spravovat ze studentske casti a detailu knihy.'
		},
		{
			label: 'Poznamky',
			value: 'Dostupne',
			description: 'Osobni poznamky muzete vytvaret a upravovat ve studentske casti.'
		},
		{
			label: 'Nedavna aktivita',
			value: 'Zatim prazdne',
			description: 'Aktivita se zacne zobrazovat po zapojeni studentskych funkci.'
		}
	];
</script>

<svelte:head>
	<title>Studentsky prehled | Maturitni knihovna</title>
	<meta name="description" content="Zakladni prehled prihlaseneho studenta." />
</svelte:head>

<section class="space-y-8">
	<div class="space-y-3">
		<p class="text-sm font-semibold tracking-wide text-[var(--color-primary)] uppercase">
			Studentsky portal
		</p>
		<div class="max-w-3xl space-y-2">
			<h1 class="text-3xl font-semibold text-slate-950">Vitejte, {data.user.displayName}</h1>
			<p class="text-base leading-7 text-slate-700">
				Role uctu: <span class="font-medium text-slate-950">{data.user.role}</span>
			</p>
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-3">
		{#each dashboardCards as card (card.label)}
			<article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
				<p class="text-sm font-medium text-slate-600">{card.label}</p>
				<p class="mt-3 text-2xl font-semibold text-slate-950">{card.value}</p>
				<p class="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
			</article>
		{/each}
	</div>

	<div class="grid gap-4 md:grid-cols-3">
		<a
			href={resolve('/student/books')}
			class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-[var(--color-primary)]"
		>
			<p class="text-sm font-medium text-slate-600">Rychly odkaz</p>
			<h2 class="mt-2 text-xl font-semibold text-slate-950">Moje knihy</h2>
			<p class="mt-2 text-sm leading-6 text-slate-600">
				Placeholder pro budouci oblibene knihy a osobni seznamy.
			</p>
		</a>

		<a
			href={resolve('/profile')}
			class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-[var(--color-primary)]"
		>
			<p class="text-sm font-medium text-slate-600">Rychly odkaz</p>
			<h2 class="mt-2 text-xl font-semibold text-slate-950">Profil</h2>
			<p class="mt-2 text-sm leading-6 text-slate-600">
				Zakladni informace o prihlasenem uzivateli.
			</p>
		</a>

		<a
			href={resolve('/student/notes')}
			class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-[var(--color-primary)]"
		>
			<p class="text-sm font-medium text-slate-600">Rychly odkaz</p>
			<h2 class="mt-2 text-xl font-semibold text-slate-950">Poznamky</h2>
			<p class="mt-2 text-sm leading-6 text-slate-600">Soukrome poznamky svazane s vasim uctem.</p>
		</a>
	</div>
</section>
