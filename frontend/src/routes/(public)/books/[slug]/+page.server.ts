import { publicPocketBaseUrl } from '$lib/api/pocketbase.config';
import type { Author } from '$lib/models/author';
import type { Book } from '$lib/models/book';
import type { Genre } from '$lib/models/genre';
import type { LiteraryPeriod } from '$lib/models/literary-period';
import { PocketBaseAuthorRepository } from '$lib/server/repositories/pocketbase-author.repository';
import { PocketBaseBookRepository } from '$lib/server/repositories/pocketbase-book.repository';
import { PocketBaseGenreRepository } from '$lib/server/repositories/pocketbase-genre.repository';
import { PocketBaseLiteraryPeriodRepository } from '$lib/server/repositories/pocketbase-literary-period.repository';

import type { PageServerLoad } from './$types';

type BookDetail = {
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
	genresById: Map<string, Genre>
): BookDetail {
	const authorName = getAuthorName(author);

	return {
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
		interpretation: book.interpretation
	};
}

export const load: PageServerLoad = async ({ params }): Promise<BookDetailData> => {
	const bookRepository = new PocketBaseBookRepository();
	const authorRepository = new PocketBaseAuthorRepository();
	const literaryPeriodRepository = new PocketBaseLiteraryPeriodRepository();
	const genreRepository = new PocketBaseGenreRepository();

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

		return {
			book: createBookDetail(book, author, literaryPeriod, genresById),
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
