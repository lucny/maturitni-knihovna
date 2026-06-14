import { describe, expect, it } from 'vitest';

import {
	createEmptyUserNoteFormValues,
	userNoteFormSchema,
	validateUserNoteForm
} from './user-note.schema';

describe('user note schema', () => {
	it('trims valid form values and normalizes empty book relation', () => {
		const result = userNoteFormSchema.parse({
			title: '  Rozbor ',
			content: '  Poznamka ke knize ',
			bookId: ''
		});

		expect(result).toEqual({
			title: 'Rozbor',
			content: 'Poznamka ke knize',
			bookId: undefined
		});
	});

	it('returns field errors for invalid form data', () => {
		const formData = new FormData();
		formData.set('title', '');
		formData.set('content', '');

		const result = validateUserNoteForm(formData);

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.errors.title).toBeDefined();
			expect(result.errors.content).toBeDefined();
		}
	});

	it('creates independent empty form values', () => {
		const first = createEmptyUserNoteFormValues();
		const second = createEmptyUserNoteFormValues();

		first.title = 'Changed';

		expect(second.title).toBe('');
	});
});
