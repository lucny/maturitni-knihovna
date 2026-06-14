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

		return records.map((record) => this.mapRecord(record));
	}

	async getPublished(): Promise<StudyMaterial[]> {
		const records = await this.pocketBase
			.collection<StudyMaterialRecord>('study_materials')
			.getFullList({ filter: 'published = true', sort: '-updated' });

		return records.map((record) => this.mapRecord(record));
	}

	async getById(id: string): Promise<StudyMaterial> {
		const record = await this.pocketBase
			.collection<StudyMaterialRecord>('study_materials')
			.getOne(id);

		return this.mapRecord(record);
	}

	async create(data: StudyMaterialCreateData, attachment?: File): Promise<StudyMaterial> {
		const record = await this.pocketBase
			.collection<StudyMaterialRecord>('study_materials')
			.create(toPocketBaseFormData(data, attachment));

		return this.mapRecord(record);
	}

	async update(
		id: string,
		data: StudyMaterialUpdateData,
		attachment?: File
	): Promise<StudyMaterial> {
		const record = await this.pocketBase
			.collection<StudyMaterialRecord>('study_materials')
			.update(id, toPocketBaseFormData(data, attachment));

		return this.mapRecord(record);
	}

	async removeAttachment(id: string): Promise<StudyMaterial> {
		const record = await this.pocketBase
			.collection<StudyMaterialRecord>('study_materials')
			.update(id, {
				attachment: null
			});

		return this.mapRecord(record);
	}

	async setPublished(id: string, published: boolean): Promise<StudyMaterial> {
		const record = await this.pocketBase
			.collection<StudyMaterialRecord>('study_materials')
			.update(id, {
				published
			});

		return this.mapRecord(record);
	}

	private mapRecord(record: StudyMaterialRecord): StudyMaterial {
		const material = mapStudyMaterialRecord(record);

		if (!material.attachment) {
			return material;
		}

		return {
			...material,
			attachmentUrl: this.pocketBase.files.getURL(record, material.attachment)
		};
	}
}

function toPocketBaseFormData(
	data: StudyMaterialCreateData | StudyMaterialUpdateData,
	attachment?: File
): FormData {
	const formData = new FormData();

	formData.set('title', data.title);
	formData.set('slug', data.slug);
	formData.set('description', data.description ?? '');
	formData.set('material_type', data.materialType);
	formData.set('content', data.content ?? '');
	formData.set('book', data.bookId ?? '');
	formData.set('author', data.authorId ?? '');
	formData.set('published', data.published ? 'true' : 'false');

	if (attachment) {
		formData.set('attachment', attachment);
	}

	return formData;
}
