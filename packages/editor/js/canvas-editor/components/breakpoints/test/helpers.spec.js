/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	isBaseBreakpoint,
	getBaseBreakpoint,
	getSmallestBreakpoint,
	getLargestBreakpoint,
	getBreakpointLongDescription,
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
			it('mobile-landscape is smallest breakpoint', () => {
				const breakpoints = defaultBreakpoints();

				breakpoints.mobile.status = false;
				breakpoints['mobile-landscape'].status = true;

				expect(getSmallestBreakpoint(breakpoints)).toBe(
					'mobile-landscape'
				);
			});

			it('tablet is smallest breakpoint', () => {
				const breakpoints = defaultBreakpoints();

				breakpoints.mobile.status = false;
				breakpoints['mobile-landscape'].status = false;

				expect(getSmallestBreakpoint(breakpoints)).toBe('tablet');
			});

			it('l-desktop is smallest breakpoint', () => {
				const breakpoints = defaultBreakpoints();

				breakpoints.mobile.status = false;
				breakpoints['mobile-landscape'].status = false;
				breakpoints.tablet.status = false;
				breakpoints['l-desktop'].status = true;

				expect(getSmallestBreakpoint(breakpoints)).toBe('l-desktop');
			});
		});
	});

	describe('getLargestBreakpoint function', () => {
		describe('default breakpoints', () => {
			it('2xl-desktop is largest breakpoint', () => {
				const breakpoints = defaultBreakpoints();

				breakpoints['2xl-desktop'].status = true;
				breakpoints['xl-desktop'].status = true;
				breakpoints['l-desktop'].status = true;

				expect(getLargestBreakpoint(breakpoints)).toBe('2xl-desktop');
			});
		});

		describe('custom breakpoints', () => {
			it('xl-desktop is largest breakpoint', () => {
				const breakpoints = defaultBreakpoints();

				breakpoints['2xl-desktop'].status = false;
				breakpoints['xl-desktop'].status = true;
				breakpoints['l-desktop'].status = true;

				expect(getLargestBreakpoint(breakpoints)).toBe('xl-desktop');
			});

			it('l-desktop is largest breakpoint', () => {
				const breakpoints = defaultBreakpoints();

				breakpoints['2xl-desktop'].status = false;
				breakpoints['xl-desktop'].status = false;
				breakpoints['l-desktop'].status = true;

				expect(getLargestBreakpoint(breakpoints)).toBe('l-desktop');
			});

			it('tablet is largest breakpoint', () => {
				const breakpoints = defaultBreakpoints();

				breakpoints['2xl-desktop'].status = false;
				breakpoints['xl-desktop'].status = false;
				breakpoints['l-desktop'].status = false;

				expect(getLargestBreakpoint(breakpoints)).toBe('tablet');
			});
		});
	});

	describe('getBreakpointLongDescription function', () => {
		describe('2xl-desktop breakpoint', () => {
			it('is largest breakpoint', () => {
				const breakpoints = defaultBreakpoints();

				breakpoints['2xl-desktop'].status = true;
				breakpoints['xl-desktop'].status = true;
				breakpoints['l-desktop'].status = true;

				expect(
					getBreakpointLongDescription('2xl-desktop', breakpoints)
				).toBe(
					sprintf(
						// translators: %s is breakpoint min-width value
						__(
							'Styles added here will apply at %s and up.',
							'blockera'
						),
						breakpoints['2xl-desktop'].settings.min
					)
				);
			});

			it('2xl-desktop is not largest breakpoint', () => {
				const breakpoints = defaultBreakpoints();

				breakpoints['2xl-desktop'].status = true;
				breakpoints['xl-desktop'].status = true;
				breakpoints['xl-desktop'].settings.min = '10000px';
				breakpoints['l-desktop'].status = true;

				expect(
					getBreakpointLongDescription('2xl-desktop', breakpoints)
				).toBe(
					sprintf(
						// translators: %s is breakpoint min-width value
						__(
							'Styles added here will apply at %s and up, unless they are edited at a larger breakpoint.',
							'blockera'
						),
						breakpoints['2xl-desktop'].settings.min
					)
				);

				expect(
					getBreakpointLongDescription('xl-desktop', breakpoints)
				).toBe(
					sprintf(
						// translators: %s is breakpoint min-width value
						__(
							'Styles added here will apply at %s and up.',
							'blockera'
						),
						breakpoints['xl-desktop'].settings.min
					)
				);
			});
		});

		describe('xl-desktop breakpoint', () => {
			it('xl-desktop is largest breakpoint', () => {
				const breakpoints = defaultBreakpoints();
				breakpoints['2xl-desktop'].status = false;
				breakpoints['xl-desktop'].status = true;
				breakpoints['l-desktop'].status = true;

				expect(
					getBreakpointLongDescription('xl-desktop', breakpoints)
				).toBe(
					sprintf(
						// translators: %s is breakpoint min-width value
						__(
							'Styles added here will apply at %s and up.',
							'blockera'
						),
						breakpoints['xl-desktop'].settings.min
					)
				);
			});

			it('is not largest breakpoint', () => {
				const breakpoints = defaultBreakpoints();
				breakpoints['2xl-desktop'].status = true;
				breakpoints['xl-desktop'].status = true;

				expect(
					getBreakpointLongDescription('xl-desktop', breakpoints)
				).toBe(
					sprintf(
						// translators: %s is breakpoint min-width value
						__(
							'Styles added here will apply at %s and up, unless they are edited at a larger breakpoint.',
							'blockera'
						),
						breakpoints['xl-desktop'].settings.min
					)
				);
			});
		});

		describe('xl-desktop breakpoint (customized to have both min and max)', () => {
			it('have min and max', () => {
				const breakpoints = defaultBreakpoints();
				breakpoints['2xl-desktop'].status = true;
				breakpoints['xl-desktop'].status = true;
				breakpoints['xl-desktop'].settings.min = '1440px';
				breakpoints['xl-desktop'].settings.max = '1600px';
				breakpoints['l-desktop'].status = true;

				expect(
					getBreakpointLongDescription('xl-desktop', breakpoints)
				).toBe(
					sprintf(
						// translators: %1$s and %2$s are breakpoint min-width and max-width values
						__(
							'Styles added here will apply from %1$s to %2$s.',
							'blockera'
						),
						breakpoints['xl-desktop'].settings.min,
						breakpoints['xl-desktop'].settings.max
					)
				);
			});
		});

		it('desktop (base breakpoint)', () => {
			const breakpoints = defaultBreakpoints();

			expect(getBreakpointLongDescription('desktop')).toBe(
				sprintf(
					// translators: it's the aria label for repeater item
					__(
						"%s styles apply at all breakpoints, unless they're edited at a larger or smaller breakpoint.",
						'blockera'
					),
					breakpoints['desktop'].label
				)
			);
		});

		describe('tablet breakpoint', () => {
			it('tablet is smallest breakpoint', () => {
				const breakpoints = defaultBreakpoints();
				breakpoints['mobile'].status = false;
				breakpoints['mobile-landscape'].status = false;

				expect(
					getBreakpointLongDescription('tablet', breakpoints)
				).toBe(
					sprintf(
						// translators: %s is breakpoint max-width value
						__(
							'Styles added here will apply at %s and down.',
							'blockera'
						),
						breakpoints['tablet'].settings.max
					)
				);
			});

			it('is not smallest breakpoint', () => {
				const breakpoints = defaultBreakpoints();
				breakpoints['mobile'].status = true;
				breakpoints['mobile-landscape'].status = true;

				expect(
					getBreakpointLongDescription('tablet', breakpoints)
				).toBe(
					sprintf(
						// translators: %s is breakpoint max-width value
						__(
							'Styles added here will apply at %s and down, unless they are edited at a smaller breakpoint.',
							'blockera'
						),
						breakpoints['tablet'].settings.max
					)
				);
			});
		});

		describe('mobile-landscape breakpoint', () => {
			it('mobile-landscape is smallest breakpoint', () => {
				const breakpoints = defaultBreakpoints();
				breakpoints['mobile'].status = false;
				breakpoints['mobile-landscape'].status = true;

				expect(
					getBreakpointLongDescription(
						'mobile-landscape',
						breakpoints
					)
				).toBe(
					sprintf(
						// translators: %s is breakpoint max-width value
						__(
							'Styles added here will apply at %s and down.',
							'blockera'
						),
						breakpoints['mobile-landscape'].settings.max
					)
				);
			});

			it('is not smallest breakpoint', () => {
				const breakpoints = defaultBreakpoints();
				breakpoints['mobile'].status = true;
				breakpoints['mobile-landscape'].status = true;

				expect(
					getBreakpointLongDescription(
						'mobile-landscape',
						breakpoints
					)
				).toBe(
					sprintf(
						// translators: %s is breakpoint max-width value
						__(
							'Styles added here will apply at %s and down, unless they are edited at a smaller breakpoint.',
							'blockera'
						),
						breakpoints['mobile-landscape'].settings.max
					)
				);
			});
		});

		describe('mobile breakpoint', () => {
			it('mobile is smallest breakpoint', () => {
				const breakpoints = defaultBreakpoints();
				breakpoints['mobile'].status = true;
				breakpoints['mobile-landscape'].status = true;

				expect(
					getBreakpointLongDescription('mobile', breakpoints)
				).toBe(
					sprintf(
						// translators: %s is breakpoint max-width value
						__(
							'Styles added here will apply at %s and down.',
							'blockera'
						),
						breakpoints['mobile'].settings.max
					)
				);
			});

			it('is not smallest breakpoint', () => {
				const breakpoints = defaultBreakpoints();
				breakpoints['mobile'].status = true;
				breakpoints['mobile-landscape'].status = true;
				breakpoints['mobile-landscape'].settings.max = '100px';

				expect(
					getBreakpointLongDescription('mobile', breakpoints)
				).toBe(
					sprintf(
						// translators: %s is breakpoint max-width value
						__(
							'Styles added here will apply at %s and down, unless they are edited at a smaller breakpoint.',
							'blockera'
						),
						breakpoints['mobile'].settings.max
					)
				);
			});
		});
	});
});
