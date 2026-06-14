import { error, fail, redirect, type Actions } from '@sveltejs/kit';

import { validateStudyMaterialForm } from '$lib/schemas/study-material.schema';
import { PocketBaseAuthorRepository } from '$lib/server/repositories/pocketbase-author.repository';
import { PocketBaseBookRepository } from '$lib/server/repositories/pocketbase-book.repository';
import { PocketBaseStudyMaterialRepository } from '$lib/server/repositories/pocketbase-study-material.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const materialId = params.id;

	if (!materialId) {
		throw error(404, 'Material nebyl nalezen.');
	}

	const studyMaterialRepository = new PocketBaseStudyMaterialRepository(locals.pb);
	const bookRepository = new PocketBaseBookRepository(locals.pb);
	const authorRepository = new PocketBaseAuthorRepository(locals.pb);

	try {
		const [material, books, authors] = await Promise.all([
			studyMaterialRepository.getById(materialId),
			bookRepository.getPublished(),
			authorRepository.getAll()
		]);

		return {
			material,
			books,
			authors,
			formValues: {
				title: material.title,
				slug: material.slug,
				description: material.description ?? '',
				materialType: material.materialType,
				content: material.content ?? '',
				bookId: material.bookId,
				authorId: material.authorId,
				published: material.published
			}
		};
	} catch {
		throw error(404, 'Material nebyl nalezen.');
	}
};

export const actions: Actions = {
	update: async ({ locals, params, request }) => {
		if (!locals.user) {
			throw redirect(303, '/login');
		}

		const materialId = params.id;

		if (!materialId) {
			throw error(404, 'Material nebyl nalezen.');
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
			await studyMaterialRepository.update(materialId, validation.data);
		} catch {
			return fail(500, {
				values: validation.data,
				errors: {},
				message: 'Material se nepodarilo ulozit.'
			});
		}

		return {
			values: validation.data,
			errors: {},
			message: 'Material byl ulozen.'
		};
	},
	publish: async ({ locals, params }) => {
		return setPublishedFromParams(locals, params.id, true);
	},
	unpublish: async ({ locals, params }) => {
		return setPublishedFromParams(locals, params.id, false);
	}
};

async function setPublishedFromParams(
	locals: App.Locals,
	materialId: string | undefined,
	published: boolean
) {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	if (!materialId) {
		throw error(404, 'Material nebyl nalezen.');
	}

	const studyMaterialRepository = new PocketBaseStudyMaterialRepository(locals.pb);

	try {
		await studyMaterialRepository.setPublished(materialId, published);
	} catch {
		return fail(500, {
			message: 'Stav publikace se nepodarilo zmenit.'
		});
	}

	return {
		message: published ? 'Material byl publikovan.' : 'Material byl odpublikovan.'
	};
}
