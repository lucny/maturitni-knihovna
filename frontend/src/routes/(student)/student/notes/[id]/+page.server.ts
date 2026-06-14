import { error, fail, redirect, type Actions } from '@sveltejs/kit';

import { validateUserNoteForm } from '$lib/schemas/user-note.schema';
import { PocketBaseBookRepository } from '$lib/server/repositories/pocketbase-book.repository';
import { PocketBaseUserNoteRepository } from '$lib/server/repositories/pocketbase-user-note.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const userNoteRepository = new PocketBaseUserNoteRepository(locals.pb);
	const bookRepository = new PocketBaseBookRepository(locals.pb);

	try {
		const [note, books] = await Promise.all([
			userNoteRepository.getByIdForUser(params.id, locals.user.id),
			bookRepository.getPublished()
		]);

		return {
			note,
			books,
			formValues: {
				title: note.title,
				content: note.content,
				bookId: note.bookId
			}
		};
	} catch {
		throw error(404, 'Poznamka nebyla nalezena.');
	}
};

export const actions: Actions = {
	update: async ({ locals, params, request }) => {
		if (!locals.user) {
			throw redirect(303, '/login');
		}

		const noteId = params.id;

		if (!noteId) {
			throw error(404, 'Poznamka nebyla nalezena.');
		}

		const validation = validateUserNoteForm(await request.formData());

		if (!validation.success) {
			return fail(400, {
				values: validation.values,
				errors: validation.errors,
				message: 'Zkontrolujte vyplnena pole.'
			});
		}

		const userNoteRepository = new PocketBaseUserNoteRepository(locals.pb);

		try {
			await userNoteRepository.update(noteId, locals.user.id, validation.data);
		} catch {
			return fail(500, {
				values: validation.data,
				errors: {},
				message: 'Poznamku se nepodarilo ulozit.'
			});
		}

		return {
			values: validation.data,
			errors: {},
			message: 'Poznamka byla ulozena.'
		};
	},
	delete: async ({ locals, params }) => {
		if (!locals.user) {
			throw redirect(303, '/login');
		}

		const noteId = params.id;

		if (!noteId) {
			throw error(404, 'Poznamka nebyla nalezena.');
		}

		const userNoteRepository = new PocketBaseUserNoteRepository(locals.pb);

		try {
			await userNoteRepository.delete(noteId, locals.user.id);
		} catch {
			return fail(500, {
				message: 'Poznamku se nepodarilo smazat.'
			});
		}

		throw redirect(303, '/student/notes');
	}
};
