// @flow
/**
 * Blockera Dependencies
 */
import { isEquals, isEmpty, cloneObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { TDefaultValue } from './types';

export const boxSpacingControlDefaultValue: TDefaultValue = {
	margin: {
		top: '',
		right: '',
		bottom: '',
		left: '',
	},
	padding: {
		top: '',
		right: '',
		bottom: '',
		left: '',
	},
};

// value clean up for removing extra values to prevent saving extra data!
export function boxSpacingValueCleanup(value: Object): Object {
	if (isEquals(value, boxSpacingControlDefaultValue)) {
		return value;
	}

	const updatedValue = cloneObject(value);

	['padding', 'margin'].forEach((type) => {
		['top', 'right', 'bottom', 'left'].forEach((side) => {
			if (
				typeof updatedValue[type] !== 'undefined' &&
				typeof updatedValue[type][side] !== 'undefined' &&
				isEmpty(updatedValue[type][side])
			) {
				delete updatedValue[type][side];
			}
		});

		if (isEmpty(updatedValue[type])) {
			delete updatedValue[type];
		}
	});

	if (isEmpty(updatedValue)) {
		return boxSpacingControlDefaultValue;
	}

	return updatedValue;
}

// get smart lock for padding and margin
export function getSmartLock(value: any, side: 'padding' | 'margin'): string {
	let smartLock = 'none'; // default lock type is expanded
	const sideValue = value[side];

	// Check if all values are empty (null, undefined, or empty string)
	const allEmpty = [
		sideValue.top,
		sideValue.right,
		sideValue.bottom,
		sideValue.left,
	].every((v) => v === '');

	if (allEmpty) {
		return 'simple';
	}

	const isEqualsLeftRight = isEquals(sideValue.left, sideValue.right);
	const isEqualsTopBottom = isEquals(sideValue.top, sideValue.bottom);

	if (isEqualsLeftRight) {
		if (sideValue.left !== '') {
			smartLock = 'left-right';
		} else {
			smartLock = 'empty';
		}
	}

	if (isEqualsTopBottom) {
		if (smartLock === 'left-right' || smartLock === 'empty') {
			smartLock = 'simple';
		} else {
			smartLock = 'expanded';
		}
	} else {
		smartLock = 'expanded';
	}

	return smartLock;
}
