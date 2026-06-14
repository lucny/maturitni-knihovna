import { z } from 'zod';

import {
	STUDY_MATERIAL_ATTACHMENT_EXTENSIONS,
	STUDY_MATERIAL_ATTACHMENT_MAX_SIZE,
	STUDY_MATERIAL_ATTACHMENT_MIME_TYPES,
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
export type StudyMaterialFormErrors = Partial<
	Record<keyof StudyMaterialFormValues | 'attachment', string>
>;

export type StudyMaterialFormPayload = {
	material: StudyMaterialCreateData;
	attachment?: File;
	removeAttachment: boolean;
};

export type StudyMaterialFormValidationResult =
	| {
			success: true;
			data: StudyMaterialFormPayload;
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
	const attachment = getAttachmentFile(formData);
	const attachmentError = validateAttachmentFile(attachment);
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

	if (result.success && !attachmentError) {
		return {
			success: true,
			data: {
				material: {
					...result.data,
					slug: result.data.slug ?? createSlug(result.data.title)
				},
				attachment,
				removeAttachment: formData.get('removeAttachment') === 'on'
			}
		};
	}

	const errors = result.success
		? {}
		: result.error.issues.reduce<StudyMaterialFormErrors>((validationErrors, issue) => {
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
					validationErrors[fieldName] = issue.message;
				}

				return validationErrors;
			}, {});

	if (attachmentError) {
		errors.attachment = attachmentError;
	}

	return {
		success: false,
		values,
		errors
	};
}

function getAttachmentFile(formData: FormData): File | undefined {
	const value = formData.get('attachment');

	if (!(value instanceof File) || value.size === 0 || value.name.length === 0) {
		return undefined;
	}

	return value;
}

function validateAttachmentFile(file: File | undefined): string | undefined {
	if (!file) {
		return undefined;
	}

	if (file.size > STUDY_MATERIAL_ATTACHMENT_MAX_SIZE) {
		return 'Soubor je prilis velky. Maximalni velikost prilohy je 25 MB.';
	}

	const allowedMimeTypes: readonly string[] = STUDY_MATERIAL_ATTACHMENT_MIME_TYPES;

	if (!allowedMimeTypes.includes(file.type)) {
		return 'Nepodporovany typ souboru. Povolen je PDF, DOCX, PPTX, JPG, PNG nebo WEBP.';
	}

	const extension = getFileExtension(file.name);

	if (!extension || !STUDY_MATERIAL_ATTACHMENT_EXTENSIONS.includes(extension)) {
		return 'Nepodporovana pripona souboru. Povolen je PDF, DOCX, PPTX, JPG, PNG nebo WEBP.';
	}

	return undefined;
}

function getFileExtension(fileName: string) {
	const extension = fileName.split('.').pop()?.toLowerCase();

	if (
		extension === 'pdf' ||
		extension === 'docx' ||
		extension === 'pptx' ||
		extension === 'jpg' ||
		extension === 'jpeg' ||
		extension === 'png' ||
		extension === 'webp'
	) {
		return extension;
	}

	return undefined;
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
