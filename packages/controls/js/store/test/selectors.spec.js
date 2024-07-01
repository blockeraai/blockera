/**
 * Internal dependencies
 */
import { getControlValue } from '../selectors';
import { registerControl } from '../../api';

function generateControlId() {
	return String(Math.random());
}

describe('Selectors Testing ...', () => {
	test('should get control value when passed exists control name', () => {
		const name = generateControlId();
		registerControl({ name, value: 123 });

		expect(getControlValue(name)).toEqual(123);
	});

	test('should retrieved undefined when passed not exists control name', () => {
		const name = generateControlId();
		registerControl({ name, value: 123 });

		expect(getControlValue(name + 'test')).toEqual(undefined);
	});

	test('should retrieved exactly control value when passed exists control name but control value is empty object', () => {
		const name = generateControlId();
		registerControl({ name, value: {} });

		expect(getControlValue(name)).toEqual({});
	});

	test('should retrieved exactly control value when passed exists control name but control value is empty array', () => {
		const name = generateControlId();
		registerControl({ name, value: [] });

		expect(getControlValue(name)).toEqual([]);
	});

	test('should retrieved exactly control value when passed exists control name but control value is empty string', () => {
		const name = generateControlId();
		registerControl({ name, value: '' });

		expect(getControlValue(name)).toEqual('');
	});

	test('should retrieved undefined value when passed exists control name but control value is not declared!', () => {
		const name = generateControlId();
		registerControl({ name });

		expect(getControlValue(name)).toEqual(null);
	});
});
