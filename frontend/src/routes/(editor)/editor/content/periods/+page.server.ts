import { fail, type Actions } from '@sveltejs/kit';

import { PocketBaseLiteraryPeriodRepository } from '$lib/server/repositories/pocketbase-literary-period.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const literaryPeriodRepository = new PocketBaseLiteraryPeriodRepository(locals.pb);

	try {
		return {
			periods: await literaryPeriodRepository.getAll(),
			loadError: undefined
		};
	} catch {
		return {
			periods: [],
			loadError: 'Literarni obdobi se nepodarilo nacist.'
		};
	}
};

export const actions: Actions = {
	delete: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = String(formData.get('id') ?? '');

		if (!id) {
			return fail(400, { message: 'Obdobi nebylo nalezeno.' });
		}

		const literaryPeriodRepository = new PocketBaseLiteraryPeriodRepository(locals.pb);

		try {
			await literaryPeriodRepository.delete(id);
		} catch {
			return fail(500, { message: 'Obdobi se nepodarilo smazat.' });
		}

		return { message: 'Obdobi bylo smazano.' };
	}
};
