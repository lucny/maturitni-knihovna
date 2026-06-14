import type { Author } from '$lib/models/author';

export interface AuthorRepository {
	getAll(): Promise<Author[]>;
	search(query: string, limit?: number): Promise<Author[]>;
	getById(id: string): Promise<Author>;
	getBySlug(slug: string): Promise<Author>;
}
