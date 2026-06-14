<script lang="ts">
	import { resolve } from '$app/paths';

	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | undefined } = $props();
</script>

<svelte:head>
	<title>Studijni materialy | Maturitni knihovna</title>
	<meta name="description" content="Seznam studijnich materialu pro ucitele." />
</svelte:head>

<section class="space-y-6">
	<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
		<div class="max-w-3xl space-y-2">
			<p class="text-sm font-semibold tracking-wide text-[var(--color-primary)] uppercase">
				Materialy
			</p>
			<h1 class="text-3xl font-semibold text-slate-950">Studijni materialy</h1>
			<p class="text-base leading-7 text-slate-700">
				Sprava pracovnich listu, rozboru a dalsich materialu.
			</p>
		</div>

		<a
			href={resolve('/teacher/materials/new')}
			class="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:outline-none"
		>
			Novy material
		</a>
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

	{#if data.materials.length > 0}
		<div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
			<table class="w-full border-collapse text-left text-sm">
				<thead class="bg-slate-100 text-slate-700">
					<tr>
						<th class="px-4 py-3 font-medium">Nazev</th>
						<th class="px-4 py-3 font-medium">Typ</th>
						<th class="px-4 py-3 font-medium">Priloha</th>
						<th class="px-4 py-3 font-medium">Stav</th>
						<th class="px-4 py-3 font-medium">Akce</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200">
					{#each data.materials as material (material.id)}
						<tr class="odd:bg-white even:bg-slate-50">
							<td class="px-4 py-3">
								<a
									href={resolve(`/teacher/materials/${material.id}`)}
									class="font-medium text-slate-950 hover:text-[var(--color-primary)]"
								>
									{material.title}
								</a>
							</td>
							<td class="px-4 py-3 text-slate-700">{material.materialType}</td>
							<td class="px-4 py-3 text-slate-700">
								{#if material.attachment && material.attachmentUrl}
									<a
										href={resolve(material.attachmentUrl as '/')}
										target="_blank"
										rel="noreferrer"
										class="font-medium text-[var(--color-primary)] hover:underline"
									>
										Stahnout
									</a>
								{:else}
									<span class="text-slate-500">Bez prilohy</span>
								{/if}
							</td>
							<td class="px-4 py-3 text-slate-700">
								{material.published ? 'Publikovano' : 'Nepublikovano'}
							</td>
							<td class="px-4 py-3">
								<div class="flex flex-wrap gap-2">
									<a
										href={resolve(`/teacher/materials/${material.id}`)}
										class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
									>
										Editovat
									</a>
									<form method="POST" action={material.published ? '?/unpublish' : '?/publish'}>
										<input type="hidden" name="id" value={material.id} />
										<button
											type="submit"
											class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
										>
											{material.published ? 'Odpublikovat' : 'Publikovat'}
										</button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else if !data.loadError}
		<div class="rounded-lg border border-dashed border-slate-300 bg-white p-8">
			<p class="text-sm font-medium text-slate-700">Zatim nejsou vytvorene zadne materialy.</p>
			<p class="mt-2 text-sm leading-6 text-slate-600">
				Zacnete vytvorenim prvniho studijniho materialu.
			</p>
		</div>
	{/if}
</section>
