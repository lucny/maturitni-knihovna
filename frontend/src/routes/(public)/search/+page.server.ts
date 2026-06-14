import type { Author } from '$lib/models/author';
import type { Book } from '$lib/models/book';
import { PocketBaseAuthorRepository } from '$lib/server/repositories/pocketbase-author.repository';
import { PocketBaseBookRepository } from '$lib/server/repositories/pocketbase-book.repository';

import type { PageServerLoad } from './$types';

const MAX_SEARCH_QUERY_LENGTH = 80;
const SEARCH_RESULT_LIMIT = 10;

type SearchBookItem = {
	id: string;
	slug: string;
	title: string;
	originalTitle?: string;
	publicationYear?: number;
	annotation?: string;
};

type SearchAuthorItem = {
	id: string;
	slug: string;
	fullName: string;
	nationality?: string;
};

type SearchPageData = {
	query: string;
	isQueryTooLong: boolean;
	books: SearchBookItem[];
	authors: SearchAuthorItem[];
	loadError?: string;
};

function normalizeSearchQuery(value: string | null): { query: string; isQueryTooLong: boolean } {
	const query = (value ?? '').trim().replace(/\s+/g, ' ');

	if (query.length <= MAX_SEARCH_QUERY_LENGTH) {
		return { query, isQueryTooLong: false };
	}

	return {
		query: query.slice(0, MAX_SEARCH_QUERY_LENGTH),
		isQueryTooLong: true
	};
}

function getAuthorFullName(author: Author): string {
	return [author.firstName, author.lastName].filter(Boolean).join(' ');
}

function createSearchBookItem(book: Book): SearchBookItem {
	return {
		id: book.id,
		slug: book.slug,
		title: book.title,
		originalTitle: book.originalTitle,
		publicationYear: book.publicationYear,
		annotation: book.annotation
	};
}

function createSearchAuthorItem(author: Author): SearchAuthorItem {
	return {
		id: author.id,
		slug: author.slug,
		fullName: getAuthorFullName(author),
		nationality: author.nationality
	};
}

export const load: PageServerLoad = async ({ url }): Promise<SearchPageData> => {
	const { query, isQueryTooLong } = normalizeSearchQuery(url.searchParams.get('q'));

	if (!query) {
		return {
			query,
			isQueryTooLong,
			books: [],
			authors: []
		};
	}

	const bookRepository = new PocketBaseBookRepository();
	const authorRepository = new PocketBaseAuthorRepository();

	try {
		const [books, authors] = await Promise.all([
			bookRepository.search(query, SEARCH_RESULT_LIMIT),
			authorRepository.search(query, SEARCH_RESULT_LIMIT)
		]);

		return {
			query,
			isQueryTooLong,
			books: books.map(createSearchBookItem),
			authors: authors.map(createSearchAuthorItem)
		};
	} catch {
		return {
			query,
			isQueryTooLong,
			books: [],
			authors: [],
			loadError: 'Vyhledavani se nepodarilo nacist.'
		};
	}
};
