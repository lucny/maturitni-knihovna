<script lang="ts">
	import { resolve } from '$app/paths';

	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | undefined } = $props();
</script>

<svelte:head>
	<title>Literarni obdobi | Editor</title>
	<meta name="description" content="Redakcni sprava literarnich obdobi." />
</svelte:head>

<section class="space-y-6">
	<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
		<div class="max-w-3xl space-y-2">
			<a href={resolve('/editor/content')} class="text-sm font-medium text-[var(--color-primary)]"
				>Zpet na obsah</a
			>
			<h1 class="text-3xl font-semibold text-slate-950">Literarni obdobi</h1>
			<p class="text-base leading-7 text-slate-700">Zakladni CRUD sprava literarnich obdobi.</p>
		</div>
		<a
			href={resolve('/editor/content/periods/new')}
			class="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800"
			>Nove obdobi</a
		>
	</div>

	{#if data.loadError}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
			{data.loadError}
		</div>
	{/if}
	{#if form?.message}
		<div class="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
			{form.message}
		</div>
	{/if}

	{#if data.periods.length > 0}
		<div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
			<table class="w-full border-collapse text-left text-sm">
				<thead class="bg-slate-100 text-slate-700">
					<tr>
						<th class="px-4 py-3 font-medium">Nazev</th>
						<th class="px-4 py-3 font-medium">Vymezeni</th>
						<th class="px-4 py-3 font-medium">Slug</th>
						<th class="px-4 py-3 font-medium">Akce</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200">
					{#each data.periods as period (period.id)}
						<tr class="odd:bg-white even:bg-slate-50">
							<td class="px-4 py-3 font-medium text-slate-950">{period.title}</td>
							<td class="px-4 py-3 text-slate-700"
								>{period.startYear ?? '?'} - {period.endYear ?? '?'}</td
							>
							<td class="px-4 py-3 text-slate-700">{period.slug}</td>
							<td class="px-4 py-3">
								<div class="flex flex-wrap gap-2">
									<a
										href={resolve(`/editor/content/periods/${period.id}`)}
										class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
										>Editovat</a
									>
									<form method="POST" action="?/delete">
										<input type="hidden" name="id" value={period.id} />
										<button
											type="submit"
											class="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
											>Smazat</button
										>
									</form>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else if !data.loadError}
		<div
			class="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-700"
		>
			Zatim nejsou vytvorena zadna literarni obdobi.
		</div>
	{/if}
</section>
