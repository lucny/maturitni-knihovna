<script lang="ts">
	import { resolve } from '$app/paths';

	import type { UserNoteFormErrors, UserNoteFormValues } from '$lib/schemas/user-note.schema';

	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | undefined } = $props();

	let submittedValues: UserNoteFormValues = $derived.by(() =>
		form && 'values' in form && form.values ? form.values : data.formValues
	);
	let formErrors: UserNoteFormErrors = $derived.by(() =>
		form && 'errors' in form && form.errors ? (form.errors as UserNoteFormErrors) : {}
	);
</script>

<svelte:head>
	<title>{data.note.title} | Maturitni knihovna</title>
	<meta name="description" content="Editace osobni poznamky studenta." />
</svelte:head>

<section class="max-w-3xl space-y-6">
	<div class="space-y-2">
		<a href={resolve('/student/notes')} class="text-sm font-medium text-[var(--color-primary)]">
			Zpet na poznamky
		</a>
		<h1 class="text-3xl font-semibold text-slate-950">{data.note.title}</h1>
		<p class="text-sm text-slate-600">Upraveno: {data.note.updated}</p>
	</div>

	{#if form?.message}
		<div class="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
			{form.message}
		</div>
	{/if}

	<form
		method="POST"
		action="?/update"
		class="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
	>
		<div class="space-y-2">
			<label for="title" class="text-sm font-medium text-slate-700">Nazev</label>
			<input
				id="title"
				name="title"
				type="text"
				maxlength="200"
				value={submittedValues.title}
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			/>
			{#if formErrors.title}
				<p class="text-sm text-red-700">{formErrors.title}</p>
			{/if}
		</div>

		<div class="space-y-2">
			<label for="bookId" class="text-sm font-medium text-slate-700">Kniha</label>
			<select
				id="bookId"
				name="bookId"
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>
				<option value="">Bez vazby na knihu</option>
				{#each data.books as book (book.id)}
					<option value={book.id} selected={submittedValues.bookId === book.id}>{book.title}</option
					>
				{/each}
			</select>
			{#if formErrors.bookId}
				<p class="text-sm text-red-700">{formErrors.bookId}</p>
			{/if}
		</div>

		<div class="space-y-2">
			<label for="content" class="text-sm font-medium text-slate-700">Obsah</label>
			<textarea
				id="content"
				name="content"
				rows="12"
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
				>{submittedValues.content}</textarea
			>
			{#if formErrors.content}
				<p class="text-sm text-red-700">{formErrors.content}</p>
			{/if}
		</div>

		<div class="flex flex-wrap gap-3">
			<button
				type="submit"
				class="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none"
			>
				Ulozit poznamku
			</button>
		</div>
	</form>

	<form method="POST" action="?/delete">
		<button
			type="submit"
			class="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:outline-none"
		>
			Smazat poznamku
		</button>
	</form>
</section>
