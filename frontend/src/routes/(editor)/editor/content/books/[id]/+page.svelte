<script lang="ts">
	import { resolve } from '$app/paths';

	import BookEditorForm from '$lib/components/domain/book-editor-form.svelte';
	import type { BookFormErrors, BookFormValues } from '$lib/schemas/book.schema';

	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | undefined } = $props();

	let values: BookFormValues = $derived.by(() =>
		form && 'values' in form && form.values ? form.values : data.formValues
	);
	let errors: BookFormErrors = $derived.by(() =>
		form && 'errors' in form && form.errors ? (form.errors as BookFormErrors) : {}
	);
</script>

<svelte:head>
	<title>{data.book.title} | Editor</title>
	<meta name="description" content="Editace knihy." />
</svelte:head>

<section class="space-y-6">
	<div class="max-w-3xl space-y-2">
		<a
			href={resolve('/editor/content/books')}
			class="text-sm font-medium text-[var(--color-primary)]">Zpet na knihy</a
		>
		<h1 class="text-3xl font-semibold text-slate-950">{data.book.title}</h1>
		<p class="text-sm text-slate-600">
			Stav: {data.book.published ? 'Publikovano' : 'Nepublikovano'}
		</p>
	</div>

	{#if form?.message}
		<div class="max-w-3xl rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
			{form.message}
		</div>
	{/if}

	<BookEditorForm
		action="?/update"
		authors={data.authors}
		{errors}
		genres={data.genres}
		literaryPeriods={data.literaryPeriods}
		submitLabel="Ulozit knihu"
		{values}
	/>
</section>
