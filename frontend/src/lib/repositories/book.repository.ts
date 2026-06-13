import type { Book } from '$lib/models/book';

export interface BookRepository {
	getAll(): Promise<Book[]>;
	getPublished(): Promise<Book[]>;
	getById(id: string): Promise<Book>;
	getBySlug(slug: string): Promise<Book>;
}
