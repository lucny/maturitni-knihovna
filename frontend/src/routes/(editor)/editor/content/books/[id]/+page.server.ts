import { error, fail, type Actions } from '@sveltejs/kit';

import { validateBookForm } from '$lib/schemas/book.schema';
import { PocketBaseAuthorRepository } from '$lib/server/repositories/pocketbase-author.repository';
import { PocketBaseBookRepository } from '$lib/server/repositories/pocketbase-book.repository';
import { PocketBaseGenreRepository } from '$lib/server/repositories/pocketbase-genre.repository';
import { PocketBaseLiteraryPeriodRepository } from '$lib/server/repositories/pocketbase-literary-period.repository';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const bookRepository = new PocketBaseBookRepository(locals.pb);
	const authorRepository = new PocketBaseAuthorRepository(locals.pb);
	const literaryPeriodRepository = new PocketBaseLiteraryPeriodRepository(locals.pb);
	const genreRepository = new PocketBaseGenreRepository(locals.pb);

	try {
		const [book, authors, literaryPeriods, genres] = await Promise.all([
			bookRepository.getById(params.id),
			authorRepository.getAll(),
			literaryPeriodRepository.getAll(),
			genreRepository.getAll()
		]);

		return {
			book,
			authors,
			literaryPeriods,
			genres,
			formValues: {
				title: book.title,
				slug: book.slug,
				originalTitle: book.originalTitle ?? '',
				publicationYear: book.publicationYear,
				originalLanguage: book.originalLanguage ?? '',
				isbn: book.isbn ?? '',
				authorId: book.authorId,
				literaryPeriodId: book.literaryPeriodId,
				genreIds: book.genreIds,
				annotation: book.annotation ?? '',
				contentSummary: book.contentSummary ?? '',
				interpretation: book.interpretation ?? '',
				historicalContext: book.historicalContext ?? '',
				themes: book.themes ?? '',
				motifs: book.motifs ?? '',
				composition: book.composition ?? '',
				narrator: book.narrator ?? '',
				timeSpace: book.timeSpace ?? '',
				languageFeatures: book.languageFeatures ?? '',
				literaryFeatures: book.literaryFeatures ?? '',
				importance: book.importance ?? '',
				examNotes: book.examNotes ?? '',
				examQuestions: book.examQuestions ?? '',
				connections: book.connections ?? '',
				published: book.published,
				publishedAt: toDateInputValue(book.publishedAt)
			}
		};
	} catch {
		throw error(404, 'Kniha nebyla nalezena.');
	}
};

export const actions: Actions = {
	update: async ({ locals, params, request }) => {
		if (!params.id) {
			throw error(404, 'Kniha nebyla nalezena.');
		}

		const validation = validateBookForm(await request.formData());

		if (!validation.success) {
			return fail(400, {
				values: validation.values,
				errors: validation.errors,
				message: 'Zkontrolujte vyplnena pole.'
			});
		}

		const bookRepository = new PocketBaseBookRepository(locals.pb);

		try {
			await bookRepository.update(params.id, validation.data);
		} catch {
			return fail(500, {
				values: validation.data,
				errors: {},
				message: 'Knihu se nepodarilo ulozit.'
			});
		}

		return {
			values: validation.data,
			errors: {},
			message: 'Kniha byla ulozena.'
		};
	}
};

function toDateInputValue(value: string | undefined): string | undefined {
	return value?.slice(0, 10);
}
