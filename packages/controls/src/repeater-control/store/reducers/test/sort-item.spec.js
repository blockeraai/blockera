/**
 * Internal dependencies
 */
import { repeaterReducer } from '../';
import { addControl } from '../../../../store/actions';
import { addRepeaterItem, sortRepeaterItem } from '../../actions';

describe('Sort Repeater Item', function () {
	it('should modified control state with sort repeater items', function () {
		let state = {};

		state = repeaterReducer(
			state,
			addControl({
				value: [{ x: 10 }, { x: 12 }],
				name: 'TestRepeaterControl',
			})
		);

		expect(
			repeaterReducer(
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

		state = repeaterReducer(
			state,
			addRepeaterItem({
				value: { x: 15 },
				controlId: 'TestRepeaterControl',
			})
		);

		expect(
			repeaterReducer(
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

		state = repeaterReducer(
			state,
			addControl({
				value: {
					x: {
						y: {
							'example-prop': [{ x: 10 }, { x: 12 }, { x: 15 }],
						},
					},
				},
				name: 'TestRepeaterControl2',
			})
		);

		expect(
			repeaterReducer(
				state,
				sortRepeaterItem({
					items: [{ x: 10 }, { x: 12 }, { x: 15 }],
					fromIndex: 2,
					toIndex: 1,
					controlId: 'TestRepeaterControl2',
					repeaterId: 'x.y[example-prop]',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: [{ x: 10 }, { x: 12 }, { x: 15 }],
			},
			TestRepeaterControl2: {
				value: {
					x: {
						y: {
							'example-prop': [{ x: 10 }, { x: 15 }, { x: 12 }],
						},
					},
				},
				name: 'TestRepeaterControl2',
			},
		});

		state = repeaterReducer(
			state,
			addControl({
				value: {
					REPEATER: [{ x: [1, 2, 3] }],
				},
				name: 'TestRepeaterControl3',
			})
		);

		expect(
			repeaterReducer(
				state,
				sortRepeaterItem({
					items: [
						{ x: [1, 2, 3] },
						{ x: [4, 5, 6] },
						{ x: [7, 8, 9] },
					],
					fromIndex: 2,
					toIndex: 1,
					controlId: 'TestRepeaterControl3',
					repeaterId: 'REPEATER',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: [{ x: 10 }, { x: 12 }, { x: 15 }],
			},
			TestRepeaterControl2: {
				value: {
					x: {
						y: {
							'example-prop': [{ x: 10 }, { x: 15 }, { x: 12 }],
						},
					},
				},
				name: 'TestRepeaterControl2',
			},
			TestRepeaterControl3: {
				value: {
					REPEATER: [
						{ x: [1, 2, 3] },
						{ x: [7, 8, 9] },
						{ x: [4, 5, 6] },
					],
				},
				name: 'TestRepeaterControl3',
			},
		});
	});
	it('should not sort items of invalid state structure', function () {
		const initialState = {};
		expect(
			repeaterReducer(initialState, {
				type: 'SORT_REPEATER_ITEM',
			})
		).toEqual(initialState);
	});
});
