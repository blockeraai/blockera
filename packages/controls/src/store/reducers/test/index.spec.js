/**
 * Internal dependencies
 */
import {
	addControl,
	removeControl,
	modifyControlValue,
	modifyControlInfo,
} from '../../actions';
import { controlReducer } from '../control-reducer';

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
		).toEqual({
			...state,
			TestControl: {
				...state.TestControl,
				value: { isTest: true },
			},
		});
	});

	it('should modified total columns of value up to date with value clean up!', function () {
		expect(
			controlReducer(
				state,
				modifyControlValue({
					value: { isTest: true, extraProp: [] },
					controlId: 'TestControl',
					valueCleanup: ({ isTest }) => {
						return { isTest: !isTest };
					},
				})
			)
		).toEqual({
			...state,
			TestControl: {
				...state.TestControl,
				value: { isTest: false },
			},
		});
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

	it('should modified control info', function () {
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
			modifyControlInfo({
				info: {
					testProp: 'testValue',
				},
				controlId: 'TestControl',
			})
		);

		expect(nextState).toEqual({
			TestControl: {
				value: {
					x: 10,
				},
				name: 'TestControl',
				testProp: 'testValue',
			},
		});
	});
});
