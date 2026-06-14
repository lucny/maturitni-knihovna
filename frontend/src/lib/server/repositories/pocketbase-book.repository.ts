import type PocketBase from 'pocketbase';

import { mapBookRecord, type BookRecord } from '$lib/mappers/book.mapper';
import type { Book } from '$lib/models/book';
import type { BookRepository } from '$lib/repositories/book.repository';
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
}
