import { isNumber } from '@blockera/utils';

export function addAngle(angle, add) {
	if (!isNumber(angle) || !isNumber(add)) {
		return 0;
	}

	if (typeof angle === 'string' && angle.trim() !== '') {
		angle = Number(angle);
	}

	if (typeof add === 'string' && add.trim() !== '') {
		add = Number(add);
	}

	// Add the value to the angle
	let result = angle + add;

	// Normalize the result within the range of 0 to 360
	if (result > 360) {
		result %= 360;
	} else if (result < 0) {
		result = 360 - (Math.abs(result) % 360);
	}

	return result;
}

export function subtractAngle(angle, subtract) {
	if (!isNumber(angle) || !isNumber(subtract)) {
		return 0;
	}

	if (typeof angle === 'string' && angle.trim() !== '') {
		angle = Number(angle);
	}

	if (typeof subtract === 'string' && subtract.trim() !== '') {
		subtract = Number(subtract);
	}

	// Subtract the value from the angle
	let result = angle - subtract;

	// Normalize the result within the range of 0 to 359
	if (result < 0) {
		result = 360 - (Math.abs(result) % 360);
	} else if (result > 360) {
		result %= 360;
	}

	return result;
}
