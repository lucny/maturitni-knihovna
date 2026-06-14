import { describe, expect, it } from 'vitest';

import { USER_ROLES, type UserRole } from '$lib/auth/roles';
import type { CurrentUser } from '$lib/auth/user';

import { evaluateRouteAccess } from './route-guard';

function createUser(role: UserRole, active = true): CurrentUser {
	return {
		id: 'user-1',
		email: 'user@example.com',
		name: 'Test',
		surname: 'User',
		avatar: null,
		role,
		provider: 'test',
		active,
		displayName: 'Test User',
		isAuthorized: active
	};
}

describe('evaluateRouteAccess', () => {
	it('allows public routes without a user', () => {
		expect(evaluateRouteAccess('/books', null)).toEqual({ allowed: true });
		expect(evaluateRouteAccess('/authors/karel-capek', null)).toEqual({ allowed: true });
	});

	it('redirects protected routes for unauthenticated users', () => {
		expect(evaluateRouteAccess('/student', null)).toEqual({
			allowed: false,
			reason: 'unauthenticated'
		});
	});

	it('allows active users into student and profile routes', () => {
		const user = createUser(USER_ROLES.STUDENT);

		expect(evaluateRouteAccess('/student/books', user)).toEqual({ allowed: true });
		expect(evaluateRouteAccess('/profile', user)).toEqual({ allowed: true });
	});

	it('rejects inactive users on protected routes', () => {
		expect(evaluateRouteAccess('/profile', createUser(USER_ROLES.ADMIN, false))).toEqual({
			allowed: false,
			reason: 'forbidden'
		});
	});

	it('enforces teacher, editor and admin role boundaries', () => {
		expect(evaluateRouteAccess('/teacher', createUser(USER_ROLES.TEACHER))).toEqual({
			allowed: true
		});
		expect(evaluateRouteAccess('/teacher/materials', createUser(USER_ROLES.EDITOR))).toEqual({
			allowed: true
		});
		expect(evaluateRouteAccess('/editor/content', createUser(USER_ROLES.TEACHER))).toEqual({
			allowed: false,
			reason: 'forbidden'
		});
		expect(evaluateRouteAccess('/admin', createUser(USER_ROLES.EDITOR))).toEqual({
			allowed: false,
			reason: 'forbidden'
		});
		expect(evaluateRouteAccess('/admin', createUser(USER_ROLES.ADMIN))).toEqual({
			allowed: true
		});
	});
});
