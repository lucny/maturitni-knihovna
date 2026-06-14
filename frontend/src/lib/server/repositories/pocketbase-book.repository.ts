import type PocketBase from 'pocketbase';

import { mapBookRecord, type BookRecord } from '$lib/mappers/book.mapper';
import type { Book, BookEditorData } from '$lib/models/book';
import type { BookFilterCriteria, BookRepository } from '$lib/repositories/book.repository';
import { createServerPocketBaseClient } from '$lib/server/api/pocketbase.server';

export class PocketBaseBookRepository implements BookRepository {
	constructor(private readonly pocketBase: PocketBase = createServerPocketBaseClient()) {}

	async getAll(): Promise<Book[]> {
		const records = await this.pocketBase
			.collection<BookRecord>('books')
			.getFullList({ sort: 'title' });

		return records.map(mapBookRecord);
	}

	async getPublished(): Promise<Book[]> {
		const records = await this.pocketBase
			.collection<BookRecord>('books')
			.getFullList({ filter: 'published = true', sort: 'title' });

		return records.map(mapBookRecord);
	}

	async getPublishedByFilters(filters: BookFilterCriteria): Promise<Book[]> {
		const filterParts = ['published = true'];
		const filterParams: Record<string, string> = {};

		if (filters.authorId) {
			filterParts.push('author = {:authorId}');
			filterParams.authorId = filters.authorId;
		}

		if (filters.literaryPeriodId) {
			filterParts.push('literary_period = {:literaryPeriodId}');
			filterParams.literaryPeriodId = filters.literaryPeriodId;
		}

		if (filters.genreId) {
			filterParts.push('genres ?= {:genreId}');
			filterParams.genreId = filters.genreId;
		}

		const records = await this.pocketBase.collection<BookRecord>('books').getFullList({
			filter: this.pocketBase.filter(filterParts.join(' && '), filterParams),
			sort: 'title'
		});

		return records.map(mapBookRecord);
	}

	async search(query: string, limit = 10): Promise<Book[]> {
		const normalizedQuery = query.trim();

		if (!normalizedQuery) {
			return [];
		}

		const records = await this.pocketBase.collection<BookRecord>('books').getList(1, limit, {
			filter: this.pocketBase.filter(
				'published = true && (title ~ {:query} || original_title ~ {:query})',
				{ query: normalizedQuery }
			),
			sort: 'title'
		});

		return records.items.map(mapBookRecord);
	}

	async getById(id: string): Promise<Book> {
		const record = await this.pocketBase.collection<BookRecord>('books').getOne(id);

		return mapBookRecord(record);
	}

	async getBySlug(slug: string): Promise<Book> {
		const record = await this.pocketBase
			.collection<BookRecord>('books')
			.getFirstListItem(this.pocketBase.filter('slug = {:slug}', { slug }));

		return mapBookRecord(record);
	}

	async create(data: BookEditorData): Promise<Book> {
		const record = await this.pocketBase
			.collection<BookRecord>('books')
			.create(toPocketBaseData(data));

		return mapBookRecord(record);
	}

	async update(id: string, data: BookEditorData): Promise<Book> {
		const record = await this.pocketBase
			.collection<BookRecord>('books')
			.update(id, toPocketBaseData(data));

		return mapBookRecord(record);
	}

	async delete(id: string): Promise<void> {
		await this.pocketBase.collection('books').delete(id);
	}
}

function toPocketBaseData(data: BookEditorData) {
	return {
		title: data.title,
		slug: data.slug,
		original_title: data.originalTitle ?? '',
		publication_year: data.publicationYear ?? null,
		original_language: data.originalLanguage ?? '',
		isbn: data.isbn ?? '',
		author: data.authorId,
		literary_period: data.literaryPeriodId ?? '',
		genres: data.genreIds,
		annotation: data.annotation ?? '',
		content_summary: data.contentSummary ?? '',
		interpretation: data.interpretation ?? '',
		historical_context: data.historicalContext ?? '',
		themes: data.themes ?? '',
		motifs: data.motifs ?? '',
		composition: data.composition ?? '',
		narrator: data.narrator ?? '',
		time_space: data.timeSpace ?? '',
		language_features: data.languageFeatures ?? '',
		literary_features: data.literaryFeatures ?? '',
		importance: data.importance ?? '',
		exam_notes: data.examNotes ?? '',
		exam_questions: data.examQuestions ?? '',
		connections: data.connections ?? '',
		published: data.published,
		published_at: data.publishedAt ?? ''
	};
}
