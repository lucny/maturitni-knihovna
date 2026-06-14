import { z } from 'zod';

import type { AuthorEditorData } from '$lib/models/author';

import { createContentSlug } from './content-slug';

export const authorFormSchema = z.object({
	firstName: z.string().trim().min(1, 'Vyplnte jmeno autora.').max(200, 'Jmeno je prilis dlouhe.'),
	lastName: z
		.string()
		.trim()
		.min(1, 'Vyplnte prijmeni autora.')
		.max(200, 'Prijmeni je prilis dlouhe.'),
	slug: z
		.string()
		.trim()
		.max(200, 'Slug je prilis dlouhy.')
		.optional()
		.transform((value) => value || undefined),
	birthDate: optionalDate('Datum narozeni neni platne.'),
	deathDate: optionalDate('Datum umrti neni platne.'),
	nationality: optionalText(200, 'Narodnost je prilis dlouha.'),
	occupation: optionalText(300, 'Povolani je prilis dlouhe.'),
	biography: optionalText(20000, 'Zivotopis je prilis dlouhy.'),
	interestingFacts: optionalText(20000, 'Zajimavosti jsou prilis dlouhe.'),
	website: z
		.string()
		.trim()
		.optional()
		.transform((value) => value || undefined)
		.refine((value) => !value || z.url().safeParse(value).success, 'Web musi byt platna URL.')
});

export type AuthorFormValues = {
	firstName: string;
	lastName: string;
	slug?: string;
	birthDate?: string;
	deathDate?: string;
	nationality?: string;
	occupation?: string;
	biography?: string;
	interestingFacts?: string;
	website?: string;
};

export type AuthorFormErrors = Partial<Record<keyof AuthorFormValues, string>>;

export type AuthorFormValidationResult =
	| {
			success: true;
			data: AuthorEditorData;
	  }
	| {
			success: false;
			values: AuthorFormValues;
			errors: AuthorFormErrors;
	  };

export function createEmptyAuthorFormValues(): AuthorFormValues {
	return {
		firstName: '',
		lastName: '',
		slug: undefined,
		birthDate: undefined,
		deathDate: undefined,
		nationality: '',
		occupation: '',
		biography: '',
		interestingFacts: '',
		website: undefined
	};
}

export function validateAuthorForm(formData: FormData): AuthorFormValidationResult {
	const values: AuthorFormValues = {
		firstName: String(formData.get('firstName') ?? ''),
		lastName: String(formData.get('lastName') ?? ''),
		slug: String(formData.get('slug') ?? '') || undefined,
		birthDate: String(formData.get('birthDate') ?? '') || undefined,
		deathDate: String(formData.get('deathDate') ?? '') || undefined,
		nationality: String(formData.get('nationality') ?? ''),
		occupation: String(formData.get('occupation') ?? ''),
		biography: String(formData.get('biography') ?? ''),
		interestingFacts: String(formData.get('interestingFacts') ?? ''),
		website: String(formData.get('website') ?? '') || undefined
	};

	const result = authorFormSchema.safeParse(values);

	if (result.success) {
		return {
			success: true,
			data: {
				...result.data,
				slug:
					result.data.slug ?? createContentSlug(`${result.data.firstName} ${result.data.lastName}`)
			}
		};
	}

	return {
		success: false,
		values,
		errors: result.error.issues.reduce<AuthorFormErrors>((errors, issue) => {
			const fieldName = issue.path[0];

			if (isAuthorFormField(fieldName)) {
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

function optionalDate(message: string) {
	return z
		.string()
		.trim()
		.optional()
		.transform((value) => value || undefined)
		.refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), message);
}

function isAuthorFormField(value: unknown): value is keyof AuthorFormValues {
	return (
		value === 'firstName' ||
		value === 'lastName' ||
		value === 'slug' ||
		value === 'birthDate' ||
		value === 'deathDate' ||
		value === 'nationality' ||
		value === 'occupation' ||
		value === 'biography' ||
		value === 'interestingFacts' ||
		value === 'website'
	);
}
