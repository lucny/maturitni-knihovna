import { z } from 'zod';

import type { LiteraryPeriodEditorData } from '$lib/models/literary-period';

import { createContentSlug } from './content-slug';

export const literaryPeriodFormSchema = z
	.object({
		title: z.string().trim().min(1, 'Vyplnte nazev obdobi.').max(300, 'Nazev je prilis dlouhy.'),
		slug: z
			.string()
			.trim()
			.max(200, 'Slug je prilis dlouhy.')
			.optional()
			.transform((value) => value || undefined),
		description: optionalText(20000, 'Popis je prilis dlouhy.'),
		startYear: optionalYear('Zacatek obdobi musi byt cele cislo.'),
		endYear: optionalYear('Konec obdobi musi byt cele cislo.'),
		historicalContext: optionalText(20000, 'Historicky kontext je prilis dlouhy.'),
		characteristics: optionalText(20000, 'Charakteristika je prilis dlouha.')
	})
	.refine(
		(value) =>
			value.startYear === undefined ||
			value.endYear === undefined ||
			value.startYear <= value.endYear,
		{
			path: ['endYear'],
			message: 'Konec obdobi nesmi byt pred zacatkem.'
		}
	);

export type LiteraryPeriodFormValues = {
	title: string;
	slug?: string;
	description?: string;
	startYear?: number;
	endYear?: number;
	historicalContext?: string;
	characteristics?: string;
};

export type LiteraryPeriodFormErrors = Partial<Record<keyof LiteraryPeriodFormValues, string>>;

export type LiteraryPeriodFormValidationResult =
	| {
			success: true;
			data: LiteraryPeriodEditorData;
	  }
	| {
			success: false;
			values: LiteraryPeriodFormValues;
			errors: LiteraryPeriodFormErrors;
	  };

export function createEmptyLiteraryPeriodFormValues(): LiteraryPeriodFormValues {
	return {
		title: '',
		slug: undefined,
		description: '',
		startYear: undefined,
		endYear: undefined,
		historicalContext: '',
		characteristics: ''
	};
}

export function validateLiteraryPeriodForm(formData: FormData): LiteraryPeriodFormValidationResult {
	const values: LiteraryPeriodFormValues = {
		title: String(formData.get('title') ?? ''),
		slug: String(formData.get('slug') ?? '') || undefined,
		description: String(formData.get('description') ?? ''),
		startYear: parseOptionalNumber(formData.get('startYear')),
		endYear: parseOptionalNumber(formData.get('endYear')),
		historicalContext: String(formData.get('historicalContext') ?? ''),
		characteristics: String(formData.get('characteristics') ?? '')
	};

	const result = literaryPeriodFormSchema.safeParse(values);

	if (result.success) {
		return {
			success: true,
			data: {
				...result.data,
				slug: result.data.slug ?? createContentSlug(result.data.title)
			}
		};
	}

	return {
		success: false,
		values,
		errors: result.error.issues.reduce<LiteraryPeriodFormErrors>((errors, issue) => {
			const fieldName = issue.path[0];

			if (isLiteraryPeriodFormField(fieldName)) {
				errors[fieldName] = issue.message;
			}

			return errors;
		}, {})
	};
}

function optionalText(max: number, message: string) {
	return z
		.string()
		.trim()
		.max(max, message)
		.optional()
		.transform((value) => value || undefined);
}

function optionalYear(message: string) {
	return z.number(message).int(message).min(-3000, message).max(3000, message).optional();
}

function parseOptionalNumber(value: FormDataEntryValue | null): number | undefined {
	const normalizedValue = String(value ?? '').trim();

	if (!normalizedValue) {
		return undefined;
	}

	return Number(normalizedValue);
}

function isLiteraryPeriodFormField(value: unknown): value is keyof LiteraryPeriodFormValues {
	return (
		value === 'title' ||
		value === 'slug' ||
		value === 'description' ||
		value === 'startYear' ||
		value === 'endYear' ||
		value === 'historicalContext' ||
		value === 'characteristics'
	);
}
