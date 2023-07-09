/**
 * Internal dependencies
 */
import { controlReducer } from '../../control-reducer';
import { addControl, addRepeaterItem } from '../../../actions';

describe('Add Repeater Item', function () {
	it('should add item in high level of state', function () {
		let state = {};

		state = controlReducer(
			state,
			addControl({
				value: [],
				name: 'TestRepeaterControl',
			})
		);

		expect(
			controlReducer(
				state,
				addRepeaterItem({
					value: { x: 10 },
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: [
					{
						x: 10,
					},
				],
			},
		});
	});

	it('should not add item in incorrect repeaterId', function () {
		let state = {};

		state = controlReducer(
			state,
			addControl({
				value: {
					repeaterControl: [],
				},
				name: 'TestInnerRepeaterControl',
			})
		);

		expect(
			controlReducer(
				state,
				addRepeaterItem({
					maxItems: 2,
					value: { x: 20 },
					repeaterId: 'incorrectId',
					controlId: 'IncorrectControlId',
				})
			)
		).toEqual({
			TestInnerRepeaterControl: {
				name: 'TestInnerRepeaterControl',
				value: {
					repeaterControl: [],
				},
			},
		});
	});

	it('should add item in secondary level of state', function () {
		let state = {};

		state = controlReducer(
			state,
			addControl({
				value: {
					repeaterControl: [],
				},
				name: 'TestInnerRepeaterControl',
			})
		);

		state = controlReducer(
			state,
			addRepeaterItem({
				value: { x: 10 },
				repeaterId: 'repeaterControl',
				controlId: 'TestInnerRepeaterControl',
			})
		);

		expect(state).toEqual({
			TestInnerRepeaterControl: {
				name: 'TestInnerRepeaterControl',
				value: {
					repeaterControl: [
						{
							x: 10,
						},
					],
				},
			},
		});
	});

	it('should add item order by limited with maxItems value', function () {
		let state = {};

		state = controlReducer(
			state,
			addControl({
				value: [{ x: 10 }, { x: 10 }],
				name: 'TestRepeaterControl',
			})
		);

		state = controlReducer(
			state,
			addRepeaterItem({
				maxItems: 3,
				value: { x: 10 },
				controlId: 'TestRepeaterControl',
			})
		);

		state = controlReducer(
			state,
			addRepeaterItem({
				maxItems: 3,
				value: { x: 10 },
				controlId: 'TestRepeaterControl',
			})
		);

		expect(state).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: [{ x: 10 }, { x: 10 }, { x: 10 }],
			},
		});
	});

	it('should add item with repeaterId as query`', function () {
		let state = {};

		state = controlReducer(
			state,
			addControl({
				value: {
					x: {
						y: {
							z: [],
						},
					},
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			controlReducer(
				state,
				addRepeaterItem({
					value: { x: 10 },
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
							z: [
								{
									x: 10,
								},
							],
						},
					},
				},
			},
		});
	});

	it('should add item into repeater where exists inside other repeater with repeaterId as `query`', function () {
		let state = {};

		state = controlReducer(
			state,
			addControl({
				value: {
					x: {
						y: {
							z: [
								{
									r: [],
								},
							],
						},
					},
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			controlReducer(
				state,
				addRepeaterItem({
					value: { x: 10 },
					repeaterId: 'x.y.z[0].r',
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					x: {
						y: {
							z: [
								{
									r: [
										{
											x: 10,
										},
									],
								},
							],
						},
					},
				},
			},
		});

		expect(
			controlReducer(
				state,
				addRepeaterItem({
					maxItems: 1,
					value: { x: 10 },
					repeaterId: 'x.y.z[0].r',
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					x: {
						y: {
							z: [
								{
									r: [
										{
											x: 10,
										},
									],
								},
							],
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
									r: [
										{
											m: [],
										},
									],
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
				addRepeaterItem({
					value: { x: 10 },
					repeaterId: 'x.y.z[0].r[0].m',
					repeaterParentItemId: 0,
					controlId: 'TestRepeaterControl1',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					x: {
						y: {
							z: [
								{
									r: [
										{
											x: 10,
										},
									],
								},
							],
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
									r: [
										{
											m: [
												{
													x: 10,
												},
											],
										},
									],
								},
							],
						},
					},
				},
			},
		});
	});

	it('access to repeater inside other repeater like [0][repeater-secondary]', function () {
		let state = {};

		state = controlReducer(
			state,
			addControl({
				value: [
					{
						'second-repeater': [],
					},
				],
				name: 'TestRepeaterControl',
			})
		);

		state = controlReducer(
			state,
			addRepeaterItem({
				value: { x: 10 },
				repeaterId: `[0][second-repeater]`,
				controlId: 'TestRepeaterControl',
			})
		);

		expect(state).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: [
					{
						'second-repeater': [{ x: 10 }],
					},
				],
			},
		});

		state = controlReducer(
			state,
			addRepeaterItem({
				value: { x: 10 },
				repeaterId: `[0][second-repeater]`,
				controlId: 'TestRepeaterControl',
			})
		);

		expect(state).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: [
					{
						'second-repeater': [{ x: 10 }, { x: 10 }],
					},
				],
			},
		});
	});
});
