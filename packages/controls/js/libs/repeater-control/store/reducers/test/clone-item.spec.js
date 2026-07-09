/**
 * Internal dependencies
 */
import { repeaterReducer } from '../';
import { addControl, cloneRepeaterItem } from '../../actions';

describe('Clone Repeater Item', function () {
	it('should modified control state with clone repeater item', function () {
		let state = {};

		state = repeaterReducer(
			state,
			addControl({
				value: {
					0: { x: 10 },
					1: { x: 12 },
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			repeaterReducer(
				state,
				cloneRepeaterItem({
					itemId: 1,
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					0: { x: 10 },
					1: { x: 12 },
					2: { x: 12, order: 1 },
				},
			},
		});
	});
	it('should modified control state with clone repeater item by repeaterId as `query`', function () {
		let state = {};

		state = repeaterReducer(
			state,
			addControl({
				value: {
					x: {
						0: { x: 10, order: 0 },
						1: { x: 12, order: 1 },
					},
				},
				name: 'TestRepeaterControl',
			})
		);

		state = repeaterReducer(
			state,
			cloneRepeaterItem({
				itemId: 1,
				repeaterId: 'x',
				value: { x: 12, order: 1 },
				controlId: 'TestRepeaterControl',
			})
		);

		expect(state).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					x: {
						0: { x: 10, order: 0 },
						1: { x: 12, order: 1 },
						2: { x: 12, order: 2 },
					},
				},
			},
		});

		state = repeaterReducer(
			state,
			addControl({
				value: {
					x: [
						{
							y: [
								{
									z: {
										0: { x: 10, order: 0 },
										1: { x: 12, order: 1 },
									},
								},
							],
						},
					],
				},
				name: 'TestRepeaterControl1',
			})
		);

		state = repeaterReducer(
			state,
			cloneRepeaterItem({
				itemId: 1,
				value: { x: 12, order: 1 },
				repeaterId: 'x[0].y[0].z',
				controlId: 'TestRepeaterControl1',
			})
		);

		expect(state.TestRepeaterControl1).toEqual({
			name: 'TestRepeaterControl1',
			value: {
				x: [
					{
						y: [
							{
								z: {
									0: { x: 10, order: 0 },
									1: { x: 12, order: 1 },
									2: { x: 12, order: 2 },
								},
							},
						],
					},
				],
			},
		});

		state = repeaterReducer(
			state,
			addControl({
				value: {
					x: [
						{
							y: [
								{
									z: {
										0: { x: 10, order: 0 },
										1: { x: 12, order: 1 },
										2: { x: 12, order: 2 },
									},
								},
							],
						},
					],
				},
				name: 'TestRepeaterControl2',
			})
		);

		state = repeaterReducer(
			state,
			cloneRepeaterItem({
				itemId: 1,
				maxItems: 2,
				value: { x: 12, order: 1 },
				repeaterId: 'x[0].y[0].z',
				controlId: 'TestRepeaterControl2',
			})
		);

		expect(state.TestRepeaterControl2).toEqual({
			name: 'TestRepeaterControl2',
			value: {
				x: [
					{
						y: [
							{
								z: {
									0: { x: 10, order: 0 },
									1: { x: 12, order: 1 },
									2: { x: 12, order: 2 },
								},
							},
						],
					},
				],
			},
		});

		state = repeaterReducer(
			state,
			addControl({
				value: {
					z: {
						0: { x: 10, order: 0 },
						1: { x: 12, order: 1 },
					},
				},
				name: 'TestRepeaterControl3',
			})
		);

		state = repeaterReducer(
			state,
			cloneRepeaterItem({
				itemId: 1,
				maxItems: 2,
				repeaterId: 'z',
				value: { x: 12, order: 1 },
				controlId: 'TestRepeaterControl3',
			})
		);

		expect(state.TestRepeaterControl3).toEqual({
			name: 'TestRepeaterControl3',
			value: {
				z: {
					0: { x: 10, order: 0 },
					1: { x: 12, order: 1 },
				},
			},
		});

		state = repeaterReducer(
			state,
			addControl({
				value: {
					0: { x: 10, order: 0 },
					1: { x: 12, order: 1 },
				},
				name: 'TestRepeaterControl4',
			})
		);

		state = repeaterReducer(
			state,
			cloneRepeaterItem({
				itemId: 1,
				maxItems: 2,
				repeaterId: 'z',
				value: { x: 12, order: 1 },
				controlId: 'TestRepeaterControl4',
			})
		);

		expect(state.TestRepeaterControl4).toEqual({
			name: 'TestRepeaterControl4',
			value: {
				0: { x: 10, order: 0 },
				1: { x: 12, order: 1 },
			},
		});

		state = repeaterReducer(
			state,
			addControl({
				value: {
					0: { x: 10, order: 0 },
					1: { x: 12, order: 1 },
					2: { x: 12, order: 2 },
				},
				name: 'TestRepeaterControl5',
			})
		);

		state = repeaterReducer(
			state,
			cloneRepeaterItem({
				itemId: 2,
				value: { x: 12, order: 2 },
				repeaterId: 'z',
				controlId: 'TestRepeaterControl5',
			})
		);

		expect(state.TestRepeaterControl5).toEqual({
			name: 'TestRepeaterControl5',
			value: {
				0: { x: 10, order: 0 },
				1: { x: 12, order: 1 },
				2: { x: 12, order: 2 },
				3: { x: 12, order: 3 },
			},
		});
	});
});
