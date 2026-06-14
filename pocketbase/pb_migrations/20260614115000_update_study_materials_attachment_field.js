migrate((app) => {
	const studyMaterials = app.findCollectionByNameOrId('study_materials');
	const attachmentField = {
		name: 'attachment',
		type: 'file',
		maxSelect: 1,
		maxSize: 26214400,
		mimeTypes: [
			'application/pdf',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'application/vnd.openxmlformats-officedocument.presentationml.presentation',
			'image/jpeg',
			'image/png',
			'image/webp'
		]
	};

	try {
		const existingAttachment = studyMaterials.fields.getByName('attachment');

		existingAttachment.maxSelect = attachmentField.maxSelect;
		existingAttachment.maxSize = attachmentField.maxSize;
		existingAttachment.mimeTypes = attachmentField.mimeTypes;
	} catch {
		studyMaterials.fields.add(new Field(attachmentField));
	}

	app.save(studyMaterials);
}, (app) => {
	const studyMaterials = app.findCollectionByNameOrId('study_materials');

	try {
		const existingAttachment = studyMaterials.fields.getByName('attachment');

		existingAttachment.maxSelect = 1;
		existingAttachment.maxSize = 26214400;
		existingAttachment.mimeTypes = [
			'application/pdf',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'application/vnd.openxmlformats-officedocument.presentationml.presentation'
		];

		app.save(studyMaterials);
	} catch {
		// Attachment field is already absent.
	}
});
