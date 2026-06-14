import type { LiteraryPeriod, LiteraryPeriodEditorData } from '$lib/models/literary-period';

export interface LiteraryPeriodRepository {
	getAll(): Promise<LiteraryPeriod[]>;
	getById(id: string): Promise<LiteraryPeriod>;
	getBySlug(slug: string): Promise<LiteraryPeriod>;
	create(data: LiteraryPeriodEditorData): Promise<LiteraryPeriod>;
	update(id: string, data: LiteraryPeriodEditorData): Promise<LiteraryPeriod>;
	delete(id: string): Promise<void>;
}
