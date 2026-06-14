migrate((app) => {
	const findCollection = (name) => {
		try {
			return app.findCollectionByNameOrId(name);
		} catch {
			return null;
		}
	};

	if (findCollection('users')) {
		return;
	}

	const users = new Collection({
		type: 'auth',
		name: 'users',
		listRule: 'id = @request.auth.id',
		viewRule: 'id = @request.auth.id',
		createRule: '',
		updateRule: 'id = @request.auth.id',
		deleteRule: 'id = @request.auth.id',
		fields: [
			{ name: 'name', type: 'text', required: true, max: 200, presentable: true },
			{ name: 'surname', type: 'text', required: true, max: 200 },
			{
				name: 'role',
				type: 'select',
				maxSelect: 1,
				values: ['student', 'teacher', 'editor', 'admin']
			},
			{
				name: 'avatar',
				type: 'file',
				maxSelect: 1,
				maxSize: 5242880,
				mimeTypes: ['image/jpeg', 'image/png', 'image/webp']
			},
			{ name: 'provider', type: 'text', max: 100 },
			{ name: 'active', type: 'bool' }
		]
	});

	users.addIndex('idx_users_role', false, 'role', '');
	app.save(users);
}, (app) => {
	try {
		app.delete(app.findCollectionByNameOrId('users'));
	} catch {
		// Collection is already absent.
	}
});
