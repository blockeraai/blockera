/**
 * Internal dependencies
 */
import { controlReducer } from '../../control-reducer';
import { addControl, removeRepeaterItem } from '../../../actions';

describe('Remove Repeater Item', function () {
	it('should modified control state with remove repeater item', function () {
		let state = {};

		state = controlReducer(
			state,
			addControl({
				value: [{ x: 0 }],
				name: 'TestRepeaterControl',
			})
		);

		expect(
			controlReducer(
				state,
				removeRepeaterItem({
					itemId: 0,
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: [],
			},
		});
	});
	it('remove item with simple repeaterId', function () {
		let state = {};

		state = controlReducer(
			state,
			addControl({
				value: {
					r: [{ x: 0 }],
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			controlReducer(
				state,
				removeRepeaterItem({
					itemId: 0,
					repeaterId: 'r',
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					r: [],
				},
			},
		});
	});
	it('remove item with query of state in repeaterId', function () {
		let state = {};

		state = controlReducer(
			state,
			addControl({
				value: {
					r: {
						x: {
							y: {
								z: [{ x: 0 }, { x: 10 }],
							},
						},
					},
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			controlReducer(
				state,
				removeRepeaterItem({
					itemId: 1,
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
								z: [{ x: 0 }],
							},
						},
					},
				},
			},
		});
	});
	it('remove item of repeater inside other repeater control', function () {
		let state = {};

		state = controlReducer(
			state,
			addControl({
				value: {
					r: [
						{
							y: [{ x: 0 }],
						},
					],
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			controlReducer(
				state,
				removeRepeaterItem({
					itemId: 0,
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
							y: [],
						},
					],
				},
			},
		});
	});
});
