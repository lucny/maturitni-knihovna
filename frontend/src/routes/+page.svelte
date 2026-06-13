<script lang="ts">
	const statusItems = ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'PostCSS'];
</script>

<main
	class="min-h-screen bg-[var(--color-background-muted)] px-4 py-16 text-[var(--color-secondary)] sm:px-8"
>
	<section
		class="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-[var(--color-background)] p-8 shadow-sm"
	>
		<p class="text-sm font-medium text-[var(--color-primary)]">Maturitni knihovna</p>
		<h1 class="mt-3 text-4xl font-bold">Tailwind CSS je pripraveny</h1>
		<p class="mt-4 max-w-3xl text-base leading-7 text-slate-700">
			Zakladni SvelteKit stranka pouziva globalni stylesheet, PostCSS a utility tridy Tailwindu.
			Neobsahuje zadne aplikacni funkce.
		</p>

		<ul class="mt-8 grid gap-3 sm:grid-cols-2">
			{#each statusItems as item (item)}
				<li class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium">
					{item}
				</li>
			{/each}
		</ul>
	</section>
</main>
