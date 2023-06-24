export function addAngle(angle, value) {
	// Add the value to the angle
	let result = angle + value;

	// Normalize the result within the range of 0 to 360
	if (result > 360) {
		result %= 360;
	} else if (result < 0) {
		result = 360 - (Math.abs(result) % 360);
	}

	return result;
}

export function subtractAngle(angle, value) {
	// Subtract the value from the angle
	let result = angle - value;

	// Normalize the result within the range of 0 to 359
	if (result < 0) {
		result = 360 - (Math.abs(result) % 360);
	} else if (result > 360) {
		result %= 360;
	}

	return result;
}
