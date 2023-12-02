export const convertDegToCharacter = (value) => {
	if (value.includes('deg')) return value.split('d')[0] + '°';

	return value;
};
