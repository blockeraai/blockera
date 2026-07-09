/**
 * Internal dependencies
 */
import { repeaterReducer } from '../';
import { addControl, changeRepeaterItem } from '../../actions';

describe('Change Repeater Item', function () {
	it('should changed repeater control item', function () {
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
				changeRepeaterItem({
					value: { x: 20 },
					itemId: 1,
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					0: { x: 10 },
					1: { x: 20 },
				},
			},
		});
	});
	it('should changed repeater control item with repeaterId as `query`', function () {
		let state = {};

		state = repeaterReducer(
			state,
			addControl({
				value: {
					x: {
						y: {
							z: {
								0: { x: 10 },
								1: { x: 12 },
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
				changeRepeaterItem({
					value: { x: 20 },
					itemId: 1,
					repeaterId: 'x.y.z',
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					x: {
						y: {
							z: {
								0: { x: 10 },
								1: { x: 20 },
							},
						},
					},
				},
			},
		});

		state = repeaterReducer(
			state,
			addControl({
				value: {
					x: {
						y: {
							z: [
								{
									x: {
										0: { value: 10 },
									},
								},
							],
						},
					},
				},
				name: 'TestRepeaterControl1',
			})
		);

		expect(
			repeaterReducer(
				state,
				changeRepeaterItem({
					value: { value: 20 },
					itemId: 0,
					repeaterId: 'x.y.z[0].x',
					controlId: 'TestRepeaterControl1',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					x: {
						y: {
							z: {
								0: {
									x: 10,
								},
								1: {
									x: 20,
								},
							},
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
									x: {
										0: {
											value: 20,
										},
									},
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

		state = repeaterReducer(
			state,
			addControl({
				value: {
					x: {
						0: { x: 10 },
						1: { x: 12 },
					},
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			repeaterReducer(
				state,
				changeRepeaterItem({
					value: { x: 20 },
					itemId: 1,
					repeaterId: 'x',
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					x: {
						0: { x: 10 },
						1: { x: 20 },
					},
				},
			},
		});
	});

	it('should testing change item of repeater with simple repeaterId', function () {
		let state = {};

		state = repeaterReducer(
			state,
			addControl({
				value: {
					x: {
						0: { x: 10 },
						1: { x: 12 },
					},
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			repeaterReducer(
				state,
				changeRepeaterItem({
					value: { x: 20 },
					itemId: 1,
					repeaterId: 'x',
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					x: {
						0: { x: 10 },
						1: { x: 20 },
					},
				},
			},
		});
	});
});
