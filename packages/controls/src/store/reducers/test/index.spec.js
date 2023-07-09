/**
 * Internal dependencies
 */
import { addControl, removeControl, modifyControlValue } from '../../actions';
import { controlReducer } from '../control-reducer';
import { repeaterReducer } from '../repeater-reducer';

const initialState = {};
let state = {};

state = controlReducer(
	initialState,
	addControl({
		value: {},
		name: 'TestControl',
	})
);

describe('Control reducer', function () {
	it('should add control', function () {
		expect(state).toEqual({
			TestControl: {
				value: {},
				name: 'TestControl',
			},
		});
	});

	it('should state equal with latest changes of state value when after dispatch invalid type of action!', function () {
		expect(
			controlReducer(state, {
				type: 'test',
			})
		).toEqual(state);
	});

	it('should modified total columns of value up to date!', function () {
		expect(
			controlReducer(
				state,
				modifyControlValue({
					value: { isTest: true },
					controlId: 'TestControl',
				})
			)
		);
	});

	it('should modified total columns of value up to date with value clean up!', function () {
		expect(
			controlReducer(
				state,
				modifyControlValue({
					value: { isTest: true, extraProp: [] },
					controlId: 'TestControl',
					valueCleanup: ({ isTest }) => {
						return { isTest };
					},
				})
			)
		);
	});

	it('should remove control', function () {
		state = controlReducer(
			state,
			addControl({
				value: {},
				name: 'TestControl2',
			})
		);
		state = controlReducer(state, removeControl(['TestControl']));

		expect(state).toEqual({
			TestControl2: {
				value: {},
				name: 'TestControl2',
			},
		});

		state = controlReducer(state, removeControl(['TestControl2']));

		expect(state).toEqual({});
	});

	it('should modified control value', function () {
		state = controlReducer(
			state,
			addControl({
				value: {
					x: 10,
				},
				name: 'TestControl',
			})
		);

		const nextState = controlReducer(
			state,
			modifyControlValue({
				value: 20,
				propId: 'x',
				controlId: 'TestControl',
			})
		);

		expect(nextState).toEqual({
			TestControl: {
				name: 'TestControl',
				value: {
					x: 20,
				},
			},
		});
	});
});

describe('Repeater Control Type', function () {
	it('should state equal with latest changes of state value when after dispatch invalid type of action for repeater items!', function () {
		const initialState = {};
		expect(
			repeaterReducer(initialState, {
				type: 'test',
			})
		).toEqual(initialState);
	});
});
