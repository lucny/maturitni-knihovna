import { USER_ROLES, hasAnyRole, isActiveUser, type UserRole } from '$lib/auth/roles';
import type { CurrentUser } from '$lib/auth/user';

type ProtectedRouteRule = {
	prefix: string;
	allowedRoles?: readonly UserRole[];
};

export type RouteAccessDecision =
	| {
			allowed: true;
	  }
	| {
			allowed: false;
			reason: 'unauthenticated' | 'forbidden';
	  };

const PROTECTED_ROUTE_RULES: readonly ProtectedRouteRule[] = [
	{
		prefix: '/student'
	},
	{
		prefix: '/teacher',
		allowedRoles: [USER_ROLES.TEACHER, USER_ROLES.EDITOR, USER_ROLES.ADMIN]
	},
	{
		prefix: '/editor',
		allowedRoles: [USER_ROLES.EDITOR, USER_ROLES.ADMIN]
	},
	{
		prefix: '/admin',
		allowedRoles: [USER_ROLES.ADMIN]
	},
	{
		prefix: '/profile'
	}
];

export function evaluateRouteAccess(
	pathname: string,
	user: CurrentUser | null
): RouteAccessDecision {
	const rule = findProtectedRouteRule(pathname);

	if (!rule) {
		return { allowed: true };
	}

	if (!user) {
		return { allowed: false, reason: 'unauthenticated' };
	}

	if (!isActiveUser(user)) {
		return { allowed: false, reason: 'forbidden' };
	}

	if (!rule.allowedRoles) {
		return { allowed: true };
	}

	if (hasAnyRole(user, rule.allowedRoles)) {
		return { allowed: true };
	}

	return { allowed: false, reason: 'forbidden' };
}

function findProtectedRouteRule(pathname: string): ProtectedRouteRule | null {
	return PROTECTED_ROUTE_RULES.find((rule) => matchesRoutePrefix(pathname, rule.prefix)) ?? null;
}

function matchesRoutePrefix(pathname: string, prefix: string): boolean {
	return pathname === prefix || pathname.startsWith(`${prefix}/`);
}
