import {
	STUDY_MATERIAL_TYPES,
	type StudyMaterial,
	type StudyMaterialType
} from '$lib/models/study-material';

import {
	optionalString,
	requiredBoolean,
	requiredString,
	type PocketBaseRecord
} from './pocketbase-record';

export type StudyMaterialRecord = PocketBaseRecord<{
	title: unknown;
	slug: unknown;
	description?: unknown;
	material_type: unknown;
	content?: unknown;
	attachment?: unknown;
	published?: unknown;
	book?: unknown;
	author?: unknown;
}>;

export function mapStudyMaterialRecord(record: StudyMaterialRecord): StudyMaterial {
	return {
		id: record.id,
		title: requiredString(record.title, 'title'),
		slug: requiredString(record.slug, 'slug'),
		description: optionalString(record.description),
		materialType: mapStudyMaterialType(record.material_type),
		content: optionalString(record.content),
		attachment: optionalString(record.attachment),
		published: requiredBoolean(record.published),
		bookId: optionalString(record.book),
		authorId: optionalString(record.author),
		created: record.created,
		updated: record.updated
	};
}

function mapStudyMaterialType(value: unknown): StudyMaterialType {
	if (
		value === STUDY_MATERIAL_TYPES.WORKSHEET ||
		value === STUDY_MATERIAL_TYPES.PRESENTATION ||
		value === STUDY_MATERIAL_TYPES.ANALYSIS ||
		value === STUDY_MATERIAL_TYPES.VIDEO ||
		value === STUDY_MATERIAL_TYPES.LINK
	) {
		return value;
	}

	return STUDY_MATERIAL_TYPES.WORKSHEET;
}
