import { fail, redirect } from '@sveltejs/kit';

import { publicPocketBaseUrl } from '$lib/api/pocketbase.config';
import {
	AUTH_COLLECTION,
	createOAuthRedirectUrl,
	createProviderAuthorizationUrl,
	MICROSOFT_AUTH_PROVIDER,
	OAUTH_PROVIDER_COOKIE,
	OAUTH_PROVIDER_COOKIE_MAX_AGE,
	serializeOAuthProviderCookie
} from '$lib/server/auth/pocketbase-auth';

import type { Actions, PageServerLoad } from './$types';

type LoginPageData = {
	pocketBaseAdminUrl: string;
	errorMessage?: string;
};

function createOAuthCookieOptions(url: URL) {
	return {
		httpOnly: true,
		maxAge: OAUTH_PROVIDER_COOKIE_MAX_AGE,
		path: '/',
		sameSite: 'lax' as const,
		secure: url.protocol === 'https:'
	};
}

export const load: PageServerLoad = ({ locals, url }): LoginPageData => {
	if (locals.user) {
		throw redirect(303, '/');
	}

	return {
		pocketBaseAdminUrl: `${publicPocketBaseUrl}/_/`,
		errorMessage:
			url.searchParams.get('error') === 'oauth'
				? 'Prihlaseni pres Microsoft 365 se nepodarilo dokoncit.'
				: undefined
	};
};

export const actions: Actions = {
	microsoft: async ({ cookies, locals, url }) => {
		const authMethods = await locals.pb.collection(AUTH_COLLECTION).listAuthMethods();
		const provider = authMethods.oauth2.providers.find(
			(candidateProvider) => candidateProvider.name === MICROSOFT_AUTH_PROVIDER
		);

		if (!provider) {
			return fail(503, {
				message: 'Microsoft 365 prihlaseni neni v PocketBase nakonfigurovane.'
			});
		}

		const redirectUrl = createOAuthRedirectUrl(url);

		cookies.set(
			OAUTH_PROVIDER_COOKIE,
			serializeOAuthProviderCookie({
				provider: provider.name,
				state: provider.state,
				codeVerifier: provider.codeVerifier,
				redirectUrl
			}),
			createOAuthCookieOptions(url)
		);

		throw redirect(303, createProviderAuthorizationUrl(provider, redirectUrl));
	}
};
