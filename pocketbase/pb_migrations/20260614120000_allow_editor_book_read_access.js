migrate((app) => {
	const books = app.findCollectionByNameOrId('books');
	const editorReadRule =
		'published = true || (@request.auth.active = true && (@request.auth.role = "editor" || @request.auth.role = "admin"))';

	books.listRule = editorReadRule;
	books.viewRule = editorReadRule;

	app.save(books);
}, (app) => {
	const books = app.findCollectionByNameOrId('books');

	books.listRule = 'published = true';
	books.viewRule = 'published = true';

	app.save(books);
});
