import { z } from 'zod';

export const userNoteFormSchema = z.object({
	title: z.string().trim().min(1, 'Vyplnte nazev poznamky.').max(200, 'Nazev je prilis dlouhy.'),
	content: z
		.string()
		.trim()
		.min(1, 'Vyplnte obsah poznamky.')
		.max(10000, 'Obsah je prilis dlouhy.'),
	bookId: z
		.string()
		.trim()
		.max(100, 'Neplatna vazba na knihu.')
		.optional()
		.transform((value) => value || undefined)
});

export type UserNoteFormValues = z.infer<typeof userNoteFormSchema>;
export type UserNoteFormErrors = Partial<Record<keyof UserNoteFormValues, string>>;

export type UserNoteFormValidationResult =
	| {
			success: true;
			data: UserNoteFormValues;
	  }
	| {
			success: false;
			values: UserNoteFormValues;
			errors: UserNoteFormErrors;
	  };

const emptyValues: UserNoteFormValues = {
	title: '',
	content: '',
	bookId: undefined
};

export function validateUserNoteForm(formData: FormData): UserNoteFormValidationResult {
	const values: UserNoteFormValues = {
		title: String(formData.get('title') ?? ''),
		content: String(formData.get('content') ?? ''),
		bookId: String(formData.get('bookId') ?? '') || undefined
	};

	const result = userNoteFormSchema.safeParse(values);

	if (result.success) {
		return {
			success: true,
			data: result.data
		};
	}

	return {
		success: false,
		values,
		errors: result.error.issues.reduce<UserNoteFormErrors>((errors, issue) => {
			const fieldName = issue.path[0];

			if (fieldName === 'title' || fieldName === 'content' || fieldName === 'bookId') {
				errors[fieldName] = issue.message;
			}

			return errors;
		}, {})
	};
}

export function createEmptyUserNoteFormValues(): UserNoteFormValues {
	return { ...emptyValues };
}
