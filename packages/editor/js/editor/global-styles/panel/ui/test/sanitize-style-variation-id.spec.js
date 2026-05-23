import { sanitizeStyleVariationId } from '../utils';

describe('sanitizeStyleVariationId', () => {
	it('preserves a trailing hyphen while editing', () => {
		expect(sanitizeStyleVariationId('style-')).toBe('style-');
	});

	it('keeps valid slugs unchanged', () => {
		expect(sanitizeStyleVariationId('style-1')).toBe('style-1');
		expect(sanitizeStyleVariationId('e2e-size-small')).toBe(
			'e2e-size-small'
		);
	});

	it('normalizes spaces and casing', () => {
		expect(sanitizeStyleVariationId('new id')).toBe('new-id');
		expect(sanitizeStyleVariationId('Style One')).toBe('style-one');
	});
});
