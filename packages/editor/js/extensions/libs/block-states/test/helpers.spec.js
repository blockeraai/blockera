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
		const pickedState = 'hover';

		expect(getStateInfo(pickedState)).toEqual({
			type: 'hover',
			label: 'Hover',
			breakpoints: {},
		});
	});

	it('should retrieve breakpoint with getBreakpointInfo(breakpointId, parentState)', () => {
		const parentState = 'hover';

		expect(getBreakpointInfo('mobile', parentState)).toEqual({
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

	it('should retrieve breakpoint with getBreakpointInfo(breakpointName, parentState)', () => {
		const parentState = 'hover';

		expect(getBreakpointInfo('tablet', parentState)).toEqual({
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
