import type { Author, AuthorEditorData } from '$lib/models/author';

export interface AuthorRepository {
	getAll(): Promise<Author[]>;
	search(query: string, limit?: number): Promise<Author[]>;
	getById(id: string): Promise<Author>;
	getBySlug(slug: string): Promise<Author>;
	create(data: AuthorEditorData): Promise<Author>;
	update(id: string, data: AuthorEditorData): Promise<Author>;
	delete(id: string): Promise<void>;
}
