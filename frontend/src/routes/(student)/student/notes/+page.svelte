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
	<title>Moje poznamky | Maturitni knihovna</title>
	<meta name="description" content="Osobni poznamky prihlaseneho studenta." />
</svelte:head>

<section class="space-y-8">
	<div class="max-w-3xl space-y-2">
		<p class="text-sm font-semibold tracking-wide text-[var(--color-primary)] uppercase">
			Moje poznamky
		</p>
		<h1 class="text-3xl font-semibold text-slate-950">Osobni poznamky</h1>
		<p class="text-base leading-7 text-slate-700">
			Poznamky jsou soukrome a jsou vzdy svazane s aktualne prihlasenym uzivatelem.
		</p>
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

	<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
		<div class="space-y-4">
			{#if data.notes.length > 0}
				{#each data.notes as note (note.id)}
					<article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
						<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
							<div class="space-y-2">
								<a
									href={resolve(`/student/notes/${note.id}`)}
									class="text-lg font-semibold text-slate-950 hover:text-[var(--color-primary)]"
								>
									{note.title}
								</a>
								<p class="line-clamp-2 text-sm leading-6 text-slate-600">{note.content}</p>
								<p class="text-xs text-slate-500">Upraveno: {note.updated}</p>
							</div>

							<form method="POST" action="?/delete">
								<input type="hidden" name="id" value={note.id} />
								<button
									type="submit"
									class="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:outline-none"
								>
									Smazat
								</button>
							</form>
						</div>
					</article>
				{/each}
			{:else if !data.loadError}
				<div class="rounded-lg border border-dashed border-slate-300 bg-white p-8">
					<p class="text-sm font-medium text-slate-700">Zatim nemate zadne poznamky.</p>
					<p class="mt-2 text-sm leading-6 text-slate-600">
						Vytvorte prvni poznamku pomoci formulare na teto strance.
					</p>
				</div>
			{/if}
		</div>

		<form
			method="POST"
			action="?/create"
			class="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
		>
			<div class="space-y-1">
				<h2 class="text-xl font-semibold text-slate-950">Nova poznamka</h2>
				<p class="text-sm leading-6 text-slate-600">Poznamka bude ulozena k vasemu uctu.</p>
			</div>

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
						<option value={book.id} selected={submittedValues.bookId === book.id}
							>{book.title}</option
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
					rows="8"
					class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
					>{submittedValues.content}</textarea
				>
				{#if formErrors.content}
					<p class="text-sm text-red-700">{formErrors.content}</p>
				{/if}
			</div>

			<button
				type="submit"
				class="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none"
			>
				Vytvorit poznamku
			</button>
		</form>
	</div>
</section>
