/**
 * Internal dependencies
 */
import { repeaterReducer } from '../';
import { addControl, addRepeaterItem, sortRepeaterItem } from '../../actions';

describe.skip('Sort Repeater Item', function () {
	it('should modified control state with sort repeater items', function () {
		let state = {};

		state = repeaterReducer(
			state,
			addControl({
				value: {
					0: { x: 10, order: 0 },
					1: { x: 12, order: 1 },
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			repeaterReducer(
				state,
				sortRepeaterItem({
					items: {
						0: { x: 10, order: 0 },
						1: { x: 12, order: 1 },
					},
					fromIndex: 0,
					toIndex: 1,
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					0: { x: 10, order: 1 },
					1: { x: 12, order: 0 },
				},
			},
		});
	});
});
