// @flow

/**
 * Blockera dependencies
 */
import { isEmpty } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { LinkControlValue } from './types';

export function linkControlValueCleaner(value: LinkControlValue): Object {
	const newValue: Object = value;

	if (isEmpty(newValue.link)) {
		delete newValue.link;
	}

	if (isEmpty(newValue.target) || newValue?.target === false) {
		delete newValue.target;
	}

	if (isEmpty(newValue.nofollow) || newValue?.nofollow === false) {
		delete newValue.nofollow;
	}

	if (isEmpty(newValue.label)) {
		delete newValue.label;
	}

	if (isEmpty(newValue.attributes)) {
		delete newValue.attributes;
	}

	return newValue;
}
