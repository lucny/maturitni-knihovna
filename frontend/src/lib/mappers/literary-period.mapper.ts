import type { LiteraryPeriod } from '$lib/models/literary-period';

import {
	optionalNumber,
	optionalString,
	requiredString,
	type PocketBaseRecord
} from './pocketbase-record';

export type LiteraryPeriodRecord = PocketBaseRecord<{
	title: unknown;
	slug: unknown;
	description?: unknown;
	start_year?: unknown;
	end_year?: unknown;
	historical_context?: unknown;
	characteristics?: unknown;
}>;

export function mapLiteraryPeriodRecord(record: LiteraryPeriodRecord): LiteraryPeriod {
	return {
		id: record.id,
		title: requiredString(record.title, 'title'),
		slug: requiredString(record.slug, 'slug'),
		description: optionalString(record.description),
		startYear: optionalNumber(record.start_year),
		endYear: optionalNumber(record.end_year),
		historicalContext: optionalString(record.historical_context),
		characteristics: optionalString(record.characteristics)
	};
}
