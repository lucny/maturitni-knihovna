import type { Favorite } from '$lib/models/favorite';

import { requiredString, type PocketBaseRecord } from './pocketbase-record';

export type FavoriteRecord = PocketBaseRecord<{
	user: unknown;
	book: unknown;
}>;

export function mapFavoriteRecord(record: FavoriteRecord): Favorite {
	return {
		id: record.id,
		userId: requiredString(record.user, 'user'),
		bookId: requiredString(record.book, 'book'),
		created: record.created,
		updated: record.updated
	};
}
