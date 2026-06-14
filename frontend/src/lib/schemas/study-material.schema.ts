import { z } from 'zod';

import {
	STUDY_MATERIAL_TYPES,
	type StudyMaterialCreateData,
	type StudyMaterialType
} from '$lib/models/study-material';

const materialTypeValues = [
	STUDY_MATERIAL_TYPES.WORKSHEET,
	STUDY_MATERIAL_TYPES.PRESENTATION,
	STUDY_MATERIAL_TYPES.ANALYSIS,
	STUDY_MATERIAL_TYPES.VIDEO,
	STUDY_MATERIAL_TYPES.LINK
] as const;

export const studyMaterialFormSchema = z.object({
	title: z.string().trim().min(1, 'Vyplnte nazev materialu.').max(300, 'Nazev je prilis dlouhy.'),
	slug: z
		.string()
		.trim()
		.max(200, 'Slug je prilis dlouhy.')
		.optional()
		.transform((value) => value || undefined),
	description: z.string().trim().max(10000, 'Popis je prilis dlouhy.').optional(),
	materialType: z.enum(materialTypeValues, {
		message: 'Vyberte platny typ materialu.'
	}),
	content: z.string().trim().max(20000, 'Obsah je prilis dlouhy.').optional(),
	bookId: z
		.string()
		.trim()
		.max(100, 'Neplatna vazba na knihu.')
		.optional()
		.transform((value) => value || undefined),
	authorId: z
		.string()
		.trim()
		.max(100, 'Neplatna vazba na autora.')
		.optional()
		.transform((value) => value || undefined),
	published: z.boolean()
});

export type StudyMaterialFormValues = {
	title: string;
	slug?: string;
	description?: string;
	materialType: StudyMaterialType;
	content?: string;
	bookId?: string;
	authorId?: string;
	published: boolean;
};
export type StudyMaterialFormErrors = Partial<Record<keyof StudyMaterialFormValues, string>>;

export type StudyMaterialFormValidationResult =
	| {
			success: true;
			data: StudyMaterialCreateData;
	  }
	| {
			success: false;
			values: StudyMaterialFormValues;
			errors: StudyMaterialFormErrors;
	  };

export function createEmptyStudyMaterialFormValues(): StudyMaterialFormValues {
	return {
		title: '',
		slug: undefined,
		description: '',
		materialType: STUDY_MATERIAL_TYPES.WORKSHEET,
		content: '',
		bookId: undefined,
		authorId: undefined,
		published: false
	};
}

export function validateStudyMaterialForm(formData: FormData): StudyMaterialFormValidationResult {
	const values: StudyMaterialFormValues = {
		title: String(formData.get('title') ?? ''),
		slug: String(formData.get('slug') ?? '') || undefined,
		description: String(formData.get('description') ?? ''),
		materialType: normalizeMaterialType(formData.get('materialType')),
		content: String(formData.get('content') ?? ''),
		bookId: String(formData.get('bookId') ?? '') || undefined,
		authorId: String(formData.get('authorId') ?? '') || undefined,
		published: formData.get('published') === 'on'
	};

	const result = studyMaterialFormSchema.safeParse(values);

	if (result.success) {
		return {
			success: true,
			data: {
				...result.data,
				slug: result.data.slug ?? createSlug(result.data.title)
			}
		};
	}

	return {
		success: false,
		values,
		errors: result.error.issues.reduce<StudyMaterialFormErrors>((errors, issue) => {
			const fieldName = issue.path[0];

			if (
				fieldName === 'title' ||
				fieldName === 'slug' ||
				fieldName === 'description' ||
				fieldName === 'materialType' ||
				fieldName === 'content' ||
				fieldName === 'bookId' ||
				fieldName === 'authorId' ||
				fieldName === 'published'
			) {
				errors[fieldName] = issue.message;
			}

			return errors;
		}, {})
	};
}

function normalizeMaterialType(value: FormDataEntryValue | null): StudyMaterialType {
	if (
		value === STUDY_MATERIAL_TYPES.WORKSHEET ||
		value === STUDY_MATERIAL_TYPES.PRESENTATION ||
		value === STUDY_MATERIAL_TYPES.ANALYSIS ||
		value === STUDY_MATERIAL_TYPES.VIDEO ||
		value === STUDY_MATERIAL_TYPES.LINK
	) {
		return value;
	}

	return STUDY_MATERIAL_TYPES.WORKSHEET;
}

function createSlug(value: string): string {
	return (
		value
			.trim()
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.slice(0, 190) || `material-${Date.now()}`
	);
}
