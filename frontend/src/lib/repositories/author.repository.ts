import type { Author } from '$lib/models/author';

export interface AuthorRepository {
	getAll(): Promise<Author[]>;
	getById(id: string): Promise<Author>;
	getBySlug(slug: string): Promise<Author>;
}
