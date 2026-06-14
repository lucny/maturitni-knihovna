import { fail, redirect, type Actions } from '@sveltejs/kit';

import { createEmptyBookFormValues, validateBookForm } from '$lib/schemas/book.schema';
import { PocketBaseAuthorRepository } from '$lib/server/repositories/pocketbase-author.repository';
import { PocketBaseBookRepository } from '$lib/server/repositories/pocketbase-book.repository';
import { PocketBaseGenreRepository } from '$lib/server/repositories/pocketbase-genre.repository';
import { PocketBaseLiteraryPeriodRepository } from '$lib/server/repositories/pocketbase-literary-period.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const authorRepository = new PocketBaseAuthorRepository(locals.pb);
	const literaryPeriodRepository = new PocketBaseLiteraryPeriodRepository(locals.pb);
	const genreRepository = new PocketBaseGenreRepository(locals.pb);

	const [authors, literaryPeriods, genres] = await Promise.all([
		authorRepository.getAll(),
		literaryPeriodRepository.getAll(),
		genreRepository.getAll()
	]);

	return {
		authors,
		literaryPeriods,
		genres,
		formValues: createEmptyBookFormValues()
	};
};

export const actions: Actions = {
	create: async ({ locals, request }) => {
		const validation = validateBookForm(await request.formData());

		if (!validation.success) {
			return fail(400, {
				values: validation.values,
				errors: validation.errors,
				message: 'Zkontrolujte vyplnena pole.'
			});
		}

		const bookRepository = new PocketBaseBookRepository(locals.pb);

		try {
			const book = await bookRepository.create(validation.data);

			throw redirect(303, `/editor/content/books/${book.id}`);
		} catch (caughtError) {
			if (isRedirect(caughtError)) {
				throw caughtError;
			}

			return fail(500, {
				values: validation.data,
				errors: {},
				message: 'Knihu se nepodarilo vytvorit.'
			});
		}
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
