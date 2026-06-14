import type { Favorite, FavoriteCreateData } from '$lib/models/favorite';

export interface FavoriteRepository {
	getByUser(userId: string): Promise<Favorite[]>;
	getByUserAndBook(userId: string, bookId: string): Promise<Favorite | null>;
	isFavorite(userId: string, bookId: string): Promise<boolean>;
	create(data: FavoriteCreateData): Promise<Favorite>;
	createIfMissing(data: FavoriteCreateData): Promise<Favorite>;
	deleteByUserAndBook(userId: string, bookId: string): Promise<void>;
	deleteByIdForUser(id: string, userId: string): Promise<void>;
}
