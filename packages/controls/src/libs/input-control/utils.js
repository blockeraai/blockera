// @flow
import { isString, isArray, isObject, isUndefined } from '@publisher/utils';

const specialUnits = [
	'auto',
	'initial',
	'inherit',
	'fit-content',
	'max-content',
	'min-content',
	'unset',
	'revert-layer',
	'revert',
	'content',
];

// Function to get a unit object based on a specific value
export const getUnitByValue = (value: string, units: Array<any>): Object => {
	if (value === '' || isUndefined(value)) {
		return {};
	}

	if (isArray(units))
		// Check each unit for a matching value
		for (const unit of units) {
			if (unit.value === value) {
				return unit; // Return the unit if the value matches

				// Check if the unit has options and search within them
			} else if (unit.options && Array.isArray(unit.options)) {
				const innerUnit = unit.options.find(
					(inner) => inner.value === value
				);
				if (innerUnit) {
					return innerUnit; // Return the inner unit if the value matches
				}
			}
		}

	// Return a new custom option for exact founded unit
	return {
		value,
		label: value.toUpperCase(),
		default: '',
		format: 'number',
		notFound: true,
	};
};

// Validates the value is with a special CSS units or not
export function isSpecialUnit(value: string): boolean {
	return (
		isString(value) && specialUnits.some((item) => value?.endsWith(item))
	);
}

export function getCSSUnits(unitType: string = ''): Array<any> {
	if (unitType === '' || !isString(unitType)) {
		return [];
	}

	let cssUnits: Array<any> = [];

	switch (unitType) {
		case 'outline':
		case 'text-shadow':
		case 'box-shadow':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							default: 0,
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							default: '',
							format: 'text',
						},
					],
				},
			];
			break;

		case 'background-size':
			cssUnits = [
				{
					label: 'Special Values',
					options: [
						{
							value: 'auto',
							label: 'Auto',
							default: '',
							format: 'text',
						},
					],
				},
				{
					label: 'Common Values',
					options: [
						{
							value: '%',
							label: '%',
							default: 0,
							format: 'number',
						},
						{
							value: 'px',
							label: 'PX',
							default: 0,
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							default: '',
							format: 'text',
						},
					],
				},
			];
			break;

		case 'letter-spacing':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							default: 0,
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'inherit',
							label: 'Inherit',
							default: '',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							default: '',
							format: 'text',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							default: '',
							format: 'text',
						},
					],
				},
			];
			break;

		case 'text-indent':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							default: 0,
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							default: 0,
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'inherit',
							label: 'Inherit',
							default: '',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							default: '',
							format: 'text',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							default: '',
							format: 'text',
						},
					],
				},
			];
			break;

		case 'background-position':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: '%',
							label: '%',
							default: 0,
							format: 'number',
						},
						{
							value: 'px',
							label: 'PX',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							default: '',
							format: 'text',
						},
					],
				},
			];
			break;

		case 'duration':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: 'ms',
							label: 'MS',
							default: 0,
							format: 'number',
						},
						{
							value: 's',
							label: 'S',
							default: 1,
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							default: '',
							format: 'text',
						},
					],
				},
			];
			break;

		case 'angle':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: 'deg',
							label: 'DEG',
							default: 0,
							format: 'number',
						},
						{
							value: 'rad',
							label: 'RAD',
							default: 0,
							format: 'number',
						},
						{
							value: 'grad',
							label: 'GRAD',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							default: '',
							format: 'text',
						},
					],
				},
			];
			break;

		case 'percent':
			cssUnits = [
				{ value: '%', label: '%', default: 0, format: 'number' },
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							default: '',
							format: 'text',
						},
					],
				},
			];
			break;

		case 'width':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							default: 0,
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							default: 0,
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'fit-content',
							label: 'Fit Content',
							default: 0,
							format: 'number',
						},
						{
							value: 'max-content',
							label: 'Max Content',
							default: 0,
							format: 'number',
						},
						{
							value: 'min-content',
							label: 'Min Content',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							default: '',
							format: 'text',
						},
					],
				},
			];
			break;

		case 'padding':
		case 'essential':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							default: 0,
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							default: 0,
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							default: '',
							format: 'text',
						},
					],
				},
			];
			break;

		case 'general':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							default: 0,
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							default: 0,
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'auto',
							label: 'Auto',
							default: '',
							format: 'text',
						},
						{
							value: 'inherit',
							label: 'Inherit',
							default: '',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							default: '',
							format: 'text',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							default: '',
							format: 'text',
						},
					],
				},
			];
			break;

		case 'margin':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							default: 0,
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							default: 0,
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'auto',
							label: 'Auto',
							default: '',
							format: 'text',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							default: '',
							format: 'text',
						},
					],
				},
			];
			break;

		case 'order':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: '',
							label: '-',
							default: '',
							format: 'number',
						},
						{
							value: 'ps',
							label: 'ps',
							default: '',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'revert',
							label: 'Revert',
							default: '',
							format: 'text',
						},
						{
							value: 'revert-layer',
							label: 'Revert Layer',
							default: '',
							format: 'text',
						},
						{
							value: 'inherit',
							label: 'Inherit',
							default: '',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							default: '',
							format: 'text',
						},
						{
							value: 'unset',
							label: 'Unset',
							default: '',
							format: 'text',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							default: '',
							format: 'text',
						},
					],
				},
			];
			break;

		case 'flex-basis':
			cssUnits = [
				{
					label: 'Special Values',
					options: [
						{
							value: 'auto',
							label: 'Auto',
							default: '',
							format: 'text',
						},
						{
							value: 'content',
							label: 'Content',
							default: '',
							format: 'text',
						},
					],
				},
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							default: 0,
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							default: 0,
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							default: '',
							format: 'text',
						},
					],
				},
			];
			break;

		case 'flex-shrink':
		case 'flex-grow':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: '',
							label: '-',
							default: '',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'revert',
							label: 'Revert',
							default: '',
							format: 'text',
						},
						{
							value: 'revert-layer',
							label: 'Revert Layer',
							default: '',
							format: 'text',
						},
						{
							value: 'inherit',
							label: 'Inherit',
							default: '',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							default: '',
							format: 'text',
						},
						{
							value: 'unset',
							label: 'Unset',
							default: '',
							format: 'text',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							default: '',
							format: 'text',
						},
					],
				},
			];
			break;
	}

	return cssUnits;
}

