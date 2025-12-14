/**
 * Internal dependencies
 */
import { repeaterReducer } from '../';
import { addControl, resetRepeaterItem } from '../../actions';

describe('Reset Repeater Item', function () {
	it('should modified control state with reset repeater item', function () {
		let state = {};

		state = repeaterReducer(
			state,
			addControl({
				value: {
					0: { x: 10, y: 20 },
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			repeaterReducer(
				state,
				resetRepeaterItem({
					itemId: 0,
					defaultValue: { x: 0, y: 0 },
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					0: { x: 0, y: 0 },
				},
			},
		});
	});

	it('should preserve order when resetting item', function () {
		let state = {};

		state = repeaterReducer(
			state,
			addControl({
				value: {
					0: { x: 10, y: 20, order: 0 },
					1: { x: 30, y: 40, order: 1 },
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			repeaterReducer(
				state,
				resetRepeaterItem({
					itemId: 1,
					defaultValue: { x: 0, y: 0 },
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					0: { x: 10, y: 20, order: 0 },
					1: { x: 0, y: 0, order: 1 },
				},
			},
		});
	});

	it('reset item with simple repeaterId', function () {
		let state = {};

		state = repeaterReducer(
			state,
			addControl({
				value: {
					r: {
						0: { x: 10, y: 20 },
					},
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			repeaterReducer(
				state,
				resetRepeaterItem({
					itemId: 0,
					defaultValue: { x: 0, y: 0 },
					repeaterId: 'r',
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					r: {
						0: { x: 0, y: 0 },
					},
				},
			},
		});
	});

	it('reset item with query of state in repeaterId', function () {
		let state = {};

		state = repeaterReducer(
			state,
			addControl({
				value: {
					r: {
						x: {
							y: {
								z: {
									0: { x: 10, y: 20 },
									1: { x: 30, y: 40 },
								},
							},
						},
					},
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			repeaterReducer(
				state,
				resetRepeaterItem({
					itemId: 1,
					defaultValue: { x: 0, y: 0 },
					repeaterId: 'r.x.y.z',
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					r: {
						x: {
							y: {
								z: {
									0: { x: 10, y: 20 },
									1: { x: 0, y: 0 },
								},
							},
						},
					},
				},
			},
		});
	});

	it('reset item of repeater inside other repeater control', function () {
		let state = {};

		state = repeaterReducer(
			state,
			addControl({
				value: {
					r: [
						{
							y: {
								0: { x: 10, y: 20 },
							},
						},
					],
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			repeaterReducer(
				state,
				resetRepeaterItem({
					itemId: 0,
					defaultValue: { x: 0, y: 0 },
					repeaterId: 'r[0].y',
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					r: [
						{
							y: {
								0: { x: 0, y: 0 },
							},
						},
					],
				},
			},
		});
	});

	it('should not modify state if item is already at default value', function () {
		let state = {};

		state = repeaterReducer(
			state,
			addControl({
				value: {
					0: { x: 0, y: 0 },
				},
				name: 'TestRepeaterControl',
			})
		);

		const result = repeaterReducer(
			state,
			resetRepeaterItem({
				itemId: 0,
				defaultValue: { x: 0, y: 0 },
				controlId: 'TestRepeaterControl',
			})
		);

		expect(result).toEqual(state);
	});

	it('should preserve order when resetting item with repeaterId', function () {
		let state = {};

		state = repeaterReducer(
			state,
			addControl({
				value: {
					r: {
						0: { x: 10, y: 20, order: 0 },
						1: { x: 30, y: 40, order: 1 },
					},
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			repeaterReducer(
				state,
				resetRepeaterItem({
					itemId: 1,
					defaultValue: { x: 0, y: 0 },
					repeaterId: 'r',
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					r: {
						0: { x: 10, y: 20, order: 0 },
						1: { x: 0, y: 0, order: 1 },
					},
				},
			},
		});
	});
});
