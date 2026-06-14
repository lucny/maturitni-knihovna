import { json } from '@sveltejs/kit';

import { serverPocketBaseUrl } from '$lib/server/api/pocketbase.server';

import packageJson from '../../../package.json';
import type { RequestHandler } from './$types';

const APP_NAME = 'maturitni-knihovna';
const POCKETBASE_HEALTH_TIMEOUT_MS = 1_500;

type HealthStatus = 'ok' | 'degraded';
type DependencyStatus = 'ok' | 'unavailable';

interface DependencyHealth {
	status: DependencyStatus;
	responseTimeMs: number;
}

interface HealthResponse {
	status: HealthStatus;
	timestamp: string;
	app: string;
	version: string;
	dependencies: {
		pocketbase: DependencyHealth;
	};
}

async function checkPocketBase(): Promise<DependencyHealth> {
	const startedAt = Date.now();
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), POCKETBASE_HEALTH_TIMEOUT_MS);

	try {
		const response = await fetch(`${serverPocketBaseUrl}/api/health`, {
			headers: {
				accept: 'application/json'
			},
			signal: controller.signal
		});

		return {
			status: response.ok ? 'ok' : 'unavailable',
			responseTimeMs: Date.now() - startedAt
		};
	} catch {
		return {
			status: 'unavailable',
			responseTimeMs: Date.now() - startedAt
		};
	} finally {
		clearTimeout(timeout);
	}
}

export const GET: RequestHandler = async () => {
	const pocketbase = await checkPocketBase();
	const status: HealthStatus = pocketbase.status === 'ok' ? 'ok' : 'degraded';
	const response: HealthResponse = {
		status,
		timestamp: new Date().toISOString(),
		app: APP_NAME,
		version: packageJson.version,
		dependencies: {
			pocketbase
		}
	};

	return json(response, {
		status: status === 'ok' ? 200 : 503,
		headers: {
			'cache-control': 'no-store'
		}
	});
};
