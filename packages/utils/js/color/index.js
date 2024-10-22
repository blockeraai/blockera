//@flow

/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';

/**
 * Adjusts the brightness of a hexadecimal color by a given percentage.
 *
 * This function takes a hexadecimal color string and a percentage value,
 * then modifies the color brightness by the specified percentage. The
 * percentage can be positive to lighten the color or negative to darken it.
 *
 * @param {string} hex - The hexadecimal color code (3 or 6 digits, with or without a leading '#').
 * @param {number} percent - The percentage by which to adjust the color's brightness.
 *
 * @return {string} - The adjusted hexadecimal color code with a leading '#'.
 */
export const adjustHexColor: (hex: string, percent: number) => string = memoize(
	function (hex: string, percent: number): string {
		// Remove '#' if it's present
		hex = hex.replace(/^#/, '');

		// Validate hex input
		const validHex = /^([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
		if (!validHex.test(hex)) {
			throw new Error('Invalid hex color');
		}

		// Convert 3-digit hex to 6-digit
		if (hex.length === 3) {
			hex = hex
				.split('')
				.map((char) => char + char)
				.join('');
		}

		// Parse the r, g, b values
		let r: number = parseInt(hex.substring(0, 2), 16);
		let g: number = parseInt(hex.substring(2, 4), 16);
		let b: number = parseInt(hex.substring(4, 6), 16);

		// Adjust the colors by the given percentage
		const adjust = (color: number) =>
			Math.min(255, Math.max(0, Math.floor(color * (1 + percent / 100))));

		r = adjust(r);
		g = adjust(g);
		b = adjust(b);

		// Convert back to hex
		const newHex: string = `#${r.toString(16).padStart(2, '0')}${g
			.toString(16)
			.padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

		return newHex;
	}
);
