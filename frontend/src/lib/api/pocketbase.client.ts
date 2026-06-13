import { browser } from '$app/environment';
import PocketBase from 'pocketbase';

import { publicPocketBaseUrl, resolvePocketBaseUrl } from './pocketbase.config';

let browserPocketBaseClient: PocketBase | undefined;

export function createPocketBaseClient(url = publicPocketBaseUrl): PocketBase {
	return new PocketBase(resolvePocketBaseUrl(url));
}

export function getBrowserPocketBaseClient(): PocketBase {
	if (!browser) {
		throw new Error('Browser PocketBase client cannot be created during server rendering.');
	}

	browserPocketBaseClient ??= createPocketBaseClient();

	return browserPocketBaseClient;
}
