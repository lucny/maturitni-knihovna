export interface Favorite {
	id: string;
	userId: string;
	bookId: string;
	created: string;
	updated: string;
}

export type FavoriteCreateData = {
	userId: string;
	bookId: string;
};
