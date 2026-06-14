import { describe, expect, it } from 'vitest';

import { USER_ROLES } from './roles';
import { createAuthUser, createCurrentUser, getAuthUserDisplayName, type AuthUser } from './user';

describe('auth user helpers', () => {
	it('maps PocketBase auth records to safe auth users', () => {
		const user = createAuthUser({
			id: 'user-1',
			collectionId: 'users',
			collectionName: 'users',
			created: '',
			updated: '',
			email: 'student@example.com',
			name: 'Jana',
			surname: 'Novakova',
			role: USER_ROLES.EDITOR,
			active: true
		});

		expect(user).toMatchObject({
			id: 'user-1',
			email: 'student@example.com',
			name: 'Jana',
			surname: 'Novakova',
			role: USER_ROLES.EDITOR,
			active: true
		});
	});

	it('uses safe defaults for unknown role and missing active flag', () => {
		const user = createAuthUser({
			id: 'user-2',
			collectionId: 'users',
			collectionName: 'users',
			created: '',
			updated: '',
			role: 'owner'
		});

		expect(user.role).toBe(USER_ROLES.STUDENT);
		expect(user.active).toBe(true);
	});

	it('creates current user display metadata', () => {
		const currentUser = createCurrentUser({
			id: 'user-3',
			collectionId: 'users',
			collectionName: 'users',
			created: '',
			updated: '',
			email: 'teacher@example.com',
			active: false
		});

		expect(currentUser.displayName).toBe('teacher@example.com');
		expect(currentUser.isAuthorized).toBe(false);
	});

	it('prefers full name for display name', () => {
		const user: AuthUser = {
			id: 'user-4',
			email: 'admin@example.com',
			name: 'Jan',
			surname: 'Novak',
			avatar: null,
			role: USER_ROLES.ADMIN,
			provider: null,
			active: true
		};

		expect(getAuthUserDisplayName(user)).toBe('Jan Novak');
	});
});
