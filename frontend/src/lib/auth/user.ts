import type { RecordModel } from 'pocketbase';

export type AuthUser = {
	id: string;
	email?: string;
	name?: string;
	surname?: string;
	avatar?: string;
	role?: string;
	provider?: string;
	active?: boolean;
};

export type UserAuthRecord = RecordModel & {
	email?: string;
	name?: string;
	surname?: string;
	avatar?: string;
	role?: string;
	provider?: string;
	active?: boolean;
};

export function getAuthUserDisplayName(user: AuthUser): string {
	const fullName = [user.name, user.surname].filter(Boolean).join(' ');

	return fullName || user.email || 'Prihlaseny uzivatel';
}
