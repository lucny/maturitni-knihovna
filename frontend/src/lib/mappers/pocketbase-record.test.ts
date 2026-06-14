import { describe, expect, it } from 'vitest';

import {
	optionalNumber,
	optionalString,
	optionalStringArray,
	requiredBoolean,
	requiredString
} from './pocketbase-record';

describe('PocketBase record helpers', () => {
	it('reads optional strings only from non-empty string values', () => {
		expect(optionalString('text')).toBe('text');
		expect(optionalString('')).toBeUndefined();
		expect(optionalString(null)).toBeUndefined();
	});

	it('requires string values for mandatory fields', () => {
		expect(requiredString('book-1', 'id')).toBe('book-1');
		expect(() => requiredString(123, 'title')).toThrow(
			'PocketBase record field "title" must be a string.'
		);
	});

	it('normalizes primitive optional values', () => {
		expect(optionalNumber(1920)).toBe(1920);
		expect(optionalNumber('1920')).toBeUndefined();
		expect(requiredBoolean(true)).toBe(true);
		expect(requiredBoolean('true')).toBe(false);
	});

	it('accepts only string arrays', () => {
		expect(optionalStringArray(['a', 'b'])).toEqual(['a', 'b']);
		expect(optionalStringArray(['a', 1])).toEqual([]);
		expect(optionalStringArray('a')).toEqual([]);
	});
});
