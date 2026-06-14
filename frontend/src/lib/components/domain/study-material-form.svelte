<script lang="ts">
	import { resolve } from '$app/paths';

	import type { Author } from '$lib/models/author';
	import type { Book } from '$lib/models/book';
	import { STUDY_MATERIAL_TYPES } from '$lib/models/study-material';
	import type {
		StudyMaterialFormErrors,
		StudyMaterialFormValues
	} from '$lib/schemas/study-material.schema';

	let {
		action,
		authors,
		books,
		currentAttachmentName,
		currentAttachmentUrl,
		errors,
		submitLabel,
		values
	}: {
		action: string;
		authors: Author[];
		books: Book[];
		currentAttachmentName?: string;
		currentAttachmentUrl?: string;
		errors: StudyMaterialFormErrors;
		submitLabel: string;
		values: StudyMaterialFormValues;
	} = $props();
</script>

<form
	method="POST"
	{action}
	enctype="multipart/form-data"
	class="max-w-3xl space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
>
	<div class="space-y-2">
		<label for="title" class="text-sm font-medium text-slate-700">Nazev</label>
		<input
			id="title"
			name="title"
			type="text"
			maxlength="300"
			value={values.title}
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
		/>
		{#if errors.title}
			<p class="text-sm text-red-700">{errors.title}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="slug" class="text-sm font-medium text-slate-700">Slug</label>
		<input
			id="slug"
			name="slug"
			type="text"
			maxlength="200"
			value={values.slug ?? ''}
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
		/>
		{#if errors.slug}
			<p class="text-sm text-red-700">{errors.slug}</p>
		{/if}
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<div class="space-y-2">
			<label for="materialType" class="text-sm font-medium text-slate-700">Typ materialu</label>
			<select
				id="materialType"
				name="materialType"
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>
				<option
					value={STUDY_MATERIAL_TYPES.WORKSHEET}
					selected={values.materialType === STUDY_MATERIAL_TYPES.WORKSHEET}>Pracovni list</option
				>
				<option
					value={STUDY_MATERIAL_TYPES.PRESENTATION}
					selected={values.materialType === STUDY_MATERIAL_TYPES.PRESENTATION}>Prezentace</option
				>
				<option
					value={STUDY_MATERIAL_TYPES.ANALYSIS}
					selected={values.materialType === STUDY_MATERIAL_TYPES.ANALYSIS}>Rozbor</option
				>
				<option
					value={STUDY_MATERIAL_TYPES.VIDEO}
					selected={values.materialType === STUDY_MATERIAL_TYPES.VIDEO}>Video</option
				>
				<option
					value={STUDY_MATERIAL_TYPES.LINK}
					selected={values.materialType === STUDY_MATERIAL_TYPES.LINK}>Odkaz</option
				>
			</select>
			{#if errors.materialType}
				<p class="text-sm text-red-700">{errors.materialType}</p>
			{/if}
		</div>

		<div class="flex items-end">
			<label class="flex items-center gap-2 text-sm font-medium text-slate-700">
				<input
					name="published"
					type="checkbox"
					checked={values.published}
					class="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
				/>
				Publikovat
			</label>
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<div class="space-y-2">
			<label for="bookId" class="text-sm font-medium text-slate-700">Kniha</label>
			<select
				id="bookId"
				name="bookId"
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>
				<option value="">Bez vazby na knihu</option>
				{#each books as book (book.id)}
					<option value={book.id} selected={values.bookId === book.id}>{book.title}</option>
				{/each}
			</select>
			{#if errors.bookId}
				<p class="text-sm text-red-700">{errors.bookId}</p>
			{/if}
		</div>

		<div class="space-y-2">
			<label for="authorId" class="text-sm font-medium text-slate-700">Autor</label>
			<select
				id="authorId"
				name="authorId"
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>
				<option value="">Bez vazby na autora</option>
				{#each authors as author (author.id)}
					<option value={author.id} selected={values.authorId === author.id}>
						{author.firstName}
						{author.lastName}
					</option>
				{/each}
			</select>
			{#if errors.authorId}
				<p class="text-sm text-red-700">{errors.authorId}</p>
			{/if}
		</div>
	</div>

	<div class="space-y-2">
		<label for="description" class="text-sm font-medium text-slate-700">Popis</label>
		<textarea
			id="description"
			name="description"
			rows="5"
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>{values.description ?? ''}</textarea
		>
		{#if errors.description}
			<p class="text-sm text-red-700">{errors.description}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<label for="content" class="text-sm font-medium text-slate-700">Obsah</label>
		<textarea
			id="content"
			name="content"
			rows="10"
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>{values.content ?? ''}</textarea
		>
		{#if errors.content}
			<p class="text-sm text-red-700">{errors.content}</p>
		{/if}
	</div>

	<div class="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
		<div class="space-y-1">
			<label for="attachment" class="text-sm font-medium text-slate-700">Priloha</label>
			<p class="text-sm leading-6 text-slate-600">
				Povolene formaty: PDF, DOCX, PPTX, JPG, PNG a WEBP. Maximalni velikost je 25 MB.
			</p>
		</div>

		{#if currentAttachmentName && currentAttachmentUrl}
			<div class="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
				<p class="font-medium text-slate-950">Aktualni priloha</p>
				<a
					href={resolve(currentAttachmentUrl as '/')}
					target="_blank"
					rel="noreferrer"
					class="mt-1 inline-flex text-[var(--color-primary)] hover:underline"
				>
					{currentAttachmentName}
				</a>
				<label class="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700">
					<input
						name="removeAttachment"
						type="checkbox"
						class="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
					/>
					Odstranit prilohu pri ulozeni
				</label>
			</div>
		{/if}

		<input
			id="attachment"
			name="attachment"
			type="file"
			accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png,.webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,image/jpeg,image/png,image/webp"
			class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
		/>
		{#if errors.attachment}
			<p class="text-sm text-red-700">{errors.attachment}</p>
		{/if}
	</div>

	<button
		type="submit"
		class="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none"
	>
		{submitLabel}
	</button>
</form>
