import type { AuthProviderInfo, RecordModel } from 'pocketbase';

import type { AuthUser, UserAuthRecord } from '$lib/auth/user';

export const AUTH_COLLECTION = 'users';
export const MICROSOFT_AUTH_PROVIDER = 'microsoft';
export const OAUTH_PROVIDER_COOKIE = 'mk_oauth_provider';
export const OAUTH_PROVIDER_COOKIE_MAX_AGE = 10 * 60;

export type OAuthProviderCookie = {
	provider: string;
	state: string;
	codeVerifier: string;
	redirectUrl: string;
};

export function mapAuthRecord(record: RecordModel | null): AuthUser | null {
	if (!record) {
		return null;
	}

	const userRecord = record as UserAuthRecord;

	return {
		id: userRecord.id,
		email: userRecord.email,
		name: userRecord.name,
		surname: userRecord.surname,
		avatar: userRecord.avatar,
		role: userRecord.role,
		provider: userRecord.provider,
		active: userRecord.active
	};
}

export function createOAuthRedirectUrl(url: URL): string {
	return `${url.origin}/auth/callback/microsoft`;
}

export function createProviderAuthorizationUrl(
	provider: AuthProviderInfo,
	redirectUrl: string
): string {
	const authUrl = new URL(provider.authURL);

	authUrl.searchParams.set('redirect_uri', redirectUrl);

	return authUrl.toString();
}

export function serializeOAuthProviderCookie(data: OAuthProviderCookie): string {
	return JSON.stringify(data);
}

export function parseOAuthProviderCookie(value: string | undefined): OAuthProviderCookie | null {
	if (!value) {
		return null;
	}

	try {
		const parsedValue: unknown = JSON.parse(value);

		if (!isOAuthProviderCookie(parsedValue)) {
			return null;
		}

		return parsedValue;
	} catch {
		return null;
	}
}

function isOAuthProviderCookie(value: unknown): value is OAuthProviderCookie {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const candidate = value as Record<string, unknown>;

	return (
		typeof candidate.provider === 'string' &&
		typeof candidate.state === 'string' &&
		typeof candidate.codeVerifier === 'string' &&
		typeof candidate.redirectUrl === 'string'
	);
}
