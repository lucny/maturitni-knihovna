<script lang="ts">
	import { resolve } from '$app/paths';

	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Prihlaseni | Maturitni knihovna</title>
	<meta
		name="description"
		content="Prihlaseni do projektu Maturitni knihovna pres Microsoft 365."
	/>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-8">
	<div class="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
		<p class="text-sm font-medium text-[var(--color-primary)]">Ucet</p>
		<h1 class="mt-3 text-3xl font-bold text-[var(--color-secondary)]">Prihlaseni</h1>
		<p class="mt-4 text-base leading-7 text-slate-700">
			Prihlaste se skolnim uctem Microsoft 365. Prihlaseni je zpracovane pres PocketBase OAuth2
			provider.
		</p>

		{#if form?.message || data.errorMessage}
			<div class="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
				{form?.message ?? data.errorMessage}
			</div>
		{/if}

		<form action="?/microsoft" method="POST" class="mt-8">
			<button
				type="submit"
				class="w-full rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none"
			>
				Prihlasit se pres Microsoft 365
			</button>
		</form>

		<div class="mt-6 border-t border-slate-200 pt-6">
			<p class="text-sm leading-6 text-slate-600">
				Lokalni administratorsky ucet zustava dostupny v PocketBase Admin UI.
			</p>
			<form action={data.pocketBaseAdminUrl} method="GET" class="mt-3">
				<button
					type="submit"
					class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
				>
					Otevrit PocketBase Admin
				</button>
			</form>
		</div>

		<a
			href={resolve('/')}
			class="mt-6 inline-flex text-sm font-medium text-[var(--color-primary)] hover:text-blue-800"
		>
			Zpet na uvodni stranku
		</a>
	</div>
</section>
