export const STUDY_MATERIAL_TYPES = {
	WORKSHEET: 'worksheet',
	PRESENTATION: 'presentation',
	ANALYSIS: 'analysis',
	VIDEO: 'video',
	LINK: 'link'
} as const;

export type StudyMaterialType = (typeof STUDY_MATERIAL_TYPES)[keyof typeof STUDY_MATERIAL_TYPES];

export interface StudyMaterial {
	id: string;
	title: string;
	slug: string;
	description?: string;
	materialType: StudyMaterialType;
	content?: string;
	attachment?: string;
	published: boolean;
	bookId?: string;
	authorId?: string;
	created: string;
	updated: string;
}

export type StudyMaterialCreateData = {
	title: string;
	slug: string;
	description?: string;
	materialType: StudyMaterialType;
	content?: string;
	bookId?: string;
	authorId?: string;
	published: boolean;
};

export type StudyMaterialUpdateData = StudyMaterialCreateData;
