export const USER_ROLES = {
	STUDENT: 'student',
	TEACHER: 'teacher',
	EDITOR: 'editor',
	ADMIN: 'admin'
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const USER_ROLE_VALUES = Object.values(USER_ROLES);
export const DEFAULT_USER_ROLE = USER_ROLES.STUDENT;

type RoleUser = {
	role: UserRole;
	active: boolean;
};

export function isUserRole(value: unknown): value is UserRole {
	return typeof value === 'string' && USER_ROLE_VALUES.includes(value as UserRole);
}

export function normalizeUserRole(value: unknown): UserRole {
	if (isUserRole(value)) {
		return value;
	}

	return DEFAULT_USER_ROLE;
}

export function isActiveUser(user: RoleUser | null | undefined): user is RoleUser {
	return user?.active === true;
}

export function hasRole(user: RoleUser | null | undefined, role: UserRole): boolean {
	return isActiveUser(user) && user.role === role;
}

export function hasAnyRole(user: RoleUser | null | undefined, roles: readonly UserRole[]): boolean {
	return isActiveUser(user) && roles.includes(user.role);
}

export function isStudent(user: RoleUser | null | undefined): boolean {
	return hasRole(user, USER_ROLES.STUDENT);
}

export function isTeacher(user: RoleUser | null | undefined): boolean {
	return hasRole(user, USER_ROLES.TEACHER);
}

export function isEditor(user: RoleUser | null | undefined): boolean {
	return hasRole(user, USER_ROLES.EDITOR);
}

export function isAdmin(user: RoleUser | null | undefined): boolean {
	return hasRole(user, USER_ROLES.ADMIN);
}
