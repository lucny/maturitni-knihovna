import type { Genre } from '$lib/models/genre';

export interface GenreRepository {
	getAll(): Promise<Genre[]>;
	getById(id: string): Promise<Genre>;
	getBySlug(slug: string): Promise<Genre>;
}
