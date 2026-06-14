import type { Book, BookEditorData } from '$lib/models/book';

export type BookFilterCriteria = {
	authorId?: string;
	literaryPeriodId?: string;
	genreId?: string;
};

export interface BookRepository {
	getAll(): Promise<Book[]>;
	getPublished(): Promise<Book[]>;
	getPublishedByFilters(filters: BookFilterCriteria): Promise<Book[]>;
	search(query: string, limit?: number): Promise<Book[]>;
	getById(id: string): Promise<Book>;
	getBySlug(slug: string): Promise<Book>;
	create(data: BookEditorData): Promise<Book>;
	update(id: string, data: BookEditorData): Promise<Book>;
	delete(id: string): Promise<void>;
}
