/**
 * Internal dependencies
 */
import { controlReducer } from '../../control-reducer';
import {
	addControl,
	addRepeaterItem,
	sortRepeaterItem,
} from '../../../actions';

describe('Sort Repeater Item', function () {
	it('should modified control state with sort repeater items', function () {
		let state = {};

		state = controlReducer(
			state,
			addControl({
				value: [{ x: 10 }, { x: 12 }],
				name: 'TestRepeaterControl',
			})
		);

		expect(
			controlReducer(
				state,
				sortRepeaterItem({
					items: [{ x: 10 }, { x: 12 }],
					fromIndex: 0,
					toIndex: 1,
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: [{ x: 12 }, { x: 10 }],
			},
		});

		state = controlReducer(
			state,
			addRepeaterItem({
				value: { x: 15 },
				controlId: 'TestRepeaterControl',
			})
		);

		expect(
			controlReducer(
				state,
				sortRepeaterItem({
					items: [{ x: 10 }, { x: 12 }, { x: 15 }],
					fromIndex: 2,
					toIndex: 1,
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: [{ x: 10 }, { x: 15 }, { x: 12 }],
			},
		});
	});
});
