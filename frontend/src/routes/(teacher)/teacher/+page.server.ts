import { redirect } from '@sveltejs/kit';

import { PocketBaseStudyMaterialRepository } from '$lib/server/repositories/pocketbase-study-material.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const studyMaterialRepository = new PocketBaseStudyMaterialRepository(locals.pb);

	try {
		const materials = await studyMaterialRepository.getAll();

		return {
			totalMaterials: materials.length,
			publishedMaterials: materials.filter((material) => material.published).length,
			loadError: null
		};
	} catch {
		return {
			totalMaterials: 0,
			publishedMaterials: 0,
			loadError: 'Statistiky materialu se nepodarilo nacist.'
		};
	}
};
