import { fail, redirect, type Actions } from '@sveltejs/kit';

import {
	createEmptyLiteraryPeriodFormValues,
	validateLiteraryPeriodForm
} from '$lib/schemas/literary-period.schema';
import { PocketBaseLiteraryPeriodRepository } from '$lib/server/repositories/pocketbase-literary-period.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({
	formValues: createEmptyLiteraryPeriodFormValues()
});

export const actions: Actions = {
	create: async ({ locals, request }) => {
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
			const period = await literaryPeriodRepository.create(validation.data);

			throw redirect(303, `/editor/content/periods/${period.id}`);
		} catch (caughtError) {
			if (isRedirect(caughtError)) {
				throw caughtError;
			}

			return fail(500, {
				values: validation.data,
				errors: {},
				message: 'Obdobi se nepodarilo vytvorit.'
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
