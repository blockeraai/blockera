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

export function getCSSUnits(unitType = '') {
	if (unitType === '' || !isString(unitType)) {
		return [];
	}

	let cssUnits = [];

	switch (unitType) {
		case 'outline':
		case 'text-shadow':
		case 'box-shadow':
			cssUnits = [
				{ value: 'px', label: 'PX', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
			];
			break;

		case 'background-size':
			cssUnits = [
				{ value: 'auto', label: 'Auto', default: 0 },
				{ value: '%', label: '%', default: 0 },
				{ value: 'px', label: 'PX', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
			];
			break;

		case 'letter-spacing':
			cssUnits = [
				{ value: 'px', label: 'PX', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
				{ value: 'initial', label: 'Initial', default: 0 },
				{ value: 'inherit', label: 'Inherit', default: 0 },
			];
			break;

		case 'text-indent':
			cssUnits = [
				{ value: 'px', label: 'PX', default: 0 },
				{ value: '%', label: '%', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
				{ value: 'initial', label: 'Initial', default: 0 },
				{ value: 'inherit', label: 'Inherit', default: 0 },
			];
			break;

		case 'background-position':
			cssUnits = [
				{ value: '%', label: '%', default: 0 },
				{ value: 'px', label: 'PX', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
			];
			break;

		case 'duration':
			cssUnits = [
				{ value: 'ms', label: 'MS', default: 0 },
				{ value: 's', label: 'S', default: 1 },
			];
			break;

		case 'angle':
			cssUnits = [
				{ value: 'deg', label: 'DEG', default: 0 },
				{ value: 'rad', label: 'RAD', default: 0 },
				{ value: 'grad', label: 'GRAD', default: 0 },
			];
			break;

		case 'percent':
			cssUnits = [{ value: '%', label: '%', default: 0 }];
			break;

		case 'width':
			cssUnits = [
				{ value: 'px', label: 'PX', default: 0 },
				{ value: '%', label: '%', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
				//
				{
					value: 'fit-content',
					label: 'Fit Content',
					default: 0,
				},
				{
					value: 'max-content',
					label: 'Max Content',
					default: 0,
				},
				{
					value: 'min-content',
					label: 'Min Content',
					default: 0,
				},
			];
			break;

		case 'essential':
			cssUnits = [
				{ value: 'px', label: 'PX', default: 0 },
				{ value: '%', label: '%', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
			];
			break;

		case 'general':
			cssUnits = [
				{ value: 'px', label: 'PX', default: 0 },
				{ value: '%', label: '%', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
				//
				{ value: 'auto', label: 'Auto', default: 0 },
				{ value: 'inherit', label: 'Inherit', default: 0 },
				{ value: 'initial', label: 'Initial', default: 0 },
			];
			break;
	}

	return cssUnits;
}
