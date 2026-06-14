import { error, fail, type Actions } from '@sveltejs/kit';

import { validateLiteraryPeriodForm } from '$lib/schemas/literary-period.schema';
import { PocketBaseLiteraryPeriodRepository } from '$lib/server/repositories/pocketbase-literary-period.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const literaryPeriodRepository = new PocketBaseLiteraryPeriodRepository(locals.pb);

	try {
		const period = await literaryPeriodRepository.getById(params.id);

		return {
			period,
			formValues: {
				title: period.title,
				slug: period.slug,
				description: period.description ?? '',
				startYear: period.startYear,
				endYear: period.endYear,
				historicalContext: period.historicalContext ?? '',
				characteristics: period.characteristics ?? ''
			}
		};
	} catch {
		throw error(404, 'Obdobi nebylo nalezeno.');
	}
};

export const actions: Actions = {
	update: async ({ locals, params, request }) => {
		if (!params.id) {
			throw error(404, 'Obdobi nebylo nalezeno.');
		}

		const validation = validateLiteraryPeriodForm(await request.formData());

		if (!validation.success) {
			return fail(400, {
				values: validation.values,
				errors: validation.errors,
				message: 'Zkontrolujte vyplnena pole.'
			});
		}

		const literaryPeriodRepository = new PocketBaseLiteraryPeriodRepository(locals.pb);

		try {
			await literaryPeriodRepository.update(params.id, validation.data);
		} catch {
			return fail(500, {
				values: validation.data,
				errors: {},
				message: 'Obdobi se nepodarilo ulozit.'
			});
		}

		return {
			values: validation.data,
			errors: {},
			message: 'Obdobi bylo ulozeno.'
		};
	}
};
