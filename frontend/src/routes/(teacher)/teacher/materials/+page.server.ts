import { fail, redirect, type Actions } from '@sveltejs/kit';

import { PocketBaseStudyMaterialRepository } from '$lib/server/repositories/pocketbase-study-material.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const studyMaterialRepository = new PocketBaseStudyMaterialRepository(locals.pb);

	try {
		return {
			materials: await studyMaterialRepository.getAll(),
			loadError: null
		};
	} catch {
		return {
			materials: [],
			loadError: 'Materialy se nepodarilo nacist.'
		};
	}
};

export const actions: Actions = {
	publish: async ({ locals, request }) => {
		return setPublishedFromRequest(locals, request, true);
	},
	unpublish: async ({ locals, request }) => {
		return setPublishedFromRequest(locals, request, false);
	}
};

async function setPublishedFromRequest(locals: App.Locals, request: Request, published: boolean) {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const formData = await request.formData();
	const materialId = String(formData.get('id') ?? '');

	if (!materialId) {
		return fail(400, {
			message: 'Chybi identifikator materialu.'
		});
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
