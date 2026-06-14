export interface LiteraryPeriod {
	id: string;
	title: string;
	slug: string;
	description?: string;
	startYear?: number;
	endYear?: number;
	historicalContext?: string;
	characteristics?: string;
}

export type LiteraryPeriodEditorData = {
	title: string;
	slug: string;
	description?: string;
	startYear?: number;
	endYear?: number;
	historicalContext?: string;
	characteristics?: string;
};
