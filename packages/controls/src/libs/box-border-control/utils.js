// @flow
export function isBorderEmpty(border: object | undefined): boolean {
	if (border === undefined) {
		return false;
	}

	if (
		(border?.type === 'all' && border?.all?.width === '') ||
		(border?.type === 'custom' &&
			border?.top?.width === '' &&
			border?.right?.width === '' &&
			border?.bottom?.width === '' &&
			border?.left?.width === '')
	) {
		return true;
	}

	return false;
}
