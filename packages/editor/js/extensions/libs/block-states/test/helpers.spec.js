/**
 * Internal dependencies
 */
import { getBreakpointInfo, getStateInfo } from '../helpers';

describe('Block States Helpers', () => {
	it('should retrieve state with getStateInfo(stateId)', () => {
		const pickedState = 0;

		expect(getStateInfo(pickedState)).toEqual({
			type: 'normal',
			label: 'Normal',
			breakpoints: {},
		});
	});

	it('should retrieve state with getStateInfo(stateName)', () => {
		expect(getStateInfo()).toEqual({
			type: 'hover',
			label: 'Hover',
			breakpoints: {},
		});
	});

	it('should retrieve breakpoint with getBreakpointInfo(breakpointId, parentState)', () => {
		expect(getBreakpointInfo('mobile')).toEqual({
			type: 'mobile',
			base: false,
			status: true,
			label: 'Mobile Portrait',
			settings: {
				min: '',
				max: '478px',
			},
			attributes: {},
		});
	});

	it('should retrieve breakpoint with getBreakpointInfo(breakpointName)', () => {
		expect(getBreakpointInfo('tablet')).toEqual({
			type: 'tablet',
			base: false,
			status: true,
			label: 'Tablet',
			settings: {
				min: '',
				max: '991px',
			},
			attributes: {},
		});
	});
});
