// @flow

export const convertDegToCharacter = (
	value: string | number
): string | number => {
	if (typeof value === 'string') {
		if (value.endsWith('deg')) {
			return value.slice(0, -3) + '°';
		} else if (value.endsWith('grad')) {
			return value.slice(0, -4) + '°';
		} else if (value.endsWith('rad')) {
			return value.slice(0, -3) + '°';
		}
	}

	return value;
};
