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
	<title>Novy material | Maturitni knihovna</title>
	<meta name="description" content="Vytvoreni noveho studijniho materialu." />
</svelte:head>

<section class="space-y-6">
	<div class="max-w-3xl space-y-2">
		<a href={resolve('/teacher/materials')} class="text-sm font-medium text-[var(--color-primary)]">
			Zpet na materialy
		</a>
		<h1 class="text-3xl font-semibold text-slate-950">Novy studijni material</h1>
		<p class="text-base leading-7 text-slate-700">
			Vytvorte material a volitelne ho svazte s knihou nebo autorem.
		</p>
	</div>

	{#if form?.message}
		<div class="max-w-3xl rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
			{form.message}
		</div>
	{/if}

	<StudyMaterialForm
		action="?/create"
		authors={data.authors}
		books={data.books}
		{errors}
		submitLabel="Vytvorit material"
		{values}
	/>
</section>
