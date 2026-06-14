import { PocketBaseAuthorRepository } from '$lib/server/repositories/pocketbase-author.repository';
import { PocketBaseBookRepository } from '$lib/server/repositories/pocketbase-book.repository';
import { PocketBaseLiteraryPeriodRepository } from '$lib/server/repositories/pocketbase-literary-period.repository';
import { PocketBaseStudyMaterialRepository } from '$lib/server/repositories/pocketbase-study-material.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const bookRepository = new PocketBaseBookRepository(locals.pb);
	const authorRepository = new PocketBaseAuthorRepository(locals.pb);
	const literaryPeriodRepository = new PocketBaseLiteraryPeriodRepository(locals.pb);
	const studyMaterialRepository = new PocketBaseStudyMaterialRepository(locals.pb);

	try {
		const [books, authors, literaryPeriods, studyMaterials] = await Promise.all([
			bookRepository.getAll(),
			authorRepository.getAll(),
			literaryPeriodRepository.getAll(),
			studyMaterialRepository.getAll()
		]);

		return {
			stats: {
				books: books.length,
				authors: authors.length,
				literaryPeriods: literaryPeriods.length,
				studyMaterials: studyMaterials.length
			},
			loadError: undefined
		};
	} catch {
		return {
			stats: {
				books: 0,
				authors: 0,
				literaryPeriods: 0,
				studyMaterials: 0
			},
			loadError: 'Prehled redakce se nepodarilo nacist.'
		};
	}
};
