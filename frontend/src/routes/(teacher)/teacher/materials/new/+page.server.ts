import { fail, redirect, type Actions } from '@sveltejs/kit';

import {
	createEmptyStudyMaterialFormValues,
	validateStudyMaterialForm
} from '$lib/schemas/study-material.schema';
import { PocketBaseAuthorRepository } from '$lib/server/repositories/pocketbase-author.repository';
import { PocketBaseBookRepository } from '$lib/server/repositories/pocketbase-book.repository';
import { PocketBaseStudyMaterialRepository } from '$lib/server/repositories/pocketbase-study-material.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const bookRepository = new PocketBaseBookRepository(locals.pb);
	const authorRepository = new PocketBaseAuthorRepository(locals.pb);

	return {
		books: await bookRepository.getPublished(),
		authors: await authorRepository.getAll(),
		formValues: createEmptyStudyMaterialFormValues()
	};
};

export const actions: Actions = {
	create: async ({ locals, request }) => {
		if (!locals.user) {
			throw redirect(303, '/login');
		}

		const validation = validateStudyMaterialForm(await request.formData());

		if (!validation.success) {
			return fail(400, {
				values: validation.values,
				errors: validation.errors,
				message: 'Zkontrolujte vyplnena pole.'
			});
		}

		const studyMaterialRepository = new PocketBaseStudyMaterialRepository(locals.pb);

		try {
			const material = await studyMaterialRepository.create(
				validation.data.material,
				validation.data.attachment
			);

			throw redirect(303, `/teacher/materials/${material.id}`);
		} catch (caughtError) {
			if (isRedirect(caughtError)) {
				throw caughtError;
			}

			return fail(500, {
				values: validation.data.material,
				errors: {},
				message: 'Material se nepodarilo vytvorit.'
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
