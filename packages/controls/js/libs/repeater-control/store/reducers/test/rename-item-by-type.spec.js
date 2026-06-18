/**
 * Internal dependencies
 */
import { repeaterReducer } from '../';
import {
	addControl,
	changeRepeaterItem,
	renameRepeaterItemByType,
} from '../../actions';

describe('Rename Repeater Item By Type', function () {
	it('should rename repeater item when type no longer matches itemId', function () {
		let state = {};

		state = repeaterReducer(
			state,
			addControl({
				value: {
					'first-0': { type: 'first', order: 0 },
					'first-1': { type: 'second', order: 1 },
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			repeaterReducer(
				state,
				renameRepeaterItemByType({
					value: { type: 'second', order: 1, isOpen: false },
					itemId: 'first-1',
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					'first-0': { type: 'first', order: 0 },
					'second-0': { type: 'second', order: 1, isOpen: false },
				},
			},
		});
	});

	it('should skip rename when type still matches itemId', function () {
		let state = {};

		state = repeaterReducer(
			state,
			addControl({
				value: {
					'first-0': { type: 'first', order: 0 },
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			repeaterReducer(
				state,
				renameRepeaterItemByType({
					value: { type: 'first', order: 0, isOpen: false },
					itemId: 'first-0',
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual(state);
	});

	it('should rename repeater item when type changes via changeRepeaterItem', function () {
		let state = {};

		state = repeaterReducer(
			state,
			addControl({
				value: {
					'first-0': { type: 'first', order: 0 },
				},
				name: 'TestRepeaterControl',
			})
		);

		expect(
			repeaterReducer(
				state,
				changeRepeaterItem({
					value: { type: 'second', order: 0 },
					itemId: 'first-0',
					controlId: 'TestRepeaterControl',
				})
			)
		).toEqual({
			TestRepeaterControl: {
				name: 'TestRepeaterControl',
				value: {
					'second-0': { type: 'second', order: 0, isOpen: true },
				},
			},
		});
	});
});
