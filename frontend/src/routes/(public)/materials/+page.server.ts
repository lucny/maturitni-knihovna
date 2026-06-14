import { PocketBaseStudyMaterialRepository } from '$lib/server/repositories/pocketbase-study-material.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const studyMaterialRepository = new PocketBaseStudyMaterialRepository(locals.pb);

	try {
		return {
			materials: await studyMaterialRepository.getPublished(),
			loadError: undefined
		};
	} catch {
		return {
			materials: [],
			loadError: 'Studijni materialy se nepodarilo nacist.'
		};
	}
};
