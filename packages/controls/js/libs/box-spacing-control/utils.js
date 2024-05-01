// @flow
/**
 *  Dependencies
 */
import { isValid } from '@blockera/editor';

/**
 * Internal Dependencies
 */
import { extractNumberAndUnit } from '../input-control/utils';

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
