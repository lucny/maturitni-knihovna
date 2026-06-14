import { fail, type Actions } from '@sveltejs/kit';

import { PocketBaseAuthorRepository } from '$lib/server/repositories/pocketbase-author.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const authorRepository = new PocketBaseAuthorRepository(locals.pb);

	try {
		return {
			authors: await authorRepository.getAll(),
			loadError: undefined
		};
	} catch {
		return {
			authors: [],
			loadError: 'Autory se nepodarilo nacist.'
		};
	}
};

export const actions: Actions = {
	delete: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');

		if (!id) {
			return fail(400, { message: 'Autor nebyl nalezen.' });
		}

		const authorRepository = new PocketBaseAuthorRepository(locals.pb);

		try {
			await authorRepository.delete(id);
		} catch {
			return fail(500, { message: 'Autora se nepodarilo smazat.' });
		}

		return { message: 'Autor byl smazan.' };
	}
};
