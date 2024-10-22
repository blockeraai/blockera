/**
 * External dependencies
 */
import { adjustHexColor } from '..';

describe('adjustHexColor', () => {
	// Test for lightening the color
	it('should lighten a hex color by a given percentage', () => {
		const result = adjustHexColor('#3498db', 20);
		expect(result).toBe('#3eb6ff'); // Expected lighter color
	});

	// Test for darkening the color
	it('should darken a hex color by a given percentage', () => {
		const result = adjustHexColor('#3498db', -20);
		expect(result).toBe('#2979af'); // Expected darker color
	});

	// Test for converting a 3-digit hex to 6-digit and lighten
	it('should convert 3-digit hex to 6-digit and lighten the color', () => {
		const result = adjustHexColor('#abc', 20);
		expect(result).toBe('#cce0f4'); // Expected result after conversion and lightening
	});

	// Test for converting a 3-digit hex to 6-digit and darken
	it('should convert 3-digit hex to 6-digit and darken the color', () => {
		const result = adjustHexColor('#abc', -20);
		expect(result).toBe('#8895a3'); // Expected result after conversion and darkening
	});

	// Test for a maximum lightening value
	it('should not lighten the color beyond white', () => {
		const result = adjustHexColor('#ffffff', 50);
		expect(result).toBe('#ffffff'); // White color should not change
	});

	// Test for a maximum darkening value
	it('should not darken the color beyond black', () => {
		const result = adjustHexColor('#000000', -50);
		expect(result).toBe('#000000'); // Black color should not change
	});

	// Test with invalid hex format
	it('should throw an error for invalid hex color', () => {
		expect(() => adjustHexColor('invalid', 20)).toThrow(Error);
	});

	// Test with no hash symbol
	it('should handle hex color without a leading hash', () => {
		const result = adjustHexColor('3498db', 20);
		expect(result).toBe('#3eb6ff'); // Expected result with leading #
	});
});
