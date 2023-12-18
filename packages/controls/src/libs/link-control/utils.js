// @flow

/**
 * Publisher dependencies
 */
import { isArray, isEmpty } from '@publisher/utils';

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

	if (isArray(newValue.attributes) && newValue.attributes.length === 0) {
		delete newValue.attributes;
	} else {
		delete newValue.attributes;
	}

	return newValue;
}
