import type PocketBase from 'pocketbase';

import { mapAuthorRecord, type AuthorRecord } from '$lib/mappers/author.mapper';
import type { Author, AuthorEditorData } from '$lib/models/author';
import type { AuthorRepository } from '$lib/repositories/author.repository';
import { createServerPocketBaseClient } from '$lib/server/api/pocketbase.server';

export class PocketBaseAuthorRepository implements AuthorRepository {
	constructor(private readonly pocketBase: PocketBase = createServerPocketBaseClient()) {}

	async getAll(): Promise<Author[]> {
		const records = await this.pocketBase
			.collection<AuthorRecord>('authors')
			.getFullList({ sort: 'last_name,first_name' });

		return records.map(mapAuthorRecord);
	}

	async search(query: string, limit = 10): Promise<Author[]> {
		const normalizedQuery = query.trim();

		if (!normalizedQuery) {
			return [];
		}

		const records = await this.pocketBase.collection<AuthorRecord>('authors').getList(1, limit, {
			filter: this.pocketBase.filter('first_name ~ {:query} || last_name ~ {:query}', {
				query: normalizedQuery
			}),
			sort: 'last_name,first_name'
		});

		return records.items.map(mapAuthorRecord);
	}

	async getById(id: string): Promise<Author> {
		const record = await this.pocketBase.collection<AuthorRecord>('authors').getOne(id);

		return mapAuthorRecord(record);
	}

	async getBySlug(slug: string): Promise<Author> {
		const record = await this.pocketBase
			.collection<AuthorRecord>('authors')
			.getFirstListItem(this.pocketBase.filter('slug = {:slug}', { slug }));

		return mapAuthorRecord(record);
	}

	async create(data: AuthorEditorData): Promise<Author> {
		const record = await this.pocketBase
			.collection<AuthorRecord>('authors')
			.create(toPocketBaseData(data));

		return mapAuthorRecord(record);
	}

	async update(id: string, data: AuthorEditorData): Promise<Author> {
		const record = await this.pocketBase
			.collection<AuthorRecord>('authors')
			.update(id, toPocketBaseData(data));

		return mapAuthorRecord(record);
	}

	async delete(id: string): Promise<void> {
		await this.pocketBase.collection('authors').delete(id);
	}
}

function toPocketBaseData(data: AuthorEditorData) {
	return {
		first_name: data.firstName,
		last_name: data.lastName,
		slug: data.slug,
		birth_date: data.birthDate ?? '',
		death_date: data.deathDate ?? '',
		nationality: data.nationality ?? '',
		occupation: data.occupation ?? '',
		biography: data.biography ?? '',
		interesting_facts: data.interestingFacts ?? '',
		website: data.website ?? ''
	};
}
