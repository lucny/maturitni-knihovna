import { fail, redirect, type Actions } from '@sveltejs/kit';

import { publicPocketBaseUrl } from '$lib/api/pocketbase.config';
import type { Book } from '$lib/models/book';
import type { Favorite } from '$lib/models/favorite';
import { PocketBaseBookRepository } from '$lib/server/repositories/pocketbase-book.repository';
import { PocketBaseFavoriteRepository } from '$lib/server/repositories/pocketbase-favorite.repository';

import type { PageServerLoad } from './$types';

type FavoriteBook = {
	favoriteId: string;
	id: string;
	slug: string;
	title: string;
	coverUrl?: string;
};

function createCoverUrl(book: Book): string | undefined {
	if (!book.cover) {
		return undefined;
	}

	return `${publicPocketBaseUrl}/api/files/books/${book.id}/${encodeURIComponent(book.cover)}`;
}

async function createFavoriteBook(
	favorite: Favorite,
	bookRepository: PocketBaseBookRepository
): Promise<FavoriteBook | null> {
	try {
		const book = await bookRepository.getById(favorite.bookId);

		if (!book.published) {
			return null;
		}

		return {
			favoriteId: favorite.id,
			id: book.id,
			slug: book.slug,
			title: book.title,
			coverUrl: createCoverUrl(book)
		};
	} catch {
		return null;
	}
}

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const favoriteRepository = new PocketBaseFavoriteRepository(locals.pb);
	const bookRepository = new PocketBaseBookRepository(locals.pb);

	try {
		const favorites = await favoriteRepository.getByUser(locals.user.id);
		const favoriteBooks = await Promise.all(
			favorites.map((favorite) => createFavoriteBook(favorite, bookRepository))
		);

		return {
			favoriteBooks: favoriteBooks.filter((book): book is FavoriteBook => Boolean(book)),
			loadError: null
		};
	} catch {
		return {
			favoriteBooks: [],
			loadError: 'Oblibene knihy se nepodarilo nacist.'
		};
	}
};

export const actions: Actions = {
	remove: async ({ locals, request }) => {
		if (!locals.user) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const favoriteId = String(formData.get('favoriteId') ?? '');

		if (!favoriteId) {
			return fail(400, {
				message: 'Chybi identifikator oblibene polozky.'
			});
		}

		const favoriteRepository = new PocketBaseFavoriteRepository(locals.pb);

		try {
			await favoriteRepository.deleteByIdForUser(favoriteId, locals.user.id);
		} catch {
			return fail(500, {
				message: 'Knihu se nepodarilo odebrat z oblibenych.'
			});
		}

		return {
			message: 'Kniha byla odebrana z oblibenych.'
		};
	}
};
