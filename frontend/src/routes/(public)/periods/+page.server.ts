import type { LiteraryPeriod } from '$lib/models/literary-period';
import { PocketBaseLiteraryPeriodRepository } from '$lib/server/repositories/pocketbase-literary-period.repository';

import type { PageServerLoad } from './$types';

type LiteraryPeriodListItem = {
	id: string;
	slug: string;
	title: string;
	yearRange?: string;
	description?: string;
};

type LiteraryPeriodListData = {
	periods: LiteraryPeriodListItem[];
	loadError?: string;
};

function createYearRange(period: LiteraryPeriod): string | undefined {
	if (period.startYear !== undefined && period.endYear !== undefined) {
		return `${period.startYear}-${period.endYear}`;
	}

	if (period.startYear !== undefined) {
		return `od ${period.startYear}`;
	}

	if (period.endYear !== undefined) {
		return `do ${period.endYear}`;
	}

	return undefined;
}

function createLiteraryPeriodListItem(period: LiteraryPeriod): LiteraryPeriodListItem {
	return {
		id: period.id,
		slug: period.slug,
		title: period.title,
		yearRange: createYearRange(period),
		description: period.description
	};
}

export const load: PageServerLoad = async (): Promise<LiteraryPeriodListData> => {
	const literaryPeriodRepository = new PocketBaseLiteraryPeriodRepository();

	try {
		const periods = await literaryPeriodRepository.getAll();

		return {
			periods: periods.map(createLiteraryPeriodListItem)
		};
	} catch {
		return {
			periods: [],
			loadError: 'Literarni obdobi se nepodarilo nacist.'
		};
	}
};
