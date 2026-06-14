import { fail, redirect, type Actions } from '@sveltejs/kit';

import { createEmptyUserNoteFormValues, validateUserNoteForm } from '$lib/schemas/user-note.schema';
import { PocketBaseBookRepository } from '$lib/server/repositories/pocketbase-book.repository';
import { PocketBaseUserNoteRepository } from '$lib/server/repositories/pocketbase-user-note.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const userNoteRepository = new PocketBaseUserNoteRepository(locals.pb);
	const bookRepository = new PocketBaseBookRepository(locals.pb);

	try {
		const [notes, books] = await Promise.all([
			userNoteRepository.getByUser(locals.user.id),
			bookRepository.getPublished()
		]);

		return {
			notes,
			books,
			loadError: null,
			formValues: createEmptyUserNoteFormValues()
		};
	} catch {
		return {
			notes: [],
			books: [],
			loadError: 'Poznamky se nepodarilo nacist.',
			formValues: createEmptyUserNoteFormValues()
		};
	}
};

export const actions: Actions = {
	create: async ({ locals, request }) => {
		if (!locals.user) {
			throw redirect(303, '/login');
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
			const note = await userNoteRepository.create({
				...validation.data,
				userId: locals.user.id
			});

			throw redirect(303, `/student/notes/${note.id}`);
		} catch (caughtError) {
			if (isRedirect(caughtError)) {
				throw caughtError;
			}

			return fail(500, {
				values: validation.data,
				errors: {},
				message: 'Poznamku se nepodarilo vytvorit.'
			});
		}
	},
	delete: async ({ locals, request }) => {
		if (!locals.user) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const noteId = String(formData.get('id') ?? '');

		if (!noteId) {
			return fail(400, {
				message: 'Chybi identifikator poznamky.'
			});
		}

		const userNoteRepository = new PocketBaseUserNoteRepository(locals.pb);

		try {
			await userNoteRepository.delete(noteId, locals.user.id);
		} catch {
			return fail(500, {
				message: 'Poznamku se nepodarilo smazat.'
			});
		}

		return {
			message: 'Poznamka byla smazana.'
		};
	}
};

function isRedirect(value: unknown): value is { status: number; location: string } {
	return (
		typeof value === 'object' &&
		value !== null &&
		'status' in value &&
		'location' in value &&
		typeof value.status === 'number' &&
		typeof value.location === 'string'
	);
}
