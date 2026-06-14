import { describe, expect, it } from 'vitest';

import { mapBookRecord, type BookRecord } from './book.mapper';

describe('mapBookRecord', () => {
	it('maps a PocketBase book record to application model', () => {
		const record: BookRecord = {
			id: 'book-1',
			collectionId: 'books',
			collectionName: 'books',
			created: '',
			updated: '',
			title: 'Bila nemoc',
			slug: 'bila-nemoc',
			author: 'author-1',
			literary_period: 'period-1',
			genres: ['genre-1', 'genre-2'],
			publication_year: 1937,
			annotation: 'Drama',
			published: true
		};

		expect(mapBookRecord(record)).toMatchObject({
			id: 'book-1',
			title: 'Bila nemoc',
			slug: 'bila-nemoc',
			authorId: 'author-1',
			literaryPeriodId: 'period-1',
			genreIds: ['genre-1', 'genre-2'],
			publicationYear: 1937,
			annotation: 'Drama',
			published: true
		});
	});

	it('throws for missing required string fields', () => {
		const record: BookRecord = {
			id: 'book-2',
			collectionId: 'books',
			collectionName: 'books',
			created: '',
			updated: '',
			title: null,
			slug: 'invalid-book',
			author: 'author-1',
			published: true
		};

		expect(() => mapBookRecord(record)).toThrow(
			'PocketBase record field "title" must be a string.'
		);
	});
});
