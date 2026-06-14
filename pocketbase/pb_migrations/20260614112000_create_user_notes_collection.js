migrate((app) => {
	const findCollection = (name) => {
		try {
			return app.findCollectionByNameOrId(name);
		} catch {
			return null;
		}
	};

	if (findCollection('user_notes')) {
		return;
	}

	const users = app.findCollectionByNameOrId('users');
	const books = app.findCollectionByNameOrId('books');
	const ownerRule = '@request.auth.active = true && user = @request.auth.id';

	const userNotes = new Collection({
		type: 'base',
		name: 'user_notes',
		listRule: ownerRule,
		viewRule: ownerRule,
		createRule: ownerRule,
		updateRule: ownerRule,
		deleteRule: ownerRule,
		fields: [
			{ name: 'title', type: 'text', required: true, max: 200, presentable: true },
			{ name: 'content', type: 'editor', required: true },
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
				maxSelect: 1
			}
		]
	});

	userNotes.addIndex('idx_user_notes_user', false, 'user', '');
	userNotes.addIndex('idx_user_notes_book', false, 'book', '');
	app.save(userNotes);
}, (app) => {
	try {
		app.delete(app.findCollectionByNameOrId('user_notes'));
	} catch {
		// Collection is already absent.
	}
});
