import { describe, expect, it } from 'vitest';

import {
	DEFAULT_USER_ROLE,
	USER_ROLES,
	hasAnyRole,
	hasRole,
	isActiveUser,
	isAdmin,
	isEditor,
	isStudent,
	isTeacher,
	isUserRole,
	normalizeUserRole
} from './roles';

describe('role helpers', () => {
	it('recognizes only supported user roles', () => {
		expect(isUserRole(USER_ROLES.STUDENT)).toBe(true);
		expect(isUserRole(USER_ROLES.TEACHER)).toBe(true);
		expect(isUserRole('owner')).toBe(false);
		expect(isUserRole(null)).toBe(false);
	});

	it('normalizes missing or unsupported roles to student', () => {
		expect(normalizeUserRole(USER_ROLES.ADMIN)).toBe(USER_ROLES.ADMIN);
		expect(normalizeUserRole('unknown')).toBe(DEFAULT_USER_ROLE);
		expect(normalizeUserRole(undefined)).toBe(USER_ROLES.STUDENT);
	});

	it('requires active users for role checks', () => {
		const activeTeacher = { role: USER_ROLES.TEACHER, active: true };
		const inactiveTeacher = { role: USER_ROLES.TEACHER, active: false };

		expect(isActiveUser(activeTeacher)).toBe(true);
		expect(isTeacher(activeTeacher)).toBe(true);
		expect(hasRole(activeTeacher, USER_ROLES.TEACHER)).toBe(true);
		expect(hasAnyRole(activeTeacher, [USER_ROLES.TEACHER, USER_ROLES.ADMIN])).toBe(true);

		expect(isActiveUser(inactiveTeacher)).toBe(false);
		expect(isTeacher(inactiveTeacher)).toBe(false);
		expect(hasRole(inactiveTeacher, USER_ROLES.TEACHER)).toBe(false);
		expect(hasAnyRole(inactiveTeacher, [USER_ROLES.TEACHER])).toBe(false);
	});

	it('checks individual role helpers', () => {
		expect(isStudent({ role: USER_ROLES.STUDENT, active: true })).toBe(true);
		expect(isTeacher({ role: USER_ROLES.TEACHER, active: true })).toBe(true);
		expect(isEditor({ role: USER_ROLES.EDITOR, active: true })).toBe(true);
		expect(isAdmin({ role: USER_ROLES.ADMIN, active: true })).toBe(true);
	});
});
