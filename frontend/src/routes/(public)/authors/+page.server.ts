import { publicPocketBaseUrl } from '$lib/api/pocketbase.config';
import type { Author } from '$lib/models/author';
import { PocketBaseAuthorRepository } from '$lib/server/repositories/pocketbase-author.repository';

import type { PageServerLoad } from './$types';

type AuthorListItem = {
	id: string;
	slug: string;
	fullName: string;
	portraitUrl?: string;
	nationality?: string;
	lifeYears?: string;
};

type AuthorListData = {
	authors: AuthorListItem[];
	loadError?: string;
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

function createAuthorListItem(author: Author): AuthorListItem {
	return {
		id: author.id,
		slug: author.slug,
		fullName: getAuthorFullName(author),
		portraitUrl: createPortraitUrl(author),
		nationality: author.nationality,
		lifeYears: getLifeYears(author)
	};
}

export const load: PageServerLoad = async (): Promise<AuthorListData> => {
	const authorRepository = new PocketBaseAuthorRepository();

	try {
		const authors = await authorRepository.getAll();

		return {
			authors: authors.map(createAuthorListItem)
		};
	} catch {
		return {
			authors: [],
			loadError: 'Autory se nepodarilo nacist.'
		};
	}
};
