import { extractNumberAndUnit } from '../input-control/utils';

export const isOpenPopoverEvent = (event) =>
	!['svg', 'button', 'path'].includes(event?.target?.tagName);

import { convertDegToCharacter } from '@publisher/utils';

export function prepValueForHeader(value) {
	if (value === '') {
		return '';
	}

	const extracted = extractNumberAndUnit(value);

	if (extracted?.specialUnit) {
		return <span className="unit-value unit-value-special">{value}</span>;
	}

	switch (extracted.unit) {
		case 'func':
			return <span className="unit-value unit-value-css">CSS</span>;

		case 'grad':
		case 'rad':
		case 'deg':
			return (
				<span className="unit-value">
					{convertDegToCharacter(value)}
				</span>
			);

		default:
			return <span className="unit-value">{value}</span>;
	}
}
