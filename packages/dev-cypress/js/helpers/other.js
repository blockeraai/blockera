/**
 * Helper method to convert a hex value to an RGB value
 *
 * @param {string} hex Hex string. eg: #55e7ff
 * @return {string} RGB string.
 */
export function hexToRGB(hex) {
	let r = 0;
	let g = 0;
	let b = 0;

	// 3 digits
	if (hex.length === 4) {
		r = '0x' + hex[1] + hex[1];
		g = '0x' + hex[2] + hex[2];
		b = '0x' + hex[3] + hex[3];
		// 6 digits
	} else if (hex.length === 7) {
		r = '0x' + hex[1] + hex[2];
		g = '0x' + hex[3] + hex[4];
		b = '0x' + hex[5] + hex[6];
	}

	return 'rgb(' + +r + ', ' + +g + ', ' + +b + ')';
}

export function hexStringToByte(str) {
	if (!str) {
		return new Uint8Array();
	}

	const a = [];
	for (let i = 0, len = str.length; i < len; i += 2) {
		a.push(parseInt(str.substr(i, 2), 16));
	}

	return new Uint8Array(a);
}

export function isNotWPLocalEnv() {
	return Cypress.env('testURL') !== 'http://localhost:8889';
}

// A condition to determine if we are testing on WordPress 6.2+
// This function should be removed in the process of the work for WP 6.3 compatibility
export function isWP62AtLeast() {
	return (
		Cypress.$("[class*='branch-6-2']").length > 0 ||
		Cypress.$("[class*='branch-6-3']").length > 0
	);
}
