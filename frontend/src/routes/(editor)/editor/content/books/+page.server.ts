import { fail, type Actions } from '@sveltejs/kit';

import { PocketBaseAuthorRepository } from '$lib/server/repositories/pocketbase-author.repository';
import { PocketBaseBookRepository } from '$lib/server/repositories/pocketbase-book.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const bookRepository = new PocketBaseBookRepository(locals.pb);
	const authorRepository = new PocketBaseAuthorRepository(locals.pb);

	try {
		const [books, authors] = await Promise.all([
			bookRepository.getAll(),
			authorRepository.getAll()
		]);

		return {
			books,
			authors,
			loadError: undefined
		};
	} catch {
		return {
			books: [],
			authors: [],
			loadError: 'Knihy se nepodarilo nacist.'
		};
	}
};

export const actions: Actions = {
	delete: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');

		if (!id) {
			return fail(400, { message: 'Kniha nebyla nalezena.' });
		}

		const bookRepository = new PocketBaseBookRepository(locals.pb);

		try {
			await bookRepository.delete(id);
		} catch {
			return fail(500, { message: 'Knihu se nepodarilo smazat.' });
		}

		return { message: 'Kniha byla smazana.' };
	}
};
