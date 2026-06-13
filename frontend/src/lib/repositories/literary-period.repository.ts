import type { LiteraryPeriod } from '$lib/models/literary-period';

export interface LiteraryPeriodRepository {
	getAll(): Promise<LiteraryPeriod[]>;
	getById(id: string): Promise<LiteraryPeriod>;
	getBySlug(slug: string): Promise<LiteraryPeriod>;
}
