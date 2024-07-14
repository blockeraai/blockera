// @flow
/**
 * Blockera Dependencies
 */
import { isEquals, isEmpty, isObject, cloneObject } from '@blockera/utils';

/**
 * Internal Dependencies
 */
import { isValid } from '../../';
import { extractNumberAndUnit } from '../input-control/utils';
import type { TDefaultValue } from './types';

export function fixLabelText(value: Object | string): any {
	if (value === '') {
		return '-';
	}

	if (isValid(value)) {
		return <b>VAR</b>;
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
