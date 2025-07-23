// @flow
/**
 * Blockera Dependencies
 */
import { isEquals, isEmpty, cloneObject } from '@blockera/utils';

/**
 * Internal Dependencies
 */
import { isValid } from '../../value-addons/utils';
import { extractNumberAndUnit } from '../input-control/utils';
import type { TDefaultValue } from './types';

export function fixLabelText(value: Object | string): any {
	if (value === '') {
		return '-';
	}

	if (isValid(value)) {
		//$FlowFixMe
		return <b>{value?.settings?.name ?? 'VAR'}</b>;
	}

	const extracted = extractNumberAndUnit(value);

	if (extracted.value === '' && extracted.unit === '') {
		return '-';
	}

	switch (extracted.unit) {
		case 'func':
			return <b>CSS</b>;

		case 'px':
			return extracted.value !== '' ? extracted.value : '0';

		case 'auto':
			return <b>AUTO</b>;

		default:
			return (
				<>
					{extracted.value !== '' ? extracted.value : '0'}
					<i>{extracted.unit}</i>
				</>
			);
	}
}

export const boxPositionControlDefaultValue: TDefaultValue = {
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
	if (isEquals(value, boxPositionControlDefaultValue)) {
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
		return boxPositionControlDefaultValue;
	}

	return updatedValue;
}

// get smart lock for padding and margin
export function getSmartLock(value: any, side: 'padding' | 'margin'): string {
	let smartLock = '';
	const sideValue = value[side];

	// Check if all values are empty (null, undefined, or empty string)
	const allEmpty = [
		sideValue.top,
		sideValue.right,
		sideValue.bottom,
		sideValue.left,
	].every((v) => v === '');

	if (allEmpty) {
		return '';
	}

	if (isEquals(sideValue.left, sideValue.right) && sideValue.left !== '') {
		smartLock = 'horizontal';
	}

	if (isEquals(sideValue.top, sideValue.bottom) && sideValue.top !== '') {
		if (smartLock === 'horizontal') {
			if (isEquals(sideValue.top, sideValue.left)) {
				smartLock = 'all';
			} else {
				smartLock = 'vertical-horizontal';
			}
		} else {
			smartLock = 'vertical';
		}
	}

	return smartLock;
}
