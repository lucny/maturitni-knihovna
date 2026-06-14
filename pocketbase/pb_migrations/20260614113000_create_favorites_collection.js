migrate((app) => {
	const findCollection = (name) => {
		try {
			return app.findCollectionByNameOrId(name);
		} catch {
			return null;
		}
	};

	if (findCollection('favorites')) {
		return;
	}

	const users = app.findCollectionByNameOrId('users');
	const books = app.findCollectionByNameOrId('books');
	const ownerRule = '@request.auth.active = true && user = @request.auth.id';

	const favorites = new Collection({
		type: 'base',
		name: 'favorites',
		listRule: ownerRule,
		viewRule: ownerRule,
		createRule: ownerRule,
		updateRule: ownerRule,
		deleteRule: ownerRule,
		fields: [
			{
				name: 'user',
				type: 'relation',
				collectionId: users.id,
				maxSelect: 1,
				required: true
			},
			{
				name: 'book',
				type: 'relation',
				collectionId: books.id,
				maxSelect: 1,
				required: true
			}
		]
	});

	favorites.addIndex('idx_favorites_user', false, 'user', '');
	favorites.addIndex('idx_favorites_book', false, 'book', '');
	favorites.addIndex('idx_favorites_user_book_unique', true, 'user, book', '');
	app.save(favorites);
}, (app) => {
	try {
		app.delete(app.findCollectionByNameOrId('favorites'));
	} catch {
		// Collection is already absent.
	}
});
