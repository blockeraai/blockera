import { getCapitalCase } from '..';

describe('getCapitalCase', () => {
	it('supports texts with multiple words', () => {
		const str = 'the publisher platform';
		const result = getCapitalCase(str);
		expect(result).toBe('The Publisher Platform');
	});

	it('convert other characters of words to lowecase', () => {
		const str = 'The PUBLISHER pLaTforM';
		const result = getCapitalCase(str);
		expect(result).toBe('The Publisher Platform');
	});
});
