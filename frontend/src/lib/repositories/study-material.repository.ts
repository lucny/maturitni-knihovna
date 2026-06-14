import type {
	StudyMaterial,
	StudyMaterialCreateData,
	StudyMaterialUpdateData
} from '$lib/models/study-material';

export interface StudyMaterialRepository {
	getAll(): Promise<StudyMaterial[]>;
	getPublished(): Promise<StudyMaterial[]>;
	getById(id: string): Promise<StudyMaterial>;
	create(data: StudyMaterialCreateData, attachment?: File): Promise<StudyMaterial>;
	update(id: string, data: StudyMaterialUpdateData, attachment?: File): Promise<StudyMaterial>;
	removeAttachment(id: string): Promise<StudyMaterial>;
	setPublished(id: string, published: boolean): Promise<StudyMaterial>;
}
