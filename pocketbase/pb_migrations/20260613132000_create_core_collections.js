migrate((app) => {
	const editorRule =
		'@request.auth.role = "teacher" || @request.auth.role = "editor" || @request.auth.role = "admin"';

	const findCollection = (name) => {
		try {
			return app.findCollectionByNameOrId(name);
		} catch {
			return null;
		}
	};

	const saveCollection = (collection) => {
		if (findCollection(collection.name)) {
			return findCollection(collection.name);
		}

		app.save(collection);

		return collection;
	};

	const authors = saveCollection(
		new Collection({
			type: 'base',
			name: 'authors',
			listRule: '',
			viewRule: '',
			createRule: editorRule,
			updateRule: editorRule,
			deleteRule: editorRule,
			fields: [
				{ name: 'first_name', type: 'text', required: true, max: 200, presentable: true },
				{ name: 'last_name', type: 'text', required: true, max: 200, presentable: true },
				{ name: 'slug', type: 'text', required: true, max: 200 },
				{
					name: 'portrait',
					type: 'file',
					maxSelect: 1,
					maxSize: 5242880,
					mimeTypes: ['image/jpeg', 'image/png', 'image/webp']
				},
				{ name: 'birth_date', type: 'date' },
				{ name: 'death_date', type: 'date' },
				{ name: 'nationality', type: 'text', max: 200 },
				{ name: 'occupation', type: 'text', max: 300 },
				{ name: 'biography', type: 'editor' },
				{ name: 'interesting_facts', type: 'editor' },
				{ name: 'website', type: 'url' }
			]
		})
	);
	authors.addIndex('idx_authors_slug', true, 'slug', '');
	app.save(authors);

	const literaryPeriods = saveCollection(
		new Collection({
			type: 'base',
			name: 'literary_periods',
			listRule: '',
			viewRule: '',
			createRule: editorRule,
			updateRule: editorRule,
			deleteRule: editorRule,
			fields: [
				{ name: 'title', type: 'text', required: true, max: 300, presentable: true },
				{ name: 'slug', type: 'text', required: true, max: 200 },
				{ name: 'description', type: 'editor' },
				{ name: 'start_year', type: 'number', onlyInt: true },
				{ name: 'end_year', type: 'number', onlyInt: true },
				{ name: 'historical_context', type: 'editor' },
				{ name: 'characteristics', type: 'editor' }
			]
		})
	);
	literaryPeriods.addIndex('idx_period_slug', true, 'slug', '');
	app.save(literaryPeriods);

	const genres = saveCollection(
		new Collection({
			type: 'base',
			name: 'genres',
			listRule: '',
			viewRule: '',
			createRule: editorRule,
			updateRule: editorRule,
			deleteRule: editorRule,
			fields: [
				{ name: 'title', type: 'text', required: true, max: 200, presentable: true },
				{ name: 'slug', type: 'text', required: true, max: 200 },
				{ name: 'description', type: 'editor' }
			]
		})
	);
	genres.addIndex('idx_genre_slug', true, 'slug', '');
	app.save(genres);

	const books = saveCollection(
		new Collection({
			type: 'base',
			name: 'books',
			listRule: 'published = true',
			viewRule: 'published = true',
			createRule: editorRule,
			updateRule: editorRule,
			deleteRule: editorRule,
			fields: [
				{ name: 'title', type: 'text', required: true, max: 300, presentable: true },
				{ name: 'slug', type: 'text', required: true, max: 200 },
				{ name: 'original_title', type: 'text', max: 300 },
				{ name: 'publication_year', type: 'number', onlyInt: true },
				{ name: 'original_language', type: 'text', max: 100 },
				{ name: 'isbn', type: 'text', max: 32 },
				{
					name: 'author',
					type: 'relation',
					collectionId: authors.id,
					maxSelect: 1,
					required: true
				},
				{
					name: 'literary_period',
					type: 'relation',
					collectionId: literaryPeriods.id,
					maxSelect: 1
				},
				{
					name: 'genres',
					type: 'relation',
					collectionId: genres.id,
					maxSelect: 20
				},
				{ name: 'annotation', type: 'editor' },
				{ name: 'content_summary', type: 'editor' },
				{ name: 'interpretation', type: 'editor' },
				{ name: 'historical_context', type: 'editor' },
				{ name: 'themes', type: 'editor' },
				{ name: 'motifs', type: 'editor' },
				{ name: 'composition', type: 'editor' },
				{ name: 'narrator', type: 'editor' },
				{ name: 'time_space', type: 'editor' },
				{ name: 'language_features', type: 'editor' },
				{ name: 'literary_features', type: 'editor' },
				{ name: 'importance', type: 'editor' },
				{ name: 'exam_notes', type: 'editor' },
				{ name: 'exam_questions', type: 'editor' },
				{ name: 'connections', type: 'editor' },
				{
					name: 'cover',
					type: 'file',
					maxSelect: 1,
					maxSize: 5242880,
					mimeTypes: ['image/jpeg', 'image/png', 'image/webp']
				},
				{
					name: 'gallery',
					type: 'file',
					maxSelect: 20,
					maxSize: 5242880,
					mimeTypes: ['image/jpeg', 'image/png', 'image/webp']
				},
				{
					name: 'attachments',
					type: 'file',
					maxSelect: 20,
					maxSize: 26214400,
					mimeTypes: [
						'application/pdf',
						'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
						'application/vnd.openxmlformats-officedocument.presentationml.presentation'
					]
				},
				{ name: 'published', type: 'bool' },
				{ name: 'published_at', type: 'date' }
			]
		})
	);
	books.addIndex('idx_book_slug', true, 'slug', '');
	books.addIndex('idx_book_title', false, 'title', '');
	books.addIndex('idx_book_year', false, 'publication_year', '');
	app.save(books);
}, (app) => {
	const deleteCollection = (name) => {
		try {
			app.delete(app.findCollectionByNameOrId(name));
		} catch {
			// Collection is already absent.
		}
	};

	deleteCollection('books');
	deleteCollection('genres');
	deleteCollection('literary_periods');
	deleteCollection('authors');
});
