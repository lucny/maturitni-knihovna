<script lang="ts">
	import { resolve } from '$app/paths';

	import LiteraryPeriodEditorForm from '$lib/components/domain/literary-period-editor-form.svelte';
	import type {
		LiteraryPeriodFormErrors,
		LiteraryPeriodFormValues
	} from '$lib/schemas/literary-period.schema';

	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | undefined } = $props();

	let values: LiteraryPeriodFormValues = $derived.by(() =>
		form && 'values' in form && form.values ? form.values : data.formValues
	);
	let errors: LiteraryPeriodFormErrors = $derived.by(() =>
		form && 'errors' in form && form.errors ? (form.errors as LiteraryPeriodFormErrors) : {}
	);
</script>

<svelte:head>
	<title>{data.period.title} | Editor</title>
	<meta name="description" content="Editace literarniho obdobi." />
</svelte:head>

<section class="space-y-6">
	<div class="max-w-3xl space-y-2">
		<a
			href={resolve('/editor/content/periods')}
			class="text-sm font-medium text-[var(--color-primary)]">Zpet na obdobi</a
		>
		<h1 class="text-3xl font-semibold text-slate-950">{data.period.title}</h1>
	</div>

	{#if form?.message}
		<div class="max-w-3xl rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
			{form.message}
		</div>
	{/if}

	<LiteraryPeriodEditorForm action="?/update" {errors} submitLabel="Ulozit obdobi" {values} />
</section>
