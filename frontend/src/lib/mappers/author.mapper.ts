import type { Author } from '$lib/models/author';

import { optionalString, requiredString, type PocketBaseRecord } from './pocketbase-record';

export type AuthorRecord = PocketBaseRecord<{
	first_name: unknown;
	last_name: unknown;
	slug: unknown;
	portrait?: unknown;
	birth_date?: unknown;
	death_date?: unknown;
	nationality?: unknown;
	occupation?: unknown;
	biography?: unknown;
	interesting_facts?: unknown;
	website?: unknown;
}>;

export function mapAuthorRecord(record: AuthorRecord): Author {
	return {
		id: record.id,
		firstName: requiredString(record.first_name, 'first_name'),
		lastName: requiredString(record.last_name, 'last_name'),
		slug: requiredString(record.slug, 'slug'),
		portrait: optionalString(record.portrait),
		birthDate: optionalString(record.birth_date),
		deathDate: optionalString(record.death_date),
		nationality: optionalString(record.nationality),
		occupation: optionalString(record.occupation),
		biography: optionalString(record.biography),
		interestingFacts: optionalString(record.interesting_facts),
		website: optionalString(record.website)
	};
}
