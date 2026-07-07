/**
 * Internal dependencies
 */
import { iconSearch, prepareIconSearchQuery } from '../icon-search';

describe('icon search', () => {
	describe('prepareIconSearchQuery', () => {
		it('trims whitespace', () => {
			expect(prepareIconSearchQuery('  fli v  ')).toBe('fli v');
		});

		it('escapes extended-search operators', () => {
			expect(prepareIconSearchQuery('flip | vertical')).toBe(
				'flip \\| vertical'
			);
		});

		it('returns empty string for blank input', () => {
			expect(prepareIconSearchQuery('   ')).toBe('');
		});
	});

	describe('iconSearch', () => {
		it('matches multi-word partial queries (fli v → flip vertical)', () => {
			const results = iconSearch({
				query: 'fli v',
				library: 'all',
			});

			expect(results['flip-vertical']).toBeDefined();
		});

		it('matches single partial terms (col → color-related icons)', () => {
			const results = iconSearch({
				query: 'col',
				library: 'all',
			});

			expect(
				results.color || results.columns || results['col-resize']
			).toBeDefined();
		});
	});
});
