import type { Book } from '$lib/models/book';

import {
	optionalNumber,
	optionalString,
	optionalStringArray,
	requiredBoolean,
	requiredString,
	type PocketBaseRecord
} from './pocketbase-record';

export type BookRecord = PocketBaseRecord<{
	title: unknown;
	slug: unknown;
	original_title?: unknown;
	publication_year?: unknown;
	original_language?: unknown;
	isbn?: unknown;
	author: unknown;
	literary_period?: unknown;
	genres?: unknown;
	annotation?: unknown;
	content_summary?: unknown;
	interpretation?: unknown;
	historical_context?: unknown;
	themes?: unknown;
	motifs?: unknown;
	composition?: unknown;
	narrator?: unknown;
	time_space?: unknown;
	language_features?: unknown;
	literary_features?: unknown;
	importance?: unknown;
	exam_notes?: unknown;
	exam_questions?: unknown;
	connections?: unknown;
	cover?: unknown;
	gallery?: unknown;
	attachments?: unknown;
	published?: unknown;
	published_at?: unknown;
}>;

export function mapBookRecord(record: BookRecord): Book {
	return {
		id: record.id,
		title: requiredString(record.title, 'title'),
		slug: requiredString(record.slug, 'slug'),
		originalTitle: optionalString(record.original_title),
		publicationYear: optionalNumber(record.publication_year),
		originalLanguage: optionalString(record.original_language),
		isbn: optionalString(record.isbn),
		authorId: requiredString(record.author, 'author'),
		literaryPeriodId: optionalString(record.literary_period),
		genreIds: optionalStringArray(record.genres),
		annotation: optionalString(record.annotation),
		contentSummary: optionalString(record.content_summary),
		interpretation: optionalString(record.interpretation),
		historicalContext: optionalString(record.historical_context),
		themes: optionalString(record.themes),
		motifs: optionalString(record.motifs),
		composition: optionalString(record.composition),
		narrator: optionalString(record.narrator),
		timeSpace: optionalString(record.time_space),
		languageFeatures: optionalString(record.language_features),
		literaryFeatures: optionalString(record.literary_features),
		importance: optionalString(record.importance),
		examNotes: optionalString(record.exam_notes),
		examQuestions: optionalString(record.exam_questions),
		connections: optionalString(record.connections),
		cover: optionalString(record.cover),
		gallery: optionalStringArray(record.gallery),
		attachments: optionalStringArray(record.attachments),
		published: requiredBoolean(record.published),
		publishedAt: optionalString(record.published_at)
	};
}
