import type PocketBase from 'pocketbase';

import { mapUserNoteRecord, type UserNoteRecord } from '$lib/mappers/user-note.mapper';
import type { UserNote, UserNoteCreateData, UserNoteUpdateData } from '$lib/models/user-note';
import type { UserNoteRepository } from '$lib/repositories/user-note.repository';
import { createServerPocketBaseClient } from '$lib/server/api/pocketbase.server';

export class PocketBaseUserNoteRepository implements UserNoteRepository {
	constructor(private readonly pocketBase: PocketBase = createServerPocketBaseClient()) {}

	async getByUser(userId: string): Promise<UserNote[]> {
		const records = await this.pocketBase.collection<UserNoteRecord>('user_notes').getFullList({
			filter: this.pocketBase.filter('user = {:userId}', { userId }),
			sort: '-updated'
		});

		return records.map(mapUserNoteRecord);
	}

	async getByIdForUser(id: string, userId: string): Promise<UserNote> {
		const record = await this.pocketBase.collection<UserNoteRecord>('user_notes').getOne(id, {
			filter: this.pocketBase.filter('user = {:userId}', { userId })
		});

		return mapUserNoteRecord(record);
	}

	async create(data: UserNoteCreateData): Promise<UserNote> {
		const record = await this.pocketBase.collection<UserNoteRecord>('user_notes').create({
			title: data.title,
			content: data.content,
			user: data.userId,
			book: data.bookId
		});

		return mapUserNoteRecord(record);
	}

	async update(id: string, userId: string, data: UserNoteUpdateData): Promise<UserNote> {
		await this.getByIdForUser(id, userId);

		const record = await this.pocketBase.collection<UserNoteRecord>('user_notes').update(id, {
			title: data.title,
			content: data.content,
			book: data.bookId
		});

		return mapUserNoteRecord(record);
	}

	async delete(id: string, userId: string): Promise<void> {
		await this.getByIdForUser(id, userId);
		await this.pocketBase.collection('user_notes').delete(id);
	}
}
