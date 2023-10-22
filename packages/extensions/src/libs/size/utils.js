// @flow

export function convertToPercent(value: string): number | string {
	const match = value.match(/^(\d+(?:\.\d+)?)(\w+)$/);

	if (!match) {
		return value;
	}

	const unit = match[2];

	//FIXME: support all units available for sizing feature!
	const references = {
		px: '16px',
		em: '1em',
	};

	const referenceValue = parseFloat(references[unit]);

	if (isNaN(referenceValue)) {
		return value;
	}

	const number = parseFloat(match[1]);

	return (number / referenceValue) * 100;

	// switch (unit) {
	// 	case 'px':
	// 		return (number / referenceValue) * 100;
	// 	case 'em':
	// 		return (number * 16 / referenceValue) * 100;
	// 	default:
	// 		throw new Error(`Unsupported unit: ${unit}`);
	// }
}
