import { describe, expect, it, vi } from 'vitest';

import { createContentSlug } from './content-slug';

describe('createContentSlug', () => {
	it('normalizes Czech text to URL-safe slug', () => {
		expect(createContentSlug('  Čapkova Bílá nemoc!  ')).toBe('capkova-bila-nemoc');
	});

	it('limits slug length', () => {
		expect(createContentSlug('a'.repeat(250))).toHaveLength(190);
	});

	it('uses timestamp fallback for empty input', () => {
		vi.spyOn(Date, 'now').mockReturnValue(12345);

		expect(createContentSlug(' --- ')).toBe('obsah-12345');
	});
});
