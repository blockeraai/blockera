// @flow
/**
 * Blockera dependencies
 */
import { isString, isArray, isObject, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { InputUnitTypes } from './types';

const specialUnits = [
	'auto',
	'initial',
	'inherit',
	'stretch',
	'fit-content',
	'max-content',
	'min-content',
	'unset',
	'revert-layer',
	'revert',
	'content',
	'none',
	'func',
];

// Helper function to recursively search for a unit value in nested options
const findUnitInOptions = (
	value: string,
	options: Array<any>
): Object | null => {
	if (!isArray(options)) {
		return null;
	}

	for (const option of options) {
		// Check if this option matches the value
		if (option.value === value) {
			return option;
		}

		// Recursively search in nested options
		if (option.options && Array.isArray(option.options)) {
			const found = findUnitInOptions(value, option.options);
			if (found) {
				return found;
			}
		}
	}

	return null;
};

// Function to get a unit object based on a specific value
export const getUnitByValue = (value: string, units: Array<any>): Object => {
	if (isUndefined(value)) {
		return {};
	}

	if (isArray(units)) {
		// Check each unit for a matching value
		for (const unit of units) {
			if (unit.value === value) {
				return unit; // Return the unit if the value matches
			}

			// Check if the unit has options and search within them recursively
			if (unit.options && Array.isArray(unit.options)) {
				const foundUnit = findUnitInOptions(value, unit.options);
				if (foundUnit) {
					return foundUnit; // Return the found unit
				}
			}
		}
	}

	if (value === '') {
		return {};
	}

	// Return a new custom option for exact founded unit
	return {
		value,
		label: isString(value) ? value.toUpperCase() : value.toString(),
		format: 'number',
		notFound: true,
	};
};

// Validates the value is with a special CSS units or not
export function isSpecialUnit(value: string): boolean {
	// Exclude values ending with 'func' as they are CSS function markers, not special units
	if (isString(value) && value.endsWith('func')) {
		return false;
	}
	return (
		isString(value) && specialUnits.some((item) => value?.endsWith(item))
	);
}

export function getCSSUnits(unitType: InputUnitTypes): Array<any> {
	if (isUndefined(unitType) || !isString(unitType)) {
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
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
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
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
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
							format: 'number',
						},
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
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
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
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
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
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
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
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
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
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
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
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
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
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
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
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
							format: 'number',
						},
						{
							value: 'px',
							label: 'PX',
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
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
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
							format: 'number',
						},
						{
							value: 's',
							label: 'S',
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
							format: 'number',
						},
						{
							value: 'rad',
							label: 'RAD',
							format: 'number',
						},
						{
							value: 'grad',
							label: 'GRAD',
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
							format: 'text',
						},
					],
				},
			];
			break;

		case 'percent':
			cssUnits = [
				{ value: '%', label: '%', format: 'number' },
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			];
			break;

		case 'width':
		case 'height':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
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
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'stretch',
							label: 'Fill Available Space',
							format: 'number',
						},
						{
							value: 'fit-content',
							label: 'Fit Content',
							format: 'number',
						},
						{
							value: 'max-content',
							label: 'Max Content',
							format: 'number',
						},
						{
							value: 'min-content',
							label: 'Min Content',
							format: 'number',
						},
						{
							value: 'auto',
							label: 'Auto',
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
							format: 'text',
						},
					],
				},
			];
			break;

		case 'min-width':
		case 'min-height':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
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
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'stretch',
							label: 'Fill Available Space',
							format: 'number',
						},
						{
							value: 'fit-content',
							label: 'Fit Content',
							format: 'number',
						},
						{
							value: 'max-content',
							label: 'Max Content',
							format: 'number',
						},
						{
							value: 'min-content',
							label: 'Min Content',
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
							format: 'text',
						},
					],
				},
			];
			break;

		case 'max-width':
		case 'max-height':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
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
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'stretch',
							label: 'Fill Available Space',
							format: 'number',
						},
						{
							value: 'fit-content',
							label: 'Fit Content',
							format: 'number',
						},
						{
							value: 'max-content',
							label: 'Max Content',
							format: 'number',
						},
						{
							value: 'min-content',
							label: 'Min Content',
							format: 'number',
						},
						{
							value: 'none',
							label: 'None',
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
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
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
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
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
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
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
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
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
							format: 'text',
						},
						{
							value: 'inherit',
							label: 'Inherit',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
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
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
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
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
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
							label: '—',
							format: 'number',
						},
						{
							value: 'ps',
							label: 'ps',
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
							format: 'text',
						},
						{
							value: 'revert-layer',
							label: 'Revert Layer',
							format: 'text',
						},
						{
							value: 'inherit',
							label: 'Inherit',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							format: 'text',
						},
						{
							value: 'unset',
							label: 'Unset',
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
							format: 'text',
						},
						{
							value: 'content',
							label: 'Content',
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
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
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
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
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
							label: '—',
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
							format: 'text',
						},
						{
							value: 'revert-layer',
							label: 'Revert Layer',
							format: 'text',
						},
						{
							value: 'inherit',
							label: 'Inherit',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							format: 'text',
						},
						{
							value: 'unset',
							label: 'Unset',
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
							format: 'text',
						},
					],
				},
			];
			break;

		case 'z-index':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: '',
							label: '—',
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
							format: 'text',
						},
					],
				},
			];
			break;

		case 'line-height':
			cssUnits = [
				{
					label: 'Common Values',
					options: [
						{
							value: '',
							label: '—',
							format: 'number',
						},
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
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
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
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
							format: 'text',
						},
					],
				},
			];
			break;

		case 'text-length':
			cssUnits = [
				{
					value: 'chars',
					label: 'Chars',
					format: 'number',
				},
				{
					value: 'words',
					label: 'Words',
					format: 'number',
				},
			];
			break;

		case 'media-query':
			cssUnits = [
				{
					label: 'Common Value',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions',
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

	if (isString(value)) {
		// detect if type is func - check this BEFORE checking special units
		// because 'func' is in specialUnits array and would cause false positives
		if (value.endsWith('func')) {
			return {
				value: value.substring(0, value.lastIndexOf('func')),
				unit: 'func',
			};
		}

		// handle special value
		if (isSpecialUnit(value)) {
			return {
				value: '',
				unit: value,
				specialUnit: true,
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

		// Check if the value is a pure number (no unit)
		// This handles cases like '0', '123', '-5', '12.5'
		const numberMatch = value.match(/^-?\d+(\.\d+)?$/);
		if (numberMatch) {
			return {
				value: parseFloat(value),
				unit: 'func',
				unitSimulated: true,
			};
		}
	}

	// If no match is found, return null or handle the error as needed
	return {
		value,
		unit: 'func',
		unitSimulated: true,
	};
}

export function getFirstUnit(units: Array<any>): Object {
	if (isUndefined(units)) {
		return {};
	}

	// Iterate through all units to find the first valid one
	for (const unit of units) {
		// Skip null, undefined, or non-object values
		if (isUndefined(unit) || unit === null || typeof unit !== 'object') {
			continue;
		}

		// If unit has options, check if there's at least one option
		if (!isUndefined(unit.options) && Array.isArray(unit.options)) {
			// Skip if options array is empty
			if (unit.options.length > 0 && !isUndefined(unit.options[0])) {
				return unit.options[0];
			}
			// Continue to next unit if options is empty
			continue;
		}

		// If unit has a direct value property, return it
		if (!isUndefined(unit.value)) {
			return unit;
		}

		// If unit doesn't have options or value, skip it
		continue;
	}

	return {};
}
