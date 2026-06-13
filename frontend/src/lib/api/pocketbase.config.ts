import { env } from '$env/dynamic/public';

export const DEFAULT_POCKETBASE_URL = 'http://127.0.0.1:8090';

export function resolvePocketBaseUrl(url: string | undefined): string {
	const resolvedUrl = url?.trim() || DEFAULT_POCKETBASE_URL;

	return resolvedUrl.replace(/\/+$/, '');
}

export const publicPocketBaseUrl = resolvePocketBaseUrl(env.PUBLIC_POCKETBASE_URL);
