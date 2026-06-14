<script lang="ts">
	import type {
		LiteraryPeriodFormErrors,
		LiteraryPeriodFormValues
	} from '$lib/schemas/literary-period.schema';

	let {
		action,
		errors,
		submitLabel,
		values
	}: {
		action: string;
		errors: LiteraryPeriodFormErrors;
		submitLabel: string;
		values: LiteraryPeriodFormValues;
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
			<label for="startYear" class="text-sm font-medium text-slate-700">Zacatek</label>
			<input
				id="startYear"
				name="startYear"
				type="number"
				step="1"
				value={values.startYear ?? ''}
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			/>
			{#if errors.startYear}<p class="text-sm text-red-700">{errors.startYear}</p>{/if}
		</div>
		<div class="space-y-2">
			<label for="endYear" class="text-sm font-medium text-slate-700">Konec</label>
			<input
				id="endYear"
				name="endYear"
				type="number"
				step="1"
				value={values.endYear ?? ''}
				class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			/>
			{#if errors.endYear}<p class="text-sm text-red-700">{errors.endYear}</p>{/if}
		</div>
	</div>

	<div class="space-y-2">
		<label for="description" class="text-sm font-medium text-slate-700">Popis</label>
		<textarea
			id="description"
			name="description"
			rows="6"
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>{values.description ?? ''}</textarea
		>
		{#if errors.description}<p class="text-sm text-red-700">{errors.description}</p>{/if}
	</div>

	<div class="space-y-2">
		<label for="historicalContext" class="text-sm font-medium text-slate-700"
			>Historicky kontext</label
		>
		<textarea
			id="historicalContext"
			name="historicalContext"
			rows="8"
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>{values.historicalContext ?? ''}</textarea
		>
		{#if errors.historicalContext}<p class="text-sm text-red-700">
				{errors.historicalContext}
			</p>{/if}
	</div>

	<div class="space-y-2">
		<label for="characteristics" class="text-sm font-medium text-slate-700">Charakteristika</label>
		<textarea
			id="characteristics"
			name="characteristics"
			rows="8"
			class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
			>{values.characteristics ?? ''}</textarea
		>
		{#if errors.characteristics}<p class="text-sm text-red-700">{errors.characteristics}</p>{/if}
	</div>

	<button
		type="submit"
		class="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none"
	>
		{submitLabel}
	</button>
</form>
