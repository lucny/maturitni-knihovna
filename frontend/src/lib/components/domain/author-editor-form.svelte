<script lang="ts">
	import type { AuthorFormErrors, AuthorFormValues } from '$lib/schemas/author.schema';

	let {
		action,
		errors,
		submitLabel,
		values
	}: {
		action: string;
		errors: AuthorFormErrors;
		submitLabel: string;
		values: AuthorFormValues;
	} = $props();
</script>

<form
	method="POST"
	{action}
	class="max-w-3xl space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
>
	<div class="grid gap-4 md:grid-cols-2">
		<div class="space-y-2">
			<label for="firstName" class="text-sm font-medium text-slate-700">Jmeno</label>
			<input
				id="firstName"
				name="firstName"
				value={values.firstName}
				maxlength="200"
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			/>
			{#if errors.firstName}<p class="text-sm text-red-700">{errors.firstName}</p>{/if}
		</div>
		<div class="space-y-2">
			<label for="lastName" class="text-sm font-medium text-slate-700">Prijmeni</label>
			<input
				id="lastName"
				name="lastName"
				value={values.lastName}
				maxlength="200"
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			/>
			{#if errors.lastName}<p class="text-sm text-red-700">{errors.lastName}</p>{/if}
		</div>
	</div>

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

	<div class="grid gap-4 md:grid-cols-2">
		<div class="space-y-2">
			<label for="birthDate" class="text-sm font-medium text-slate-700">Datum narozeni</label>
			<input
				id="birthDate"
				name="birthDate"
				type="date"
				value={values.birthDate ?? ''}
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			/>
			{#if errors.birthDate}<p class="text-sm text-red-700">{errors.birthDate}</p>{/if}
		</div>
		<div class="space-y-2">
			<label for="deathDate" class="text-sm font-medium text-slate-700">Datum umrti</label>
			<input
				id="deathDate"
				name="deathDate"
				type="date"
				value={values.deathDate ?? ''}
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			/>
			{#if errors.deathDate}<p class="text-sm text-red-700">{errors.deathDate}</p>{/if}
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<div class="space-y-2">
			<label for="nationality" class="text-sm font-medium text-slate-700">Narodnost</label>
			<input
				id="nationality"
				name="nationality"
				value={values.nationality ?? ''}
				maxlength="200"
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			/>
			{#if errors.nationality}<p class="text-sm text-red-700">{errors.nationality}</p>{/if}
		</div>
		<div class="space-y-2">
			<label for="occupation" class="text-sm font-medium text-slate-700">Povolani</label>
			<input
				id="occupation"
				name="occupation"
				value={values.occupation ?? ''}
				maxlength="300"
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			/>
			{#if errors.occupation}<p class="text-sm text-red-700">{errors.occupation}</p>{/if}
		</div>
	</div>

	<div class="space-y-2">
		<label for="website" class="text-sm font-medium text-slate-700">Web</label>
		<input
			id="website"
			name="website"
			type="url"
			value={values.website ?? ''}
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
		/>
		{#if errors.website}<p class="text-sm text-red-700">{errors.website}</p>{/if}
	</div>

	<div class="space-y-2">
		<label for="biography" class="text-sm font-medium text-slate-700">Zivotopis</label>
		<textarea
			id="biography"
			name="biography"
			rows="8"
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>{values.biography ?? ''}</textarea
		>
		{#if errors.biography}<p class="text-sm text-red-700">{errors.biography}</p>{/if}
	</div>

	<div class="space-y-2">
		<label for="interestingFacts" class="text-sm font-medium text-slate-700">Zajimavosti</label>
		<textarea
			id="interestingFacts"
			name="interestingFacts"
			rows="5"
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>{values.interestingFacts ?? ''}</textarea
		>
		{#if errors.interestingFacts}<p class="text-sm text-red-700">{errors.interestingFacts}</p>{/if}
	</div>

	<button
		type="submit"
		class="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none"
	>
		{submitLabel}
	</button>
</form>
