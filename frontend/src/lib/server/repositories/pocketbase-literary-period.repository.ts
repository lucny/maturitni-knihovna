import type PocketBase from 'pocketbase';

import {
	mapLiteraryPeriodRecord,
	type LiteraryPeriodRecord
} from '$lib/mappers/literary-period.mapper';
import type { LiteraryPeriod } from '$lib/models/literary-period';
import type { LiteraryPeriodRepository } from '$lib/repositories/literary-period.repository';
import { createServerPocketBaseClient } from '$lib/server/api/pocketbase.server';

export class PocketBaseLiteraryPeriodRepository implements LiteraryPeriodRepository {
	constructor(private readonly pocketBase: PocketBase = createServerPocketBaseClient()) {}

	async getAll(): Promise<LiteraryPeriod[]> {
		const records = await this.pocketBase
			.collection<LiteraryPeriodRecord>('literary_periods')
			.getFullList({ sort: 'start_year,title' });

		return records.map(mapLiteraryPeriodRecord);
	}

	async getById(id: string): Promise<LiteraryPeriod> {
		const record = await this.pocketBase
			.collection<LiteraryPeriodRecord>('literary_periods')
			.getOne(id);

		return mapLiteraryPeriodRecord(record);
	}

	async getBySlug(slug: string): Promise<LiteraryPeriod> {
		const record = await this.pocketBase
			.collection<LiteraryPeriodRecord>('literary_periods')
			.getFirstListItem(this.pocketBase.filter('slug = {:slug}', { slug }));

		return mapLiteraryPeriodRecord(record);
	}
}
