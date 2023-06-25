import { isNumber } from '@publisher/utils';

export function addAngle(angle, addValue) {
	if (!isNumber(angle) || !isNumber(addValue)) {
		return 0;
	}

	// Add the value to the angle
	let result = angle + addValue;

	// Normalize the result within the range of 0 to 360
	if (result > 360) {
		result %= 360;
	} else if (result < 0) {
		result = 360 - (Math.abs(result) % 360);
	}

	return result;
}

export function subtractAngle(angle, addValue) {
	if (!isNumber(angle) || !isNumber(addValue)) {
		return 0;
	}

	// Subtract the value from the angle
	let result = angle - addValue;

	// Normalize the result within the range of 0 to 359
	if (result < 0) {
		result = 360 - (Math.abs(result) % 360);
	} else if (result > 360) {
		result %= 360;
	}

	return result;
}
