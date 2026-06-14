import { redirect, type RequestHandler } from '@sveltejs/kit';

import {
	AUTH_COLLECTION,
	MICROSOFT_AUTH_PROVIDER,
	OAUTH_PROVIDER_COOKIE,
	parseOAuthProviderCookie
} from '$lib/server/auth/pocketbase-auth';

function createExpiredOAuthCookieOptions(url: URL) {
	return {
		httpOnly: true,
		maxAge: 0,
		path: '/',
		sameSite: 'lax' as const,
		secure: url.protocol === 'https:'
	};
}

export const GET: RequestHandler = async ({ cookies, locals, url }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const providerCookie = parseOAuthProviderCookie(cookies.get(OAUTH_PROVIDER_COOKIE));

	cookies.delete(OAUTH_PROVIDER_COOKIE, createExpiredOAuthCookieOptions(url));

	if (
		!code ||
		!state ||
		!providerCookie ||
		providerCookie.provider !== MICROSOFT_AUTH_PROVIDER ||
		providerCookie.state !== state
	) {
		throw redirect(303, '/login?error=oauth');
	}

	try {
		await locals.pb
			.collection(AUTH_COLLECTION)
			.authWithOAuth2Code(
				providerCookie.provider,
				code,
				providerCookie.codeVerifier,
				providerCookie.redirectUrl,
				{
					name: 'Microsoft 365',
					surname: 'Uzivatel',
					role: 'student',
					provider: 'microsoft',
					active: true
				}
			);
	} catch {
		locals.pb.authStore.clear();
		throw redirect(303, '/login?error=oauth');
	}

	throw redirect(303, '/');
};