export function extractNumberAndUnit(value: Object | string): Object {
	if (isObject(value)) {
		return {
			value: value?.value || '',
			unit: value?.unit || '',
		};
	}

	if (value === '' || isUndefined(value)) {
		return {
			value: '',
			unit: '',
		};
	}

	// handle special value
	if (isSpecialUnit(value)) {
		return {
			value: 0,
			unit: value,
		};
	}

	// detect if type is func
	if (isString(value) && value.endsWith('func')) {
		return {
			value: value.substring(0, value.lastIndexOf('func')),
			unit: 'func',
		};
	}

	// Using a regular expression to match the number and unit
	const match = value.match(/(^-?\d+(\.\d+)?)\s*([a-zA-Z%]+)/);

	if (match) {
		// Extracting the number and unit from the regex match
		const value = parseFloat(match[1]);
		const unit = match[3];

		// Returning an object with the extracted values
		return {
			value,
			unit,
		};
	}

	// If no match is found, return null or handle the error as needed
	return {
		value,
		unit: 'func',
	};
}

export function getFirstUnit(units: Array<any>): Object {
	if (isUndefined(units)) {
		return {};
	}

	if (!isUndefined(units[0])) {
		if (
			!isUndefined(units[0].options) &&
			!isUndefined(units[0].options[0])
		) {
			return units[0].options[0];
		}

		return units[0];
	}

	return {};
}
