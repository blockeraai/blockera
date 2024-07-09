/**
 * Internal dependencies
 */
import {
	isBaseBreakpoint,
	getBaseBreakpoint,
	getSmallestBreakpoint,
	getLargestBreakpoint,
} from '../helpers';
import { default as defaultBreakpoints } from '../../../../extensions/libs/block-states/default-breakpoints';

describe('Helper functions test', () => {
	describe('isBaseBreakpoint function', () => {
		it('desktop is base', () => {
			expect(isBaseBreakpoint('desktop')).toBe(true);
		});

		it('all breakpoints from default breakpoints', () => {
			Object.entries(defaultBreakpoints()).forEach(([itemId, item]) => {
				expect(isBaseBreakpoint(item.type)).toBe(item.base);
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

	describe('getLargestBreakpoint function', () => {
		describe('default breakpoints', () => {
			it('2xl-desktop is largest breakpoint', () => {
				expect(getLargestBreakpoint()).toBe('2xl-desktop');
			});
		});

		describe('custom breakpoints', () => {
			it('xl-desktop is largest breakpoint', () => {
				const breakpoints = defaultBreakpoints();

				delete breakpoints['2xl-desktop'];

				expect(getLargestBreakpoint(breakpoints)).toBe('xl-desktop');
			});

			it('l-desktop is largest breakpoint', () => {
				const breakpoints = defaultBreakpoints();

				delete breakpoints['2xl-desktop'];
				delete breakpoints['xl-desktop'];

				expect(getLargestBreakpoint(breakpoints)).toBe('l-desktop');
			});

			it('tablet is largest breakpoint', () => {
				const breakpoints = defaultBreakpoints();

				delete breakpoints['2xl-desktop'];
				delete breakpoints['xl-desktop'];
				delete breakpoints['l-desktop'];

				expect(getLargestBreakpoint(breakpoints)).toBe('tablet');
			});
		});
	});
});
