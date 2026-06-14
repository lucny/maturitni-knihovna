import { error, fail, type Actions } from '@sveltejs/kit';

import { validateAuthorForm } from '$lib/schemas/author.schema';
import { PocketBaseAuthorRepository } from '$lib/server/repositories/pocketbase-author.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const authorRepository = new PocketBaseAuthorRepository(locals.pb);

	try {
		const author = await authorRepository.getById(params.id);

		return {
			author,
			formValues: {
				firstName: author.firstName,
				lastName: author.lastName,
				slug: author.slug,
				birthDate: toDateInputValue(author.birthDate),
				deathDate: toDateInputValue(author.deathDate),
				nationality: author.nationality ?? '',
				occupation: author.occupation ?? '',
				biography: author.biography ?? '',
				interestingFacts: author.interestingFacts ?? '',
				website: author.website
			}
		};
	} catch {
		throw error(404, 'Autor nebyl nalezen.');
	}
};

export const actions: Actions = {
	update: async ({ locals, params, request }) => {
		if (!params.id) {
			throw error(404, 'Autor nebyl nalezen.');
		}

		const validation = validateAuthorForm(await request.formData());

		if (!validation.success) {
			return fail(400, {
				values: validation.values,
				errors: validation.errors,
				message: 'Zkontrolujte vyplnena pole.'
			});
		}

		const authorRepository = new PocketBaseAuthorRepository(locals.pb);

		try {
			await authorRepository.update(params.id, validation.data);
		} catch {
			return fail(500, {
				values: validation.data,
				errors: {},
				message: 'Autora se nepodarilo ulozit.'
			});
		}

		return {
			values: validation.data,
			errors: {},
			message: 'Autor byl ulozen.'
		};
	}
};

function toDateInputValue(value: string | undefined): string | undefined {
	return value?.slice(0, 10);
}
