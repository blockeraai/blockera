import { convertDegToCharacter } from '../degree';

describe('convert to character', () => {
	describe('convertDegToCharacter', () => {
		test('Empty', () => {
			expect(convertDegToCharacter()).toBe(undefined);
		});

		test('is not undefined', () => {
			expect(convertDegToCharacter('text')).toBe('text');
		});

		test('Number', () => {
			expect(convertDegToCharacter(12)).toBe(12);
		});

		test('normal unit text', () => {
			expect(convertDegToCharacter('12px')).toBe('12px');
		});

		test('deg unit text', () => {
			expect(convertDegToCharacter('12deg')).toBe('12°');
		});

		test('rad unit text', () => {
			expect(convertDegToCharacter('12rad')).toBe('12°');
		});

		test('grad unit text', () => {
			expect(convertDegToCharacter('12grad')).toBe('12°');
		});
	});
});
