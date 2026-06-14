export const STUDY_MATERIAL_TYPES = {
	WORKSHEET: 'worksheet',
	PRESENTATION: 'presentation',
	ANALYSIS: 'analysis',
	VIDEO: 'video',
	LINK: 'link'
} as const;

export const STUDY_MATERIAL_ATTACHMENT_MAX_SIZE = 26_214_400;

export const STUDY_MATERIAL_ATTACHMENT_EXTENSIONS = [
	'pdf',
	'docx',
	'pptx',
	'jpg',
	'jpeg',
	'png',
	'webp'
] as const;

export const STUDY_MATERIAL_ATTACHMENT_MIME_TYPES = [
	'application/pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'image/jpeg',
	'image/png',
	'image/webp'
] as const;

export type StudyMaterialType = (typeof STUDY_MATERIAL_TYPES)[keyof typeof STUDY_MATERIAL_TYPES];
export type StudyMaterialAttachmentExtension =
	(typeof STUDY_MATERIAL_ATTACHMENT_EXTENSIONS)[number];

export interface StudyMaterial {
	id: string;
	title: string;
	slug: string;
	description?: string;
	materialType: StudyMaterialType;
	content?: string;
	attachment?: string;
	attachmentUrl?: string;
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
