import { z } from 'zod';

import type { BookEditorData } from '$lib/models/book';

import { createContentSlug } from './content-slug';

export const bookFormSchema = z.object({
	title: z.string().trim().min(1, 'Vyplnte nazev knihy.').max(300, 'Nazev je prilis dlouhy.'),
	slug: z
		.string()
		.trim()
		.max(200, 'Slug je prilis dlouhy.')
		.optional()
		.transform((value) => value || undefined),
	originalTitle: optionalText(300, 'Originalni nazev je prilis dlouhy.'),
	publicationYear: optionalYear('Rok vydani musi byt cele cislo.'),
	originalLanguage: optionalText(100, 'Jazyk je prilis dlouhy.'),
	isbn: optionalText(32, 'ISBN je prilis dlouhe.'),
	authorId: z.string().trim().min(1, 'Vyberte autora.').max(100, 'Neplatny autor.'),
	literaryPeriodId: optionalRelation('Neplatne literarni obdobi.'),
	genreIds: z.array(z.string().trim().max(100, 'Neplatny zanr.')).max(20, 'Vyberte mene zanru.'),
	annotation: optionalText(20000, 'Anotace je prilis dlouha.'),
	contentSummary: optionalText(20000, 'Obsah dila je prilis dlouhy.'),
	interpretation: optionalText(20000, 'Interpretace je prilis dlouha.'),
	historicalContext: optionalText(20000, 'Literarne historicky kontext je prilis dlouhy.'),
	themes: optionalText(20000, 'Temata jsou prilis dlouha.'),
	motifs: optionalText(20000, 'Motivy jsou prilis dlouhe.'),
	composition: optionalText(20000, 'Kompozice je prilis dlouha.'),
	narrator: optionalText(20000, 'Vypravec je prilis dlouhy.'),
	timeSpace: optionalText(20000, 'Casoprostor je prilis dlouhy.'),
	languageFeatures: optionalText(20000, 'Jazykove prostredky jsou prilis dlouhe.'),
	literaryFeatures: optionalText(20000, 'Literarni prostredky jsou prilis dlouhe.'),
	importance: optionalText(20000, 'Dulezitost je prilis dlouha.'),
	examNotes: optionalText(20000, 'Maturitni poznamky jsou prilis dlouhe.'),
	examQuestions: optionalText(20000, 'Maturitni otazky jsou prilis dlouhe.'),
	connections: optionalText(20000, 'Souvislosti jsou prilis dlouhe.'),
	published: z.boolean(),
	publishedAt: optionalDate('Datum publikace neni platne.')
});

export type BookFormValues = {
	title: string;
	slug?: string;
	originalTitle?: string;
	publicationYear?: number;
	originalLanguage?: string;
	isbn?: string;
	authorId: string;
	literaryPeriodId?: string;
	genreIds: string[];
	annotation?: string;
	contentSummary?: string;
	interpretation?: string;
	historicalContext?: string;
	themes?: string;
	motifs?: string;
	composition?: string;
	narrator?: string;
	timeSpace?: string;
	languageFeatures?: string;
	literaryFeatures?: string;
	importance?: string;
	examNotes?: string;
	examQuestions?: string;
	connections?: string;
	published: boolean;
	publishedAt?: string;
};

export type BookFormErrors = Partial<Record<keyof BookFormValues, string>>;

export type BookFormValidationResult =
	| {
			success: true;
			data: BookEditorData;
	  }
	| {
			success: false;
			values: BookFormValues;
			errors: BookFormErrors;
	  };

export function createEmptyBookFormValues(): BookFormValues {
	return {
		title: '',
		slug: undefined,
		originalTitle: '',
		publicationYear: undefined,
		originalLanguage: '',
		isbn: '',
		authorId: '',
		literaryPeriodId: undefined,
		genreIds: [],
		annotation: '',
		contentSummary: '',
		interpretation: '',
		historicalContext: '',
		themes: '',
		motifs: '',
		composition: '',
		narrator: '',
		timeSpace: '',
		languageFeatures: '',
		literaryFeatures: '',
		importance: '',
		examNotes: '',
		examQuestions: '',
		connections: '',
		published: false,
		publishedAt: undefined
	};
}

