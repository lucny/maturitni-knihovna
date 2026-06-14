<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Profil | Maturitni knihovna</title>
	<meta name="description" content="Profil prihlaseneho uzivatele." />
</svelte:head>

<section class="space-y-6">
	<div class="max-w-3xl space-y-2">
		<p class="text-sm font-semibold tracking-wide text-[var(--color-primary)] uppercase">Profil</p>
		<h1 class="text-3xl font-semibold text-slate-950">{data.user.displayName}</h1>
		<p class="text-base leading-7 text-slate-700">
			Zakladni informace nactene ze serverove autentizacni session.
		</p>
	</div>

	<div class="max-w-3xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
		<div class="grid gap-1 border-b border-slate-200 px-5 py-4 sm:grid-cols-3">
			<dt class="text-sm font-medium text-slate-600">Jmeno</dt>
			<dd class="text-sm text-slate-950 sm:col-span-2">{data.user.displayName}</dd>
		</div>
		<div class="grid gap-1 border-b border-slate-200 px-5 py-4 sm:grid-cols-3">
			<dt class="text-sm font-medium text-slate-600">Email</dt>
			<dd class="text-sm text-slate-950 sm:col-span-2">{data.user.email ?? 'Neuveden'}</dd>
		</div>
		<div class="grid gap-1 border-b border-slate-200 px-5 py-4 sm:grid-cols-3">
			<dt class="text-sm font-medium text-slate-600">Role</dt>
			<dd class="text-sm text-slate-950 sm:col-span-2">{data.user.role}</dd>
		</div>
		<div class="grid gap-1 px-5 py-4 sm:grid-cols-3">
			<dt class="text-sm font-medium text-slate-600">Aktivni ucet</dt>
			<dd class="text-sm text-slate-950 sm:col-span-2">{data.user.active ? 'Ano' : 'Ne'}</dd>
		</div>
	</div>
</section>
