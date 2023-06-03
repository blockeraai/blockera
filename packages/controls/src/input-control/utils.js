// Validates the value is with a special CSS units or not
export function isSpecialUnit(value) {
	if (
		typeof value === 'string' &&
		[
			'auto',
			'initial',
			'inherit',
			'fit-content',
			'max-content',
			'min-content',
		].some((item) => value?.endsWith(item))
	)
		return true;
	return false;
}
