import type { Book } from '$lib/models/book';
import type { LiteraryPeriod } from '$lib/models/literary-period';
import { PocketBaseBookRepository } from '$lib/server/repositories/pocketbase-book.repository';
import { PocketBaseLiteraryPeriodRepository } from '$lib/server/repositories/pocketbase-literary-period.repository';

import type { PageServerLoad } from './$types';

type PeriodBook = {
	id: string;
	slug: string;
	title: string;
	publicationYear?: number;
};

type LiteraryPeriodDetail = {
	title: string;
	seoTitle: string;
	seoDescription: string;
	yearRange?: string;
	description?: string;
	historicalContext?: string;
	characteristics?: string;
	books: PeriodBook[];
};

type LiteraryPeriodDetailData = {
	period?: LiteraryPeriodDetail;
	loadError?: string;
	notFound: boolean;
};

function createYearRange(period: LiteraryPeriod): string | undefined {
	if (period.startYear !== undefined && period.endYear !== undefined) {
		return `${period.startYear}-${period.endYear}`;
	}

	if (period.startYear !== undefined) {
		return `od ${period.startYear}`;
	}

	if (period.endYear !== undefined) {
		return `do ${period.endYear}`;
	}

	return undefined;
}

function isNotFoundError(error: unknown): boolean {
	return (
		typeof error === 'object' &&
		error !== null &&
		'status' in error &&
		(error as { status?: unknown }).status === 404
	);
}

function createPeriodBook(book: Book): PeriodBook {
	return {
		id: book.id,
		slug: book.slug,
		title: book.title,
		publicationYear: book.publicationYear
	};
}

function createLiteraryPeriodDetail(period: LiteraryPeriod, books: Book[]): LiteraryPeriodDetail {
	const description = period.description?.trim();

	return {
		title: period.title,
		seoTitle: `${period.title} | Maturitni knihovna`,
		seoDescription: description || `Detail literarniho obdobi ${period.title}.`,
		yearRange: createYearRange(period),
		description,
		historicalContext: period.historicalContext?.trim(),
		characteristics: period.characteristics?.trim(),
		books: books
			.filter((book) => book.literaryPeriodId === period.id)
			.map(createPeriodBook)
			.sort((firstBook, secondBook) => firstBook.title.localeCompare(secondBook.title))
	};
}

export const load: PageServerLoad = async ({ params }): Promise<LiteraryPeriodDetailData> => {
	const literaryPeriodRepository = new PocketBaseLiteraryPeriodRepository();
	const bookRepository = new PocketBaseBookRepository();

	try {
		const period = await literaryPeriodRepository.getBySlug(params.slug);
		const books = await bookRepository.getPublished();

		return {
			period: createLiteraryPeriodDetail(period, books),
			notFound: false
		};
	} catch (error) {
		if (isNotFoundError(error)) {
			return { notFound: true };
		}

		return {
			loadError: 'Detail literarniho obdobi se nepodarilo nacist.',
			notFound: false
		};
	}
};
