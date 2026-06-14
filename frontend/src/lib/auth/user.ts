import type { RecordModel } from 'pocketbase';

import { normalizeUserRole, type UserRole } from '$lib/auth/roles';

export type AuthUser = {
	id: string;
	email: string | null;
	name: string | null;
	surname: string | null;
	avatar: string | null;
	role: UserRole;
	provider: string | null;
	active: boolean;
};

export type CurrentUser = AuthUser & {
	displayName: string;
	isAuthorized: boolean;
};

export type UserAuthRecord = RecordModel & {
	email?: string;
	name?: string;
	surname?: string;
	avatar?: string;
	role?: unknown;
	provider?: string;
	active?: boolean;
};

export function getAuthUserDisplayName(user: AuthUser): string {
	const fullName = [user.name, user.surname].filter(Boolean).join(' ');

	return fullName || user.email || 'Prihlaseny uzivatel';
}

export function createAuthUser(record: UserAuthRecord): AuthUser {
	return {
		id: record.id,
		email: record.email ?? null,
		name: record.name ?? null,
		surname: record.surname ?? null,
		avatar: record.avatar ?? null,
		role: normalizeUserRole(record.role),
		provider: record.provider ?? null,
		active: record.active ?? true
	};
}

export function createCurrentUser(record: UserAuthRecord): CurrentUser {
	const authUser = createAuthUser(record);

	return {
		...authUser,
		displayName: getAuthUserDisplayName(authUser),
		isAuthorized: authUser.active
	};
}
