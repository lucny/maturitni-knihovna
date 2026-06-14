import { fail, redirect, type Actions } from '@sveltejs/kit';

import { createEmptyAuthorFormValues, validateAuthorForm } from '$lib/schemas/author.schema';
import { PocketBaseAuthorRepository } from '$lib/server/repositories/pocketbase-author.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	formValues: createEmptyAuthorFormValues()
});

export const actions: Actions = {
	create: async ({ locals, request }) => {
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
			const author = await authorRepository.create(validation.data);

			throw redirect(303, `/editor/content/authors/${author.id}`);
		} catch (caughtError) {
			if (isRedirect(caughtError)) {
				throw caughtError;
			}

			return fail(500, {
				values: validation.data,
				errors: {},
				message: 'Autora se nepodarilo vytvorit.'
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
