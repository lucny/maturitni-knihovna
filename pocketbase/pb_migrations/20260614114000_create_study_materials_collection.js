migrate((app) => {
	const findCollection = (name) => {
		try {
			return app.findCollectionByNameOrId(name);
		} catch {
			return null;
		}
	};

	if (findCollection('study_materials')) {
		return;
	}

	const books = app.findCollectionByNameOrId('books');
	const authors = app.findCollectionByNameOrId('authors');
	const teacherRule =
		'@request.auth.active = true && (@request.auth.role = "teacher" || @request.auth.role = "editor" || @request.auth.role = "admin")';
	const readableRule = `published = true || (${teacherRule})`;

	const studyMaterials = new Collection({
		type: 'base',
		name: 'study_materials',
		listRule: readableRule,
		viewRule: readableRule,
		createRule: teacherRule,
		updateRule: teacherRule,
		deleteRule: teacherRule,
		fields: [
			{ name: 'title', type: 'text', required: true, max: 300, presentable: true },
			{ name: 'slug', type: 'text', required: true, max: 200 },
			{ name: 'description', type: 'editor' },
			{
				name: 'material_type',
				type: 'select',
				required: true,
				maxSelect: 1,
				values: ['worksheet', 'presentation', 'analysis', 'video', 'link']
			},
			{ name: 'content', type: 'editor' },
			{
				name: 'attachment',
				type: 'file',
				maxSelect: 1,
				maxSize: 26214400,
				mimeTypes: [
					'application/pdf',
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					'application/vnd.openxmlformats-officedocument.presentationml.presentation'
				]
			},
			{ name: 'published', type: 'bool' },
			{
				name: 'book',
				type: 'relation',
				collectionId: books.id,
				maxSelect: 1
			},
			{
				name: 'author',
				type: 'relation',
				collectionId: authors.id,
				maxSelect: 1
			}
		]
	});

	studyMaterials.addIndex('idx_study_materials_slug', true, 'slug', '');
	studyMaterials.addIndex('idx_study_materials_published', false, 'published', '');
	studyMaterials.addIndex('idx_study_materials_book', false, 'book', '');
	studyMaterials.addIndex('idx_study_materials_author', false, 'author', '');
	app.save(studyMaterials);
}, (app) => {
	try {
		app.delete(app.findCollectionByNameOrId('study_materials'));
	} catch {
		// Collection is already absent.
	}
});
