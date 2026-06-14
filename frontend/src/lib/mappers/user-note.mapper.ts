import type { UserNote } from '$lib/models/user-note';

import { optionalString, requiredString, type PocketBaseRecord } from './pocketbase-record';

export type UserNoteRecord = PocketBaseRecord<{
	title: unknown;
	content: unknown;
	user: unknown;
	book?: unknown;
}>;

export function mapUserNoteRecord(record: UserNoteRecord): UserNote {
	return {
		id: record.id,
		title: requiredString(record.title, 'title'),
		content: requiredString(record.content, 'content'),
		userId: requiredString(record.user, 'user'),
		bookId: optionalString(record.book),
		created: record.created,
		updated: record.updated
	};
}
