/**
 * Internal dependencies
 */
import { varExport } from '../index';

describe('varExport testing', () => {
	test('undefined', () => {
		expect(varExport()).toBe('undefined');
		expect(varExport(undefined)).toBe('undefined');
	});

	test('string', () => {
		expect(varExport('')).toBe("''");
		expect(varExport('akbar')).toBe("'akbar'");
	});

	test('boolean', () => {
		expect(varExport(Boolean)).toBe('');
		expect(varExport(false)).toBe('false');
		expect(varExport(true)).toBe('true');
	});

	test('number', () => {
		expect(varExport(1)).toBe('1');
	});

	test('null', () => {
		expect(varExport(null)).toBe('null');
	});

	test('array', () => {
		expect(varExport(['hello', 'akbar'])).toBe(
			"[\n    'hello',\n    'akbar'\n]"
		);
	});

	test('object', () => {
		expect(varExport({ name: 'akbar', family: 'akbari' })).toBe(
			"{\n    name: \t'akbar',\n    family: \t'akbari'\n}"
		);
	});

	test('complex object', () => {
		expect(
			varExport({
				name: 'akbar',
				family: 'akbari',
				age: 30,
				isMarried: false,
				interest: ['Publisher', 'WordPress'],
			})
		).toBe(
			'{\n' +
				"    name: \t'akbar',\n" +
				"    family: \t'akbari',\n" +
				'    age: \t30,\n' +
				'    isMarried: \tfalse,\n' +
				"    interest: \t[\n\t    'Publisher',\n\t    'WordPress'\n\t]\n" +
				'}'
		);
	});
});
