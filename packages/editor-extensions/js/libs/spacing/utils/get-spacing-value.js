/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';

export function getSpacingValue({ propId, spacing, defaultValue }) {
	function extractNumbers(str) {
		const regexp = /\d+\w+/g;

		if (!regexp.test(str)) {
			return str || '';
		}

		const matchedValue = str.match(regexp)[0];

		return /[a-zA-Z]+$/g.test(matchedValue)
			? matchedValue
			: `${matchedValue}px`;
	}

	if (isUndefined(spacing[propId])) {
		return defaultValue;
	}

	return {
		top: extractNumbers(spacing[propId].top),
		right: extractNumbers(spacing[propId].right),
		bottom: extractNumbers(spacing[propId].bottom),
		left: extractNumbers(spacing[propId].left),
	};
}
