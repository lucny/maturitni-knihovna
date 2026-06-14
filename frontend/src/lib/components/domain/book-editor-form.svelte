<script lang="ts">
	import type { Author } from '$lib/models/author';
	import type { Genre } from '$lib/models/genre';
	import type { LiteraryPeriod } from '$lib/models/literary-period';
	import type { BookFormErrors, BookFormValues } from '$lib/schemas/book.schema';

	let {
		action,
		authors,
		errors,
		genres,
		literaryPeriods,
		submitLabel,
		values
	}: {
		action: string;
		authors: Author[];
		errors: BookFormErrors;
		genres: Genre[];
		literaryPeriods: LiteraryPeriod[];
		submitLabel: string;
		values: BookFormValues;
	} = $props();
</script>

<form
	method="POST"
	{action}
	class="max-w-3xl space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
>
	<div class="space-y-2">
		<label for="title" class="text-sm font-medium text-slate-700">Nazev</label>
		<input
			id="title"
			name="title"
			value={values.title}
			maxlength="300"
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
		/>
		{#if errors.title}<p class="text-sm text-red-700">{errors.title}</p>{/if}
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<div class="space-y-2">
			<label for="slug" class="text-sm font-medium text-slate-700">Slug</label>
			<input
				id="slug"
				name="slug"
				value={values.slug ?? ''}
				maxlength="200"
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			/>
			{#if errors.slug}<p class="text-sm text-red-700">{errors.slug}</p>{/if}
		</div>
		<div class="space-y-2">
			<label for="originalTitle" class="text-sm font-medium text-slate-700">Originalni nazev</label>
			<input
				id="originalTitle"
				name="originalTitle"
				value={values.originalTitle ?? ''}
				maxlength="300"
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			/>
			{#if errors.originalTitle}<p class="text-sm text-red-700">{errors.originalTitle}</p>{/if}
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-3">
		<div class="space-y-2">
			<label for="publicationYear" class="text-sm font-medium text-slate-700">Rok vydani</label>
			<input
				id="publicationYear"
				name="publicationYear"
				type="number"
				step="1"
				value={values.publicationYear ?? ''}
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			/>
			{#if errors.publicationYear}<p class="text-sm text-red-700">{errors.publicationYear}</p>{/if}
		</div>
		<div class="space-y-2">
			<label for="originalLanguage" class="text-sm font-medium text-slate-700"
				>Jazyk originalu</label
			>
			<input
				id="originalLanguage"
				name="originalLanguage"
				value={values.originalLanguage ?? ''}
				maxlength="100"
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			/>
			{#if errors.originalLanguage}<p class="text-sm text-red-700">
					{errors.originalLanguage}
				</p>{/if}
		</div>
		<div class="space-y-2">
			<label for="isbn" class="text-sm font-medium text-slate-700">ISBN</label>
			<input
				id="isbn"
				name="isbn"
				value={values.isbn ?? ''}
				maxlength="32"
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			/>
			{#if errors.isbn}<p class="text-sm text-red-700">{errors.isbn}</p>{/if}
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<div class="space-y-2">
			<label for="authorId" class="text-sm font-medium text-slate-700">Autor</label>
			<select
				id="authorId"
				name="authorId"
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>
				<option value="">Vyberte autora</option>
				{#each authors as author (author.id)}
					<option value={author.id} selected={values.authorId === author.id}
						>{author.firstName} {author.lastName}</option
					>
				{/each}
			</select>
			{#if errors.authorId}<p class="text-sm text-red-700">{errors.authorId}</p>{/if}
		</div>
		<div class="space-y-2">
			<label for="literaryPeriodId" class="text-sm font-medium text-slate-700"
				>Literarni obdobi</label
			>
			<select
				id="literaryPeriodId"
				name="literaryPeriodId"
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>
				<option value="">Bez obdobi</option>
				{#each literaryPeriods as period (period.id)}
					<option value={period.id} selected={values.literaryPeriodId === period.id}
						>{period.title}</option
					>
				{/each}
			</select>
			{#if errors.literaryPeriodId}<p class="text-sm text-red-700">
					{errors.literaryPeriodId}
				</p>{/if}
		</div>
	</div>

	<div class="space-y-2">
		<label for="genreIds" class="text-sm font-medium text-slate-700">Zanry</label>
		<select
			id="genreIds"
			name="genreIds"
			multiple
			size="5"
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
		>
			{#each genres as genre (genre.id)}
				<option value={genre.id} selected={values.genreIds.includes(genre.id)}>{genre.title}</option
				>
			{/each}
		</select>
		{#if errors.genreIds}<p class="text-sm text-red-700">{errors.genreIds}</p>{/if}
	</div>

	<label class="flex items-center gap-2 text-sm font-medium text-slate-700">
		<input
			name="published"
			type="checkbox"
			checked={values.published}
			class="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
		/>
		Publikovat
	</label>

	<div class="space-y-2">
		<label for="publishedAt" class="text-sm font-medium text-slate-700">Datum publikace</label>
		<input
			id="publishedAt"
			name="publishedAt"
			type="date"
			value={values.publishedAt ?? ''}
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
		/>
		{#if errors.publishedAt}<p class="text-sm text-red-700">{errors.publishedAt}</p>{/if}
	</div>

	<div class="space-y-2">
		<label for="annotation" class="text-sm font-medium text-slate-700">Anotace</label>
		<textarea
			id="annotation"
			name="annotation"
			rows="5"
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>{values.annotation ?? ''}</textarea
		>
		{#if errors.annotation}<p class="text-sm text-red-700">{errors.annotation}</p>{/if}
	</div>

	<div class="space-y-2">
		<label for="contentSummary" class="text-sm font-medium text-slate-700">Obsah dila</label>
		<textarea
			id="contentSummary"
			name="contentSummary"
			rows="7"
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>{values.contentSummary ?? ''}</textarea
		>
		{#if errors.contentSummary}<p class="text-sm text-red-700">{errors.contentSummary}</p>{/if}
	</div>

	<div class="space-y-2">
		<label for="interpretation" class="text-sm font-medium text-slate-700">Interpretace</label>
		<textarea
			id="interpretation"
			name="interpretation"
			rows="7"
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>{values.interpretation ?? ''}</textarea
		>
		{#if errors.interpretation}<p class="text-sm text-red-700">{errors.interpretation}</p>{/if}
	</div>

	<button
		type="submit"
		class="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none"
	>
		{submitLabel}
	</button>
</form>
