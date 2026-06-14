import { publicPocketBaseUrl } from '$lib/api/pocketbase.config';
import type { Author } from '$lib/models/author';
import type { Book } from '$lib/models/book';
import type { Genre } from '$lib/models/genre';
import type { LiteraryPeriod } from '$lib/models/literary-period';
import type { BookFilterCriteria } from '$lib/repositories/book.repository';
import { PocketBaseAuthorRepository } from '$lib/server/repositories/pocketbase-author.repository';
import { PocketBaseBookRepository } from '$lib/server/repositories/pocketbase-book.repository';
import { PocketBaseGenreRepository } from '$lib/server/repositories/pocketbase-genre.repository';
import { PocketBaseLiteraryPeriodRepository } from '$lib/server/repositories/pocketbase-literary-period.repository';

import type { PageServerLoad } from './$types';

type BookCatalogItem = {
	id: string;
	slug: string;
	title: string;
	authorName: string;
	literaryPeriodTitle?: string;
	coverUrl?: string;
};

type BookFilterOption = {
	slug: string;
	label: string;
};

type BookFilterSelection = {
	author?: string;
	period?: string;
	genre?: string;
};

type ActiveBookFilter = {
	label: string;
	value: string;
	filters: BookFilterSelection;
};

type BookFilterPanelData = {
	authors: BookFilterOption[];
	literaryPeriods: BookFilterOption[];
	genres: BookFilterOption[];
};

type BookCatalogData = {
	books: BookCatalogItem[];
	filterOptions: BookFilterPanelData;
	filters: BookFilterSelection;
	activeFilters: ActiveBookFilter[];
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
		slug: book.slug,
		title: book.title,
		authorName: getAuthorName(authorsById.get(book.authorId)),
		literaryPeriodTitle,
		coverUrl: createCoverUrl(book)
	};
}

function getFullName(author: Author): string {
	return [author.firstName, author.lastName].filter(Boolean).join(' ');
}

function createAuthorOption(author: Author): BookFilterOption {
	return {
		slug: author.slug,
		label: getFullName(author)
	};
}

function createLiteraryPeriodOption(literaryPeriod: LiteraryPeriod): BookFilterOption {
	return {
		slug: literaryPeriod.slug,
		label: literaryPeriod.title
	};
}

function createGenreOption(genre: Genre): BookFilterOption {
	return {
		slug: genre.slug,
		label: genre.title
	};
}

function getQuerySlug(url: URL, key: keyof BookFilterSelection): string | undefined {
	const value = url.searchParams.get(key)?.trim();

	return value || undefined;
}

function createActiveFilter(
	label: string,
	value: string,
	filters: BookFilterSelection,
	filterKey: keyof BookFilterSelection
): ActiveBookFilter {
	return {
		label,
		value,
		filters: { ...filters, [filterKey]: undefined }
	};
}

function createActiveFilters(
	filters: BookFilterSelection,
	authorsBySlug: Map<string, Author>,
	literaryPeriodsBySlug: Map<string, LiteraryPeriod>,
	genresBySlug: Map<string, Genre>
): ActiveBookFilter[] {
	const activeFilters: ActiveBookFilter[] = [];

	if (filters.author) {
		const author = authorsBySlug.get(filters.author);

		if (author) {
			activeFilters.push(createActiveFilter('Autor', getFullName(author), filters, 'author'));
		}
	}

	if (filters.period) {
		const literaryPeriod = literaryPeriodsBySlug.get(filters.period);

		if (literaryPeriod) {
			activeFilters.push(createActiveFilter('Obdobi', literaryPeriod.title, filters, 'period'));
		}
	}

	if (filters.genre) {
		const genre = genresBySlug.get(filters.genre);

		if (genre) {
			activeFilters.push(createActiveFilter('Zanr', genre.title, filters, 'genre'));
		}
	}

	return activeFilters;
}

function createFilterCriteria(
	filters: BookFilterSelection,
	authorsBySlug: Map<string, Author>,
	literaryPeriodsBySlug: Map<string, LiteraryPeriod>,
	genresBySlug: Map<string, Genre>
): BookFilterCriteria {
	return {
		authorId: filters.author ? authorsBySlug.get(filters.author)?.id : undefined,
		literaryPeriodId: filters.period ? literaryPeriodsBySlug.get(filters.period)?.id : undefined,
		genreId: filters.genre ? genresBySlug.get(filters.genre)?.id : undefined
	};
}

function createEmptyBookCatalogData(loadError?: string): BookCatalogData {
	return {
		books: [],
		filterOptions: {
			authors: [],
			literaryPeriods: [],
			genres: []
		},
		filters: {},
		activeFilters: [],
		loadError
	};
}

export const load: PageServerLoad = async ({ url }): Promise<BookCatalogData> => {
	const bookRepository = new PocketBaseBookRepository();
	const authorRepository = new PocketBaseAuthorRepository();
	const literaryPeriodRepository = new PocketBaseLiteraryPeriodRepository();
	const genreRepository = new PocketBaseGenreRepository();

	try {
		const [authors, literaryPeriods, genres] = await Promise.all([
			authorRepository.getAll(),
			literaryPeriodRepository.getAll(),
			genreRepository.getAll()
		]);

		const authorsById = new Map(authors.map((author) => [author.id, author]));
		const authorsBySlug = new Map(authors.map((author) => [author.slug, author]));
		const literaryPeriodsById = new Map(
			literaryPeriods.map((literaryPeriod) => [literaryPeriod.id, literaryPeriod])
		);
		const literaryPeriodsBySlug = new Map(
			literaryPeriods.map((literaryPeriod) => [literaryPeriod.slug, literaryPeriod])
		);
		const genresBySlug = new Map(genres.map((genre) => [genre.slug, genre]));
		const filters: BookFilterSelection = {
			author: authorsBySlug.has(getQuerySlug(url, 'author') ?? '')
				? getQuerySlug(url, 'author')
				: undefined,
			period: literaryPeriodsBySlug.has(getQuerySlug(url, 'period') ?? '')
				? getQuerySlug(url, 'period')
				: undefined,
			genre: genresBySlug.has(getQuerySlug(url, 'genre') ?? '')
				? getQuerySlug(url, 'genre')
				: undefined
		};
		const criteria = createFilterCriteria(
			filters,
			authorsBySlug,
			literaryPeriodsBySlug,
			genresBySlug
		);
		const books = await bookRepository.getPublishedByFilters(criteria);

		return {
			books: books.map((book) => createBookCatalogItem(book, authorsById, literaryPeriodsById)),
			filterOptions: {
				authors: authors.map(createAuthorOption),
				literaryPeriods: literaryPeriods.map(createLiteraryPeriodOption),
				genres: genres.map(createGenreOption)
			},
			filters,
			activeFilters: createActiveFilters(
				filters,
				authorsBySlug,
				literaryPeriodsBySlug,
				genresBySlug
			)
		};
	} catch {
		return createEmptyBookCatalogData('Knihy se nepodarilo nacist.');
	}
};
