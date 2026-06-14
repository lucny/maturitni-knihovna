import { publicPocketBaseUrl } from '$lib/api/pocketbase.config';
import type { Author } from '$lib/models/author';
import type { Book } from '$lib/models/book';
import { PocketBaseAuthorRepository } from '$lib/server/repositories/pocketbase-author.repository';
import { PocketBaseBookRepository } from '$lib/server/repositories/pocketbase-book.repository';

import type { PageServerLoad } from './$types';

type AuthorBook = {
	id: string;
	slug: string;
	title: string;
	publicationYear?: number;
};

type AuthorDetail = {
	fullName: string;
	seoTitle: string;
	seoDescription: string;
	portraitUrl?: string;
	nationality?: string;
	occupation?: string;
	birthDate?: string;
	deathDate?: string;
	lifeYears?: string;
	biography?: string;
	books: AuthorBook[];
};

type AuthorDetailData = {
	author?: AuthorDetail;
	loadError?: string;
	notFound: boolean;
};

function getAuthorFullName(author: Author): string {
	return [author.firstName, author.lastName].filter(Boolean).join(' ');
}

function getYear(value: string | undefined): string | undefined {
	return value?.match(/^\d{4}/)?.[0];
}

function getLifeYears(author: Author): string | undefined {
	const birthYear = getYear(author.birthDate);
	const deathYear = getYear(author.deathDate);

	if (birthYear && deathYear) {
		return `${birthYear}-${deathYear}`;
	}

	if (birthYear) {
		return `${birthYear}-`;
	}

	return deathYear;
}

function createPortraitUrl(author: Author): string | undefined {
	if (!author.portrait) {
		return undefined;
	}

	return `${publicPocketBaseUrl}/api/files/authors/${author.id}/${encodeURIComponent(author.portrait)}`;
}

function isNotFoundError(error: unknown): boolean {
	return (
		typeof error === 'object' &&
		error !== null &&
		'status' in error &&
		(error as { status?: unknown }).status === 404
	);
}

function createAuthorBook(book: Book): AuthorBook {
	return {
		id: book.id,
		slug: book.slug,
		title: book.title,
		publicationYear: book.publicationYear
	};
}

function createAuthorDetail(author: Author, books: Book[]): AuthorDetail {
	const fullName = getAuthorFullName(author);
	const biography = author.biography?.trim();

	return {
		fullName,
		seoTitle: `${fullName} | Maturitni knihovna`,
		seoDescription: biography || `Detail autora ${fullName} v projektu Maturitni knihovna.`,
		portraitUrl: createPortraitUrl(author),
		nationality: author.nationality,
		occupation: author.occupation,
		birthDate: author.birthDate,
		deathDate: author.deathDate,
		lifeYears: getLifeYears(author),
		biography,
		books: books
			.filter((book) => book.authorId === author.id)
			.map(createAuthorBook)
			.sort((firstBook, secondBook) => firstBook.title.localeCompare(secondBook.title))
	};
}

export const load: PageServerLoad = async ({ params }): Promise<AuthorDetailData> => {
	const authorRepository = new PocketBaseAuthorRepository();
	const bookRepository = new PocketBaseBookRepository();

	try {
		const author = await authorRepository.getBySlug(params.slug);
		const books = await bookRepository.getPublished();

		return {
			author: createAuthorDetail(author, books),
			notFound: false
		};
	} catch (error) {
		if (isNotFoundError(error)) {
			return { notFound: true };
		}

		return {
			loadError: 'Detail autora se nepodarilo nacist.',
			notFound: false
		};
	}
};
