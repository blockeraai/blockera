/**
 * Internal dependencies
 */
import { expandFlatBorderWidthToSides } from '../compatibilities/border';

describe('expandFlatBorderWidthToSides', () => {
	describe('returns null (keep type "all" path)', () => {
		test('non-string input', () => {
			expect(
				expandFlatBorderWidthToSides(/** @type {any} */ (undefined))
			).toBeNull();
			expect(
				expandFlatBorderWidthToSides(/** @type {any} */ (null))
			).toBeNull();
			expect(
				expandFlatBorderWidthToSides(/** @type {any} */ (2))
			).toBeNull();
			expect(
				expandFlatBorderWidthToSides(/** @type {any} */ ({}))
			).toBeNull();
		});

		test('empty or whitespace-only', () => {
			expect(expandFlatBorderWidthToSides('')).toBeNull();
			expect(expandFlatBorderWidthToSides('   ')).toBeNull();
			expect(expandFlatBorderWidthToSides('\t\n')).toBeNull();
		});

		test('single CSS length or keyword (uniform width, not shorthand)', () => {
			expect(expandFlatBorderWidthToSides('2px')).toBeNull();
			expect(expandFlatBorderWidthToSides('thin')).toBeNull();
			expect(expandFlatBorderWidthToSides('0')).toBeNull();
		});

		test('values containing "(" — calc, var, min, rgb(), etc.', () => {
			expect(expandFlatBorderWidthToSides('calc(1px + 2px)')).toBeNull();
			expect(
				expandFlatBorderWidthToSides('var(--border-width)')
			).toBeNull();
			expect(expandFlatBorderWidthToSides('max(1px, 2px)')).toBeNull();
			expect(expandFlatBorderWidthToSides('1px rgb(0,0,0)')).toBeNull();
		});

		test('more than four tokens (invalid / unsupported shorthand)', () => {
			expect(
				expandFlatBorderWidthToSides('1px 2px 3px 4px 5px')
			).toBeNull();
		});
	});

	describe('two-value shorthand (vertical | horizontal)', () => {
		test('numeric lengths', () => {
			expect(expandFlatBorderWidthToSides('1px 2px')).toEqual({
				top: '1px',
				right: '2px',
				bottom: '1px',
				left: '2px',
			});
		});

		test('bare 0 normalizes to 0px', () => {
			expect(expandFlatBorderWidthToSides('0 2px')).toEqual({
				top: '0px',
				right: '2px',
				bottom: '0px',
				left: '2px',
			});
			expect(expandFlatBorderWidthToSides('1px 0')).toEqual({
				top: '1px',
				right: '0px',
				bottom: '1px',
				left: '0px',
			});
		});

		test('keywords', () => {
			expect(expandFlatBorderWidthToSides('thin medium')).toEqual({
				top: 'thin',
				right: 'medium',
				bottom: 'thin',
				left: 'medium',
			});
		});
	});

	describe('three-value shorthand (top | horizontal | bottom)', () => {
		test('standard pattern', () => {
			expect(expandFlatBorderWidthToSides('1px 2px 3px')).toEqual({
				top: '1px',
				right: '2px',
				bottom: '3px',
				left: '2px',
			});
		});

		test('bare 0 in middle slot becomes 0px on both horizontal sides', () => {
			expect(expandFlatBorderWidthToSides('1px 0 3px')).toEqual({
				top: '1px',
				right: '0px',
				bottom: '3px',
				left: '0px',
			});
		});
	});

	describe('four-value shorthand (top | right | bottom | left)', () => {
		test('WordPress-style left border only', () => {
			expect(expandFlatBorderWidthToSides('0 0 0 2px')).toEqual({
				top: '0px',
				right: '0px',
				bottom: '0px',
				left: '2px',
			});
		});

		test('all distinct sides', () => {
			expect(expandFlatBorderWidthToSides('1px 2px 3px 4px')).toEqual({
				top: '1px',
				right: '2px',
				bottom: '3px',
				left: '4px',
			});
		});
	});

	describe('normalization', () => {
		test('0px and other zero lengths are not double-normalized', () => {
			expect(expandFlatBorderWidthToSides('0px 1px')).toEqual({
				top: '0px',
				right: '1px',
				bottom: '0px',
				left: '1px',
			});
			expect(expandFlatBorderWidthToSides('0em 1px')).toEqual({
				top: '0em',
				right: '1px',
				bottom: '0em',
				left: '1px',
			});
		});

		test('trims leading and trailing whitespace', () => {
			expect(expandFlatBorderWidthToSides('  0 0 0 2px  ')).toEqual({
				top: '0px',
				right: '0px',
				bottom: '0px',
				left: '2px',
			});
		});

		test('collapses multiple internal spaces', () => {
			expect(expandFlatBorderWidthToSides('0   0   0   2px')).toEqual({
				top: '0px',
				right: '0px',
				bottom: '0px',
				left: '2px',
			});
		});
	});
});
