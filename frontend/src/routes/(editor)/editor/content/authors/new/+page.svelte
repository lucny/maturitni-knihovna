<script lang="ts">
	import { resolve } from '$app/paths';

	import AuthorEditorForm from '$lib/components/domain/author-editor-form.svelte';
	import type { AuthorFormErrors, AuthorFormValues } from '$lib/schemas/author.schema';

	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | undefined } = $props();

	let values: AuthorFormValues = $derived.by(() =>
		form && 'values' in form && form.values ? form.values : data.formValues
	);
	let errors: AuthorFormErrors = $derived.by(() =>
		form && 'errors' in form && form.errors ? (form.errors as AuthorFormErrors) : {}
	);
</script>

<svelte:head>
	<title>Novy autor | Editor</title>
	<meta name="description" content="Vytvoreni autora." />
</svelte:head>

<section class="space-y-6">
	<div class="max-w-3xl space-y-2">
		<a
			href={resolve('/editor/content/authors')}
			class="text-sm font-medium text-[var(--color-primary)]">Zpet na autory</a
		>
		<h1 class="text-3xl font-semibold text-slate-950">Novy autor</h1>
	</div>

	{#if form?.message}
		<div class="max-w-3xl rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
			{form.message}
		</div>
	{/if}

	<AuthorEditorForm action="?/create" {errors} submitLabel="Vytvorit autora" {values} />
</section>
