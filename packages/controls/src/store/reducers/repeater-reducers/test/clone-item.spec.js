/**
 * Internal dependencies
 */
import { controlReducer } from '../../control-reducer';
import { addControl, cloneRepeaterItem } from '../../../actions';

describe('Clone Repeater Item', function () {
	it('should modified control state with clone repeater item', function () {
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
				cloneRepeaterItem({
					itemId: 1,
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: [{ x: 10 }, { x: 12 }, { x: 12 }],
			},
		});
	});
	it('should modified control state with clone repeater item by repeaterId as `query`', function () {
		let state = {};

		state = controlReducer(
			state,
			addControl({
				value: {
					x: [{ x: 10 }, { x: 12 }],
				},
				name: 'TestRepeaterControl',
			})
		);

		state = controlReducer(
			state,
			cloneRepeaterItem({
				itemId: 1,
				repeaterId: 'x',
				controlId: 'TestRepeaterControl',
			})
		);

		expect(state).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					x: [{ x: 10 }, { x: 12 }, { x: 12 }],
				},
			},
		});

		state = controlReducer(
			state,
			addControl({
				value: {
					x: [
						{
							y: [
								{
									z: [{ x: 10 }, { x: 12 }],
								},
							],
						},
					],
				},
				name: 'TestRepeaterControl1',
			})
		);

		state = controlReducer(
			state,
			cloneRepeaterItem({
				itemId: 1,
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
								z: [{ x: 10 }, { x: 12 }, { x: 12 }],
							},
						],
					},
				],
			},
		});
	});
});
