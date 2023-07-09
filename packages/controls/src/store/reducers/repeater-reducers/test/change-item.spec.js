/**
 * Internal dependencies
 */
import { controlReducer } from '../../control-reducer';
import { addControl, changeRepeaterItem } from '../../../actions';

describe('Change Repeater Item', function () {
	it('should changed repeater control item', function () {
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
				changeRepeaterItem({
					value: { x: 20 },
					itemId: 1,
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: [{ x: 10 }, { x: 20 }],
			},
		});
	});
	it('should changed repeater control item with repeaterId as `query`', function () {
		let state = {};

		state = controlReducer(
			state,
			addControl({
				value: {
					x: {
						y: {
							z: [{ x: 10 }, { x: 12 }],
						},
					},
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			controlReducer(
				state,
				changeRepeaterItem({
					value: { x: 20 },
					repeaterId: 'x.y.z[1]',
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					x: {
						y: {
							z: [{ x: 10 }, { x: 20 }],
						},
					},
				},
			},
		});

		state = controlReducer(
			state,
			addControl({
				value: {
					x: {
						y: {
							z: [
								{
									x: [{ value: 10 }],
								},
							],
						},
					},
				},
				name: 'TestRepeaterControl1',
			})
		);

		expect(
			controlReducer(
				state,
				changeRepeaterItem({
					value: { value: 20 },
					repeaterId: 'x.y.z[0].x[0]',
					controlId: 'TestRepeaterControl1',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					x: {
						y: {
							z: [{ x: 10 }, { x: 20 }],
						},
					},
				},
			},
			TestRepeaterControl1: {
				name: 'TestRepeaterControl1',
				value: {
					x: {
						y: {
							z: [
								{
									x: [{ value: 20 }],
								},
							],
						},
					},
				},
			},
		});
	});
	it('should changed repeater control item in first level of state structure', function () {
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

		expect(
			controlReducer(
				state,
				changeRepeaterItem({
					value: { x: 20 },
					repeaterId: 'x[1]',
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					x: [{ x: 10 }, { x: 20 }],
				},
			},
		});
	});
});
