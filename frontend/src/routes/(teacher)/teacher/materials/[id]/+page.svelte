<script lang="ts">
	import { resolve } from '$app/paths';

	import StudyMaterialForm from '$lib/components/domain/study-material-form.svelte';
	import type {
		StudyMaterialFormErrors,
		StudyMaterialFormValues
	} from '$lib/schemas/study-material.schema';

	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | undefined } = $props();

	let values: StudyMaterialFormValues = $derived.by(() =>
		form && 'values' in form && form.values ? form.values : data.formValues
	);
	let errors: StudyMaterialFormErrors = $derived.by(() =>
		form && 'errors' in form && form.errors ? (form.errors as StudyMaterialFormErrors) : {}
	);
</script>

<svelte:head>
	<title>{data.material.title} | Maturitni knihovna</title>
	<meta name="description" content="Editace studijniho materialu." />
</svelte:head>

<section class="space-y-6">
	<div class="max-w-3xl space-y-2">
		<a href={resolve('/teacher/materials')} class="text-sm font-medium text-[var(--color-primary)]">
			Zpet na materialy
		</a>
		<h1 class="text-3xl font-semibold text-slate-950">{data.material.title}</h1>
		<p class="text-sm text-slate-600">
			Stav: {data.material.published ? 'Publikovano' : 'Nepublikovano'}
		</p>
	</div>

	{#if form?.message}
		<div class="max-w-3xl rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
			{form.message}
		</div>
	{/if}

	<div class="flex flex-wrap gap-3">
		<form method="POST" action={data.material.published ? '?/unpublish' : '?/publish'}>
			<button
				type="submit"
				class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none"
			>
				{data.material.published ? 'Odpublikovat' : 'Publikovat'}
			</button>
		</form>
	</div>

	<StudyMaterialForm
		action="?/update"
		authors={data.authors}
		books={data.books}
		{errors}
		submitLabel="Ulozit material"
		{values}
	/>
</section>
