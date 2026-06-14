import { redirect, type RequestHandler } from '@sveltejs/kit';

function getRedirectTarget(request: Request): string {
	const referer = request.headers.get('referer');

	if (!referer) {
		return '/';
	}

	try {
		const refererUrl = new URL(referer);

		return `${refererUrl.pathname}${refererUrl.search}`;
	} catch {
		return '/';
	}
}

export const POST: RequestHandler = ({ locals, request }) => {
	locals.pb.authStore.clear();

	throw redirect(303, getRedirectTarget(request));
};
