import type { RecordModel } from 'pocketbase';

export function optionalString(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function requiredString(value: unknown, fieldName: string): string {
	if (typeof value !== 'string') {
		throw new Error(`PocketBase record field "${fieldName}" must be a string.`);
	}

	return value;
}

export function optionalNumber(value: unknown): number | undefined {
	return typeof value === 'number' ? value : undefined;
}

export function requiredBoolean(value: unknown): boolean {
	return typeof value === 'boolean' ? value : false;
}

export function optionalStringArray(value: unknown): string[] {
	return Array.isArray(value) && value.every((item) => typeof item === 'string') ? value : [];
}

export type PocketBaseRecord<TFields extends Record<string, unknown>> = RecordModel & TFields;
