import type { Handle } from '@sveltejs/kit';

import { mapAuthRecord } from '$lib/server/auth/pocketbase-auth';
import { createServerPocketBaseClient } from '$lib/server/api/pocketbase.server';

function createAuthCookieOptions(url: URL): {
	httpOnly: boolean;
	path: string;
	sameSite: string;
	secure: boolean;
} {
	return {
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secure: url.protocol === 'https:'
	};
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = createServerPocketBaseClient();
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') ?? '');

	try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
		}
	} catch {
		event.locals.pb.authStore.clear();
	}

	event.locals.user = mapAuthRecord(event.locals.pb.authStore.record);

	const response = await resolve(event);

	response.headers.append(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie(createAuthCookieOptions(event.url))
	);

	return response;
};
