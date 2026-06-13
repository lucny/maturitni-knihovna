import type PocketBase from 'pocketbase';

import { mapGenreRecord, type GenreRecord } from '$lib/mappers/genre.mapper';
import type { Genre } from '$lib/models/genre';
import type { GenreRepository } from '$lib/repositories/genre.repository';
import { createServerPocketBaseClient } from '$lib/server/api/pocketbase.server';

export class PocketBaseGenreRepository implements GenreRepository {
	constructor(private readonly pocketBase: PocketBase = createServerPocketBaseClient()) {}

	async getAll(): Promise<Genre[]> {
		const records = await this.pocketBase
			.collection<GenreRecord>('genres')
			.getFullList({ sort: 'title' });

		return records.map(mapGenreRecord);
	}

	async getById(id: string): Promise<Genre> {
		const record = await this.pocketBase.collection<GenreRecord>('genres').getOne(id);

		return mapGenreRecord(record);
	}

	async getBySlug(slug: string): Promise<Genre> {
		const record = await this.pocketBase
			.collection<GenreRecord>('genres')
			.getFirstListItem(this.pocketBase.filter('slug = {:slug}', { slug }));

		return mapGenreRecord(record);
	}
}
