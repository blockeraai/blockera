/**
 * Internal dependencies
 */
import { repeaterReducer } from '../index';

describe('Repeater Control Type', function () {
	it('should state equal with latest changes of state value when after dispatch invalid type of action for repeater items!', function () {
		const initialState = {};
		expect(
			repeaterReducer(initialState, {
				type: 'test',
			})
		).toEqual(initialState);
	});
});
