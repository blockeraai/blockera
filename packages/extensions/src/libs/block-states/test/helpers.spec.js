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
			breakpoints: [],
		});
	});

	it('should retrieve state with getStateInfo(stateName)', () => {
		const pickedState = 'hover';

		expect(getStateInfo(pickedState)).toEqual({
			type: 'hover',
			label: 'Hover',
			breakpoints: [],
		});
	});

	it('should retrieve breakpoint with getBreakpointInfo(breakpointId, parentState)', () => {
		const parentState = 'hover';

		expect(getBreakpointInfo('mobile', parentState)).toEqual({
			type: 'mobile',
			force: false,
			label: 'Mobile',
			settings: {
				min: '412px',
				max: '915px',
			},
			attributes: {},
		});
	});

	it('should retrieve breakpoint with getBreakpointInfo(breakpointName, parentState)', () => {
		const parentState = 'hover';

		expect(getBreakpointInfo('tablet', parentState)).toEqual({
			type: 'tablet',
			force: false,
			label: 'Tablet',
			settings: {
				min: '810px',
				max: '1080px',
			},
			attributes: {},
		});
	});
});
