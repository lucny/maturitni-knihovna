import { env } from '$env/dynamic/private';
import PocketBase from 'pocketbase';

import { publicPocketBaseUrl, resolvePocketBaseUrl } from '$lib/api/pocketbase.config';

export const serverPocketBaseUrl = resolvePocketBaseUrl(env.POCKETBASE_URL || publicPocketBaseUrl);

export function createServerPocketBaseClient(url = serverPocketBaseUrl): PocketBase {
	return new PocketBase(resolvePocketBaseUrl(url));
}
