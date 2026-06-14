import type PocketBase from 'pocketbase';

import {
	mapStudyMaterialRecord,
	type StudyMaterialRecord
} from '$lib/mappers/study-material.mapper';
import type {
	StudyMaterial,
	StudyMaterialCreateData,
	StudyMaterialUpdateData
} from '$lib/models/study-material';
import type { StudyMaterialRepository } from '$lib/repositories/study-material.repository';
import { createServerPocketBaseClient } from '$lib/server/api/pocketbase.server';

export class PocketBaseStudyMaterialRepository implements StudyMaterialRepository {
	constructor(private readonly pocketBase: PocketBase = createServerPocketBaseClient()) {}

	async getAll(): Promise<StudyMaterial[]> {
		const records = await this.pocketBase
			.collection<StudyMaterialRecord>('study_materials')
			.getFullList({ sort: '-updated' });

		return records.map(mapStudyMaterialRecord);
	}

	async getPublished(): Promise<StudyMaterial[]> {
		const records = await this.pocketBase
			.collection<StudyMaterialRecord>('study_materials')
			.getFullList({ filter: 'published = true', sort: '-updated' });

		return records.map(mapStudyMaterialRecord);
	}

	async getById(id: string): Promise<StudyMaterial> {
		const record = await this.pocketBase
			.collection<StudyMaterialRecord>('study_materials')
			.getOne(id);

		return mapStudyMaterialRecord(record);
	}

	async create(data: StudyMaterialCreateData): Promise<StudyMaterial> {
		const record = await this.pocketBase
			.collection<StudyMaterialRecord>('study_materials')
			.create(toPocketBaseData(data));

		return mapStudyMaterialRecord(record);
	}

	async update(id: string, data: StudyMaterialUpdateData): Promise<StudyMaterial> {
		const record = await this.pocketBase
			.collection<StudyMaterialRecord>('study_materials')
			.update(id, toPocketBaseData(data));

		return mapStudyMaterialRecord(record);
	}

	async setPublished(id: string, published: boolean): Promise<StudyMaterial> {
		const record = await this.pocketBase
			.collection<StudyMaterialRecord>('study_materials')
			.update(id, {
				published
			});

		return mapStudyMaterialRecord(record);
	}
}

function toPocketBaseData(data: StudyMaterialCreateData | StudyMaterialUpdateData) {
	return {
		title: data.title,
		slug: data.slug,
		description: data.description,
		material_type: data.materialType,
		content: data.content,
		book: data.bookId,
		author: data.authorId,
		published: data.published
	};
}
