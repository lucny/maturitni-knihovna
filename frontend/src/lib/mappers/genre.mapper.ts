import type { Genre } from '$lib/models/genre';

import { optionalString, requiredString, type PocketBaseRecord } from './pocketbase-record';

export type GenreRecord = PocketBaseRecord<{
	title: unknown;
	slug: unknown;
	description?: unknown;
}>;

export function mapGenreRecord(record: GenreRecord): Genre {
	return {
		id: record.id,
		title: requiredString(record.title, 'title'),
		slug: requiredString(record.slug, 'slug'),
		description: optionalString(record.description)
	};
}
