/**
 * Internal dependencies
 */
import { getBreakpointInfo, getStateInfo } from '../helpers';
import { default as defaultBreakpoints } from '../default-breakpoints';

describe('Default breakpoints settings', () => {
	describe('Base breakpoint', () => {
		it('base breakpoint is desktop', () => {
			expect(defaultBreakpoints()['desktop'].base).toBe(true);
		});

		it('base breakpoint should not have min and max', () => {
			expect(defaultBreakpoints()['desktop'].settings.min).toBe('');
			expect(defaultBreakpoints()['desktop'].settings.max).toBe('');
		});
	});
});
