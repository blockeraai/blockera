import { isString } from '@publisher/utils';

// Validates the value is with a special CSS units or not
export function isSpecialUnit(value) {
	return (
		isString(value) &&
		[
			'auto',
			'initial',
			'inherit',
			'fit-content',
			'max-content',
			'min-content',
		].some((item) => value?.endsWith(item))
	);
}
