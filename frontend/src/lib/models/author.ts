export interface Author {
	id: string;
	firstName: string;
	lastName: string;
	slug: string;
	portrait?: string;
	birthDate?: string;
	deathDate?: string;
	nationality?: string;
	occupation?: string;
	biography?: string;
	interestingFacts?: string;
	website?: string;
}

export type AuthorEditorData = {
	firstName: string;
	lastName: string;
	slug: string;
	birthDate?: string;
	deathDate?: string;
	nationality?: string;
	occupation?: string;
	biography?: string;
	interestingFacts?: string;
	website?: string;
};