export function validateBookForm(formData: FormData): BookFormValidationResult {
	const values: BookFormValues = {
		title: String(formData.get('title') ?? ''),
		slug: String(formData.get('slug') ?? '') || undefined,
		originalTitle: String(formData.get('originalTitle') ?? ''),
		publicationYear: parseOptionalNumber(formData.get('publicationYear')),
		originalLanguage: String(formData.get('originalLanguage') ?? ''),
		isbn: String(formData.get('isbn') ?? ''),
		authorId: String(formData.get('authorId') ?? ''),
		literaryPeriodId: String(formData.get('literaryPeriodId') ?? '') || undefined,
		genreIds: formData.getAll('genreIds').map(String).filter(Boolean),
		annotation: String(formData.get('annotation') ?? ''),
		contentSummary: String(formData.get('contentSummary') ?? ''),
		interpretation: String(formData.get('interpretation') ?? ''),
		historicalContext: String(formData.get('historicalContext') ?? ''),
		themes: String(formData.get('themes') ?? ''),
		motifs: String(formData.get('motifs') ?? ''),
		composition: String(formData.get('composition') ?? ''),
		narrator: String(formData.get('narrator') ?? ''),
		timeSpace: String(formData.get('timeSpace') ?? ''),
		languageFeatures: String(formData.get('languageFeatures') ?? ''),
		literaryFeatures: String(formData.get('literaryFeatures') ?? ''),
		importance: String(formData.get('importance') ?? ''),
		examNotes: String(formData.get('examNotes') ?? ''),
		examQuestions: String(formData.get('examQuestions') ?? ''),
		connections: String(formData.get('connections') ?? ''),
		published: formData.get('published') === 'on',
		publishedAt: String(formData.get('publishedAt') ?? '') || undefined
	};

	const result = bookFormSchema.safeParse(values);

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
		errors: result.error.issues.reduce<BookFormErrors>((errors, issue) => {
			const fieldName = issue.path[0];

			if (isBookFormField(fieldName)) {
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

function optionalRelation(message: string) {
	return z
		.string()
		.trim()
		.max(100, message)
		.optional()
		.transform((value) => value || undefined);
}

function optionalYear(message: string) {
	return z.number(message).int(message).min(-3000, message).max(3000, message).optional();
}

function optionalDate(message: string) {
	return z
		.string()
		.trim()
		.optional()
		.transform((value) => value || undefined)
		.refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), message);
}

function parseOptionalNumber(value: FormDataEntryValue | null): number | undefined {
	const normalizedValue = String(value ?? '').trim();

	if (!normalizedValue) {
		return undefined;
	}

	return Number(normalizedValue);
}

function isBookFormField(value: unknown): value is keyof BookFormValues {
	return (
		value === 'title' ||
		value === 'slug' ||
		value === 'originalTitle' ||
		value === 'publicationYear' ||
		value === 'originalLanguage' ||
		value === 'isbn' ||
		value === 'authorId' ||
		value === 'literaryPeriodId' ||
		value === 'genreIds' ||
		value === 'annotation' ||
		value === 'contentSummary' ||
		value === 'interpretation' ||
		value === 'historicalContext' ||
		value === 'themes' ||
		value === 'motifs' ||
		value === 'composition' ||
		value === 'narrator' ||
		value === 'timeSpace' ||
		value === 'languageFeatures' ||
		value === 'literaryFeatures' ||
		value === 'importance' ||
		value === 'examNotes' ||
		value === 'examQuestions' ||
		value === 'connections' ||
		value === 'published' ||
		value === 'publishedAt'
	);
}
