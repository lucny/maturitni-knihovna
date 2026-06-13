import { publicPocketBaseUrl } from '$lib/api/pocketbase.config';
import type { Author } from '$lib/models/author';
import type { Book } from '$lib/models/book';
import type { LiteraryPeriod } from '$lib/models/literary-period';
import { PocketBaseAuthorRepository } from '$lib/server/repositories/pocketbase-author.repository';
import { PocketBaseBookRepository } from '$lib/server/repositories/pocketbase-book.repository';
import { PocketBaseLiteraryPeriodRepository } from '$lib/server/repositories/pocketbase-literary-period.repository';

import type { PageServerLoad } from './$types';

type BookCatalogItem = {
	id: string;
	title: string;
	authorName: string;
	literaryPeriodTitle?: string;
	coverUrl?: string;
};

type BookCatalogData = {
	books: BookCatalogItem[];
	loadError?: string;
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

function createBookCatalogItem(
	book: Book,
	authorsById: Map<string, Author>,
	literaryPeriodsById: Map<string, LiteraryPeriod>
): BookCatalogItem {
	const literaryPeriodTitle = book.literaryPeriodId
		? literaryPeriodsById.get(book.literaryPeriodId)?.title
		: undefined;

	return {
		id: book.id,
		title: book.title,
		authorName: getAuthorName(authorsById.get(book.authorId)),
		literaryPeriodTitle,
		coverUrl: createCoverUrl(book)
	};
}

export const load: PageServerLoad = async (): Promise<BookCatalogData> => {
	const bookRepository = new PocketBaseBookRepository();
	const authorRepository = new PocketBaseAuthorRepository();
	const literaryPeriodRepository = new PocketBaseLiteraryPeriodRepository();

	try {
		const [books, authors, literaryPeriods] = await Promise.all([
			bookRepository.getPublished(),
			authorRepository.getAll(),
			literaryPeriodRepository.getAll()
		]);

		const authorsById = new Map(authors.map((author) => [author.id, author]));
		const literaryPeriodsById = new Map(
			literaryPeriods.map((literaryPeriod) => [literaryPeriod.id, literaryPeriod])
		);

		return {
			books: books.map((book) => createBookCatalogItem(book, authorsById, literaryPeriodsById))
		};
	} catch {
		return {
			books: [],
			loadError: 'Knihy se nepodarilo nacist.'
		};
	}
};
