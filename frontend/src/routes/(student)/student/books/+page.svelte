<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Moje knihy | Maturitni knihovna</title>
	<meta name="description" content="Placeholder pro budouci oblibene knihy studenta." />
</svelte:head>

<section class="space-y-6">
	<div class="max-w-3xl space-y-2">
		<p class="text-sm font-semibold tracking-wide text-[var(--color-primary)] uppercase">
			Moje knihy
		</p>
		<h1 class="text-3xl font-semibold text-slate-950">Oblibene knihy</h1>
		<p class="text-base leading-7 text-slate-700">
			{data.user.displayName}, tato cast je pripravena pro budouci seznam oblibenych knih. Funkcni
			ukladani oblibenych knih bude doplneno v samostatne fazi.
		</p>
	</div>

	<div class="rounded-lg border border-dashed border-slate-300 bg-white p-8">
		<p class="text-sm font-medium text-slate-700">Zatim zde nejsou zadna studentska data.</p>
		<p class="mt-2 text-sm leading-6 text-slate-600">
			Stranka neprovadi zadne databazove dotazy a nespravuje oblibene knihy.
		</p>
	</div>
</section>
