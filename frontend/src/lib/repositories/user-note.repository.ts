import type { UserNote, UserNoteCreateData, UserNoteUpdateData } from '$lib/models/user-note';

export interface UserNoteRepository {
	getByUser(userId: string): Promise<UserNote[]>;
	getByIdForUser(id: string, userId: string): Promise<UserNote>;
	create(data: UserNoteCreateData): Promise<UserNote>;
	update(id: string, userId: string, data: UserNoteUpdateData): Promise<UserNote>;
	delete(id: string, userId: string): Promise<void>;
}
