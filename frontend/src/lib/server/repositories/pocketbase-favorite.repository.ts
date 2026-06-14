import type PocketBase from 'pocketbase';

import { mapFavoriteRecord, type FavoriteRecord } from '$lib/mappers/favorite.mapper';
import type { Favorite, FavoriteCreateData } from '$lib/models/favorite';
import type { FavoriteRepository } from '$lib/repositories/favorite.repository';
import { createServerPocketBaseClient } from '$lib/server/api/pocketbase.server';

export class PocketBaseFavoriteRepository implements FavoriteRepository {
	constructor(private readonly pocketBase: PocketBase = createServerPocketBaseClient()) {}

	async getByUser(userId: string): Promise<Favorite[]> {
		const records = await this.pocketBase.collection<FavoriteRecord>('favorites').getFullList({
			filter: this.pocketBase.filter('user = {:userId}', { userId }),
			sort: '-created'
		});

		return records.map(mapFavoriteRecord);
	}

	async getByUserAndBook(userId: string, bookId: string): Promise<Favorite | null> {
		try {
			const record = await this.pocketBase
				.collection<FavoriteRecord>('favorites')
				.getFirstListItem(
					this.pocketBase.filter('user = {:userId} && book = {:bookId}', { userId, bookId })
				);

			return mapFavoriteRecord(record);
		} catch (error) {
			if (isNotFoundError(error)) {
				return null;
			}

			throw error;
		}
	}

	async isFavorite(userId: string, bookId: string): Promise<boolean> {
		return Boolean(await this.getByUserAndBook(userId, bookId));
	}

	async create(data: FavoriteCreateData): Promise<Favorite> {
		const record = await this.pocketBase.collection<FavoriteRecord>('favorites').create({
			user: data.userId,
			book: data.bookId
		});

		return mapFavoriteRecord(record);
	}

	async createIfMissing(data: FavoriteCreateData): Promise<Favorite> {
		const existingFavorite = await this.getByUserAndBook(data.userId, data.bookId);

		if (existingFavorite) {
			return existingFavorite;
		}

		return this.create(data);
	}

	async deleteByUserAndBook(userId: string, bookId: string): Promise<void> {
		const favorite = await this.getByUserAndBook(userId, bookId);

		if (!favorite) {
			return;
		}

		await this.pocketBase.collection('favorites').delete(favorite.id);
	}

	async deleteByIdForUser(id: string, userId: string): Promise<void> {
		const record = await this.pocketBase.collection<FavoriteRecord>('favorites').getOne(id, {
			filter: this.pocketBase.filter('user = {:userId}', { userId })
		});

		await this.pocketBase.collection('favorites').delete(record.id);
	}
}

function isNotFoundError(error: unknown): boolean {
	return (
		typeof error === 'object' &&
		error !== null &&
		'status' in error &&
		(error as { status?: unknown }).status === 404
	);
}
