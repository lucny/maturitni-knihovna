import { fail, redirect, type Actions } from '@sveltejs/kit';

import { publicPocketBaseUrl } from '$lib/api/pocketbase.config';
import type { Author } from '$lib/models/author';
import type { Book } from '$lib/models/book';
import type { Genre } from '$lib/models/genre';
import type { LiteraryPeriod } from '$lib/models/literary-period';
import { PocketBaseAuthorRepository } from '$lib/server/repositories/pocketbase-author.repository';
import { PocketBaseBookRepository } from '$lib/server/repositories/pocketbase-book.repository';
import { PocketBaseFavoriteRepository } from '$lib/server/repositories/pocketbase-favorite.repository';
import { PocketBaseGenreRepository } from '$lib/server/repositories/pocketbase-genre.repository';
import { PocketBaseLiteraryPeriodRepository } from '$lib/server/repositories/pocketbase-literary-period.repository';

import type { PageServerLoad } from './$types';

type BookDetail = {
	id: string;
	title: string;
	seoTitle: string;
	seoDescription: string;
	authorName: string;
	publicationYear?: number;
	literaryPeriodTitle?: string;
	genreTitles: string[];
	coverUrl?: string;
	annotation?: string;
	contentSummary?: string;
	interpretation?: string;
	isFavorite: boolean;
	canManageFavorite: boolean;
};

type BookDetailData = {
	book?: BookDetail;
	loadError?: string;
	notFound: boolean;
};

function getAuthorName(author: Author | undefined): string {
	if (!author) {
		return 'Neznamy autor';
	}

	return [author.firstName, author.lastName].filter(Boolean).join(' ');
}

function createCoverUrl(book: Book): string | undefined {
	if (!book.cover) {
		return undefined;
	}

	return `${publicPocketBaseUrl}/api/files/books/${book.id}/${encodeURIComponent(book.cover)}`;
}

function isNotFoundError(error: unknown): boolean {
	return (
		typeof error === 'object' &&
		error !== null &&
		'status' in error &&
		(error as { status?: unknown }).status === 404
	);
}

function createSeoDescription(book: Book, authorName: string): string {
	return (
		book.annotation?.trim() ||
		`Detail knihy ${book.title} od autora ${authorName} v projektu Maturitni knihovna.`
	);
}

function createBookDetail(
	book: Book,
	author: Author | undefined,
	literaryPeriod: LiteraryPeriod | undefined,
	genresById: Map<string, Genre>,
	isFavorite: boolean,
	canManageFavorite: boolean
): BookDetail {
	const authorName = getAuthorName(author);

	return {
		id: book.id,
		title: book.title,
		seoTitle: `${book.title} | Maturitni knihovna`,
		seoDescription: createSeoDescription(book, authorName),
		authorName,
		publicationYear: book.publicationYear,
		literaryPeriodTitle: literaryPeriod?.title,
		genreTitles: book.genreIds
			.map((genreId) => genresById.get(genreId)?.title)
			.filter((title): title is string => Boolean(title)),
		coverUrl: createCoverUrl(book),
		annotation: book.annotation,
		contentSummary: book.contentSummary,
		interpretation: book.interpretation,
		isFavorite,
		canManageFavorite
	};
}

export const load: PageServerLoad = async ({ locals, params }): Promise<BookDetailData> => {
	const bookRepository = new PocketBaseBookRepository(locals.pb);
	const authorRepository = new PocketBaseAuthorRepository(locals.pb);
	const literaryPeriodRepository = new PocketBaseLiteraryPeriodRepository(locals.pb);
	const genreRepository = new PocketBaseGenreRepository(locals.pb);
	const favoriteRepository = new PocketBaseFavoriteRepository(locals.pb);

	try {
		const book = await bookRepository.getBySlug(params.slug);

		if (!book.published) {
			return { notFound: true };
		}

		const [author, literaryPeriods, genres] = await Promise.all([
			authorRepository.getById(book.authorId),
			literaryPeriodRepository.getAll(),
			genreRepository.getAll()
		]);

		const literaryPeriod = book.literaryPeriodId
			? literaryPeriods.find((period) => period.id === book.literaryPeriodId)
			: undefined;
		const genresById = new Map(genres.map((genre) => [genre.id, genre]));
		const isFavorite = locals.user
			? await favoriteRepository.isFavorite(locals.user.id, book.id)
			: false;

		return {
			book: createBookDetail(
				book,
				author,
				literaryPeriod,
				genresById,
				isFavorite,
				Boolean(locals.user)
			),
			notFound: false
		};
	} catch (error) {
		if (isNotFoundError(error)) {
			return { notFound: true };
		}

		return {
			loadError: 'Detail knihy se nepodarilo nacist.',
			notFound: false
		};
	}
};

export const actions: Actions = {
	addFavorite: async ({ locals, params }) => {
		if (!locals.user) {
			throw redirect(303, '/login');
		}

		const bookSlug = params.slug;

		if (!bookSlug) {
			return fail(404, {
				message: 'Kniha nebyla nalezena.'
			});
		}

		const bookRepository = new PocketBaseBookRepository(locals.pb);
		const favoriteRepository = new PocketBaseFavoriteRepository(locals.pb);

		try {
			const book = await bookRepository.getBySlug(bookSlug);

			if (!book.published) {
				return fail(404, {
					message: 'Kniha nebyla nalezena.'
				});
			}

			await favoriteRepository.createIfMissing({
				userId: locals.user.id,
				bookId: book.id
			});
		} catch {
			return fail(500, {
				message: 'Knihu se nepodarilo pridat do oblibenych.'
			});
		}

		return {
			message: 'Kniha byla pridana do oblibenych.'
		};
	},
	removeFavorite: async ({ locals, params }) => {
		if (!locals.user) {
			throw redirect(303, '/login');
		}

		const bookSlug = params.slug;

		if (!bookSlug) {
			return fail(404, {
				message: 'Kniha nebyla nalezena.'
			});
		}

		const bookRepository = new PocketBaseBookRepository(locals.pb);
		const favoriteRepository = new PocketBaseFavoriteRepository(locals.pb);

		try {
			const book = await bookRepository.getBySlug(bookSlug);
			await favoriteRepository.deleteByUserAndBook(locals.user.id, book.id);
		} catch {
			return fail(500, {
				message: 'Knihu se nepodarilo odebrat z oblibenych.'
			});
		}

		return {
			message: 'Kniha byla odebrana z oblibenych.'
		};
	}
};
