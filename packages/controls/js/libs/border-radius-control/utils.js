// @flow

export function isBorderRadiusEmpty(borderRadius: object | undefined): boolean {
	if (borderRadius === undefined) {
		return false;
	}

	if (
		(borderRadius?.type === 'all' && borderRadius?.all === '') ||
		(borderRadius?.type === 'custom' &&
			borderRadius?.topLeft === '' &&
			borderRadius?.topRight === '' &&
			borderRadius?.bottomLeft === '' &&
			borderRadius?.bottomRight === '')
	) {
		return true;
	}

	return false;
}
