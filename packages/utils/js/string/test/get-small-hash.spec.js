/**
 * Internal dependencies
 */
import { getSmallHash } from '../';

describe('getSmallHash', () => {
	test('should return a shortened string', () => {
		const input = '9810d7ec-eb38-4931-8159-e3a3595e8233';
		const output = getSmallHash(input);
		expect(typeof output).toBe('string');
	});

	test('should return consistent shortened strings for the same input', () => {
		const input = '9810d7ec-eb38-4931-8159-e3a3595e8233';
		const output1 = getSmallHash(input);
		const output2 = getSmallHash(input);
		expect(output1).toBe(output2);
	});

	test('should return different shortened strings for different inputs', () => {
		const input1 = '9810d7ec-eb38-4931-8159-e3a3595e8233';
		const input2 = 'b8a1d5fc-eb38-4931-8159-e3a3595e1234';
		const output1 = getSmallHash(input1);
		const output2 = getSmallHash(input2);
		expect(output1).not.toBe(output2);
	});

	test('should handle empty string input', () => {
		const input = '';
		const output = getSmallHash(input);
		expect(output).toBe('0');
	});

	test('should handle single character input', () => {
		const input = 'a';
		const output = getSmallHash(input);
		expect(output).toBe('2p');
	});

	test('should handle numeric string input', () => {
		const input = '1234567890';
		const output = getSmallHash(input);
		expect(typeof output).toBe('string');
	});

	test('should handle long string input', () => {
		const input = 'a'.repeat(1000);
		const output = getSmallHash(input);
		expect(typeof output).toBe('string');
	});
});
