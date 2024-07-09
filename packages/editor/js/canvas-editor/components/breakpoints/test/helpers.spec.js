/**
 * Internal dependencies
 */
import { isBaseBreakpoint } from '../helpers';
import { default as defaultBreakpoints } from '../../../../extensions/libs/block-states/default-breakpoints';

describe('Helper functions test', () => {
	describe('isBaseBreakpoint function', () => {
		it('desktop is base', () => {
			expect(isBaseBreakpoint('desktop')).toBe(true);
		});

		it('all breakpoints from default breakpoints', () => {
			Object.entries(defaultBreakpoints()).forEach(([itemId, item]) => {
				expect(isBaseBreakpoint(item.type)).toBe(item.force);
			});
		});
	});
});
