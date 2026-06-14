<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Pristup zamitnut | Maturitni knihovna</title>
	<meta
		name="description"
		content="Stranka informuje o nedostatecnem opravneni pro pristup do chranene casti aplikace."
	/>
</svelte:head>

<section class="mx-auto max-w-3xl px-4 py-16 sm:px-8">
	<div class="space-y-6">
		<div class="space-y-3">
			<p class="text-sm font-semibold tracking-wide text-[var(--color-primary)] uppercase">403</p>
			<h1 class="text-3xl font-semibold text-slate-950">Pristup zamitnut</h1>
			<p class="text-base leading-7 text-slate-700">
				K teto casti aplikace nemate dostatecne opravneni nebo vas ucet neni aktivni.
			</p>
		</div>

		<a
			href={resolve('/')}
			class="inline-flex rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
		>
			Zpet na uvod
		</a>
	</div>
</section>
