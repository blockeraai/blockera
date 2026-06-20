/**
 * Internal dependencies
 */
import {
	normalizeVariablePickerSearchQuery,
	tokenizeVariablePickerSearchQuery,
	buildVariablePickerSearchHaystack,
	variablePickerItemMatchesSearch,
} from '../var-picker-helpers';

describe('variable picker search helpers', () => {
	const hierarchicalColorItem = {
		name: 'Base / Primary / On Brand',
		label: 'Base / Primary / On Brand',
		slug: 'e-2-e-search-on-brand',
		id: 'e-2-e-search-on-brand',
		value: '#aabbcc',
	};

	const accentColorItem = {
		name: 'Accent / Secondary Tone',
		slug: 'e-2-e-search-accent',
		id: 'e-2-e-search-accent',
		value: '#112233',
	};

	const fontSizeItem = {
		name: 'Base / Small',
		slug: 'small',
		id: 'small',
		value: '0.875rem',
	};

	describe('normalizeVariablePickerSearchQuery', () => {
		it('returns empty string for nullish input', () => {
			expect(normalizeVariablePickerSearchQuery(null)).toBe('');
			expect(normalizeVariablePickerSearchQuery(undefined)).toBe('');
		});

		it('trims and lowercases', () => {
			expect(normalizeVariablePickerSearchQuery('  Bas Bran  ')).toBe(
				'bas bran'
			);
		});
	});

	describe('tokenizeVariablePickerSearchQuery', () => {
		it('splits on whitespace', () => {
			expect(tokenizeVariablePickerSearchQuery('bas bran')).toEqual([
				'bas',
				'bran',
			]);
		});

		it('returns empty array for empty normalized query', () => {
			expect(tokenizeVariablePickerSearchQuery('')).toEqual([]);
		});
	});

	describe('buildVariablePickerSearchHaystack', () => {
		it('includes scalar value fields', () => {
			expect(
				buildVariablePickerSearchHaystack(hierarchicalColorItem)
			).toBe(
				'base / primary / on brand e-2-e-search-on-brand base / primary / on brand e-2-e-search-on-brand #aabbcc'
			);
		});
	});

	describe('variablePickerItemMatchesSearch', () => {
		it('matches all items when query is empty', () => {
			expect(
				variablePickerItemMatchesSearch(hierarchicalColorItem, '')
			).toBe(true);
		});

		it('matches single-token name substring (regression)', () => {
			expect(
				variablePickerItemMatchesSearch(
					hierarchicalColorItem,
					normalizeVariablePickerSearchQuery('primary')
				)
			).toBe(true);
		});

		it('matches multi-token AND queries on hierarchical names', () => {
			expect(
				variablePickerItemMatchesSearch(
					hierarchicalColorItem,
					normalizeVariablePickerSearchQuery('bas bran')
				)
			).toBe(true);
			expect(
				variablePickerItemMatchesSearch(
					hierarchicalColorItem,
					normalizeVariablePickerSearchQuery('bas pri')
				)
			).toBe(true);
		});

		it('rejects multi-token queries when one token is missing', () => {
			expect(
				variablePickerItemMatchesSearch(
					hierarchicalColorItem,
					normalizeVariablePickerSearchQuery('bas xyz')
				)
			).toBe(false);
		});

		it('matches CSS value fragments via value field', () => {
			expect(
				variablePickerItemMatchesSearch(
					hierarchicalColorItem,
					normalizeVariablePickerSearchQuery('aabb')
				)
			).toBe(true);
			expect(
				variablePickerItemMatchesSearch(
					fontSizeItem,
					normalizeVariablePickerSearchQuery('0.875')
				)
			).toBe(true);
		});

		it('matches color preset hex via color field', () => {
			expect(
				variablePickerItemMatchesSearch(
					{
						name: 'Brand',
						slug: 'brand',
						id: 'brand',
						color: '#aabbcc',
					},
					normalizeVariablePickerSearchQuery('aabb')
				)
			).toBe(true);
		});

		it('matches slug and id fields', () => {
			expect(
				variablePickerItemMatchesSearch(
					accentColorItem,
					normalizeVariablePickerSearchQuery('e-2-e-search-accent')
				)
			).toBe(true);
		});

		it('matches block-style variation item shape used by variations picker', () => {
			const blockStyleSearchItem = {
				name: 'Base / Primary / On Brand',
				label: 'Base / Primary / On Brand',
				slug: 'base-primary-on-brand',
				id: 'base-primary-on-brand',
			};

			expect(
				variablePickerItemMatchesSearch(
					blockStyleSearchItem,
					normalizeVariablePickerSearchQuery('bas bran')
				)
			).toBe(true);
			expect(
				variablePickerItemMatchesSearch(
					blockStyleSearchItem,
					normalizeVariablePickerSearchQuery('bas xyz')
				)
			).toBe(false);
		});
	});
});
