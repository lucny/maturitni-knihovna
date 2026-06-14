export interface UserNote {
	id: string;
	title: string;
	content: string;
	userId: string;
	bookId?: string;
	created: string;
	updated: string;
}

export type UserNoteCreateData = {
	title: string;
	content: string;
	userId: string;
	bookId?: string;
};

export type UserNoteUpdateData = {
	title: string;
	content: string;
	bookId?: string;
};
