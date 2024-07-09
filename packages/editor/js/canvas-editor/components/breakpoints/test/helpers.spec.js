/**
 * Internal dependencies
 */
import {
	isBaseBreakpoint,
	getBaseBreakpoint,
	getSmallestBreakpoint,
} from '../helpers';
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

	describe('getBaseBreakpoint function', () => {
		it('desktop is base', () => {
			expect(getBaseBreakpoint()).toBe('desktop');
		});
	});

	describe('getSmallestBreakpoint function', () => {
		describe('default breakpoints', () => {
			it('mobile is smallest breakpoint', () => {
				expect(getSmallestBreakpoint()).toBe('mobile');
			});
		});

		describe('custom breakpoints', () => {
			it('mobile landscape is smallest breakpoint', () => {
				const breakpoints = defaultBreakpoints();

				delete breakpoints.mobile;

				expect(getSmallestBreakpoint(breakpoints)).toBe(
					'mobile-landscape'
				);
			});

			it('tablet is smallest breakpoint', () => {
				const breakpoints = defaultBreakpoints();

				delete breakpoints.mobile;
				delete breakpoints['mobile-landscape'];

				expect(getSmallestBreakpoint(breakpoints)).toBe('tablet');
			});

			it('l-desktop is smallest breakpoint', () => {
				const breakpoints = defaultBreakpoints();

				delete breakpoints.mobile;
				delete breakpoints['mobile-landscape'];
				delete breakpoints.tablet;

				expect(getSmallestBreakpoint(breakpoints)).toBe('l-desktop');
			});
		});
	});
});
