import { isString, isArray } from '@publisher/utils';

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
];

// all css units
export const cssUnits = [
	{ value: 'px', label: 'PX', default: 0, type: 'number' },
	{ value: 'em', label: 'EM', default: 0, type: 'number' },
	{ value: 'rem', label: 'REM', default: 0, type: 'number' },
	{ value: 'ch', label: 'CH', default: 0, type: 'number' },
	{ value: 'vw', label: 'VW', default: 0, type: 'number' },
	{ value: 'vh', label: 'VH', default: 0, type: 'number' },
	{ value: 'dvw', label: 'DVW', default: 0, type: 'number' },
	{ value: 'dvh', label: 'DVH', default: 0, type: 'number' },
	{ value: 'auto', label: 'Auto', default: '', type: 'text' },
	{ value: '%', label: '%', default: 0, type: 'number' },
	{
		value: 'initial',
		label: 'Initial',
		default: '',
		type: 'text',
	},
	{
		value: 'inherit',
		label: 'Inherit',
		default: '',
		type: 'text',
	},
	{
		value: 'func',
		label: 'CSS FUNC',
		default: '',
		type: 'text',
	},
	{ value: 'ms', label: 'MS', default: 0, type: 'number' },
	{ value: 's', label: 'S', default: 1, type: 'number' },
	{ value: 'deg', label: 'DEG', default: 0, type: 'number' },
	{ value: 'rad', label: 'RAD', default: 0, type: 'number' },
	{ value: 'grad', label: 'GRAD', default: 0, type: 'number' },
	{ value: 'revert', label: 'Revert', default: '', type: 'text' },
	{
		value: 'revert-layer',
		label: 'Revert Layer',
		default: '',
		type: 'text',
	},
	{ value: 'unset', label: 'Unset', default: '', type: 'text' },
	{
		value: 'fit-content',
		label: 'Fit Content',
		default: 0,
		type: 'number',
	},
	{
		value: 'max-content',
		label: 'Max Content',
		default: 0,
		type: 'number',
	},
	{
		value: 'min-content',
		label: 'Min Content',
		default: 0,
		type: 'number',
	},
];

// Function to get a unit object based on a specific value
export const getUnitByValue = (value) => {
	return cssUnits.find((unit) => unit.value === value);
};

// Validates the value is with a special CSS units or not
export function isSpecialUnit(value) {
	return (
		isString(value) && specialUnits.some((item) => value?.endsWith(item))
	);
}

export function extractSpecialUnitType(value) {
	if (!isString(value)) return;
	const foundUnit = specialUnits.find((unit) => value.includes(unit));
	console.log('unit value re', foundUnit);
	return foundUnit;
}

// get the number in string values
export function extractNumber(text) {
	if (text && isString(text)) {
		const regex = /\d+/;
		const match = text.match(regex);
		if (match) {
			return match[0];
		}
	}

	return text;
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
				{ value: 'px', label: 'PX', default: 0, type: 'number' },
				{ value: 'em', label: 'EM', default: 0, type: 'number' },
				{ value: 'rem', label: 'REM', default: 0, type: 'number' },
				{ value: 'ch', label: 'CH', default: 0, type: 'number' },
				{ value: 'vw', label: 'VW', default: 0, type: 'number' },
				{ value: 'vh', label: 'VH', default: 0, type: 'number' },
				{ value: 'dvw', label: 'DVW', default: 0, type: 'number' },
				{ value: 'dvh', label: 'DVH', default: 0, type: 'number' },
				{
					value: 'func',
					label: 'CSS FUNC',
					default: '',
					type: 'text',
				},
			];
			break;

		case 'background-size':
			cssUnits = [
				{ value: 'auto', label: 'Auto', default: '', type: 'text' },
				{ value: '%', label: '%', default: 0, type: 'number' },
				{ value: 'px', label: 'PX', default: 0, type: 'number' },
				{ value: 'em', label: 'EM', default: 0, type: 'number' },
				{ value: 'rem', label: 'REM', default: 0, type: 'number' },
				{ value: 'ch', label: 'CH', default: 0, type: 'number' },
				{ value: 'vw', label: 'VW', default: 0, type: 'number' },
				{ value: 'vh', label: 'VH', default: 0, type: 'number' },
				{ value: 'dvw', label: 'DVW', default: 0, type: 'number' },
				{ value: 'dvh', label: 'DVH', default: 0, type: 'number' },
				{
					value: 'func',
					label: 'CSS FUNC',
					default: '',
					type: 'text',
				},
			];
			break;

		case 'letter-spacing':
			cssUnits = [
				{ value: 'px', label: 'PX', default: 0, type: 'number' },
				{ value: 'em', label: 'EM', default: 0, type: 'number' },
				{ value: 'rem', label: 'REM', default: 0, type: 'number' },
				{ value: 'ch', label: 'CH', default: 0, type: 'number' },
				{ value: 'vw', label: 'VW', default: 0, type: 'number' },
				{ value: 'vh', label: 'VH', default: 0, type: 'number' },
				{ value: 'dvw', label: 'DVW', default: 0, type: 'number' },
				{ value: 'dvh', label: 'DVH', default: 0, type: 'number' },
				{
					value: 'initial',
					label: 'Initial',
					default: '',
					type: 'text',
				},
				{
					value: 'inherit',
					label: 'Inherit',
					default: '',
					type: 'text',
				},
				{
					value: 'func',
					label: 'CSS FUNC',
					default: '',
					type: 'text',
				},
			];
			break;

		case 'text-indent':
			cssUnits = [
				{ value: 'px', label: 'PX', default: 0, type: 'number' },
				{ value: '%', label: '%', default: 0, type: 'number' },
				{ value: 'em', label: 'EM', default: 0, type: 'number' },
				{ value: 'rem', label: 'REM', default: 0, type: 'number' },
				{ value: 'ch', label: 'CH', default: 0, type: 'number' },
				{ value: 'vw', label: 'VW', default: 0, type: 'number' },
				{ value: 'vh', label: 'VH', default: 0, type: 'number' },
				{ value: 'dvw', label: 'DVW', default: 0, type: 'number' },
				{ value: 'dvh', label: 'DVH', default: 0, type: 'number' },
				{
					value: 'initial',
					label: 'Initial',
					default: '',
					type: 'text',
				},
				{
					value: 'inherit',
					label: 'Inherit',
					default: '',
					type: 'text',
				},
				{
					value: 'func',
					label: 'CSS FUNC',
					default: '',
					type: 'text',
				},
			];
			break;

		case 'background-position':
			cssUnits = [
				{ value: '%', label: '%', default: 0, type: 'number' },
				{ value: 'px', label: 'PX', default: 0, type: 'number' },
				{ value: 'vw', label: 'VW', default: 0, type: 'number' },
				{ value: 'vh', label: 'VH', default: 0, type: 'number' },
				{ value: 'dvw', label: 'DVW', default: 0, type: 'number' },
				{ value: 'dvh', label: 'DVH', default: 0, type: 'number' },
				{
					value: 'func',
					label: 'CSS FUNC',
					default: '',
					type: 'text',
				},
			];
			break;

		case 'duration':
			cssUnits = [
				{ value: 'ms', label: 'MS', default: 0, type: 'number' },
				{ value: 's', label: 'S', default: 1, type: 'number' },
				{
					value: 'func',
					label: 'CSS FUNC',
					default: '',
					type: 'text',
				},
			];
			break;

		case 'angle':
			cssUnits = [
				{ value: 'deg', label: 'DEG', default: 0, type: 'number' },
				{ value: 'rad', label: 'RAD', default: 0, type: 'number' },
				{ value: 'grad', label: 'GRAD', default: 0, type: 'number' },
				{
					value: 'func',
					label: 'CSS FUNC',
					default: '',
					type: 'text',
				},
			];
			break;

		case 'percent':
			cssUnits = [
				{ value: '%', label: '%', default: 0, type: 'number' },
				{
					value: 'func',
					label: 'CSS FUNC',
					default: '',
					type: 'text',
				},
			];
			break;

		case 'width':
			cssUnits = [
				{ value: 'px', label: 'PX', default: 0, type: 'number' },
				{ value: '%', label: '%', default: 0, type: 'number' },
				{ value: 'em', label: 'EM', default: 0, type: 'number' },
				{ value: 'rem', label: 'REM', default: 0, type: 'number' },
				{ value: 'ch', label: 'CH', default: 0, type: 'number' },
				{ value: 'vw', label: 'VW', default: 0, type: 'number' },
				{ value: 'vh', label: 'VH', default: 0, type: 'number' },
				{ value: 'dvw', label: 'DVW', default: 0, type: 'number' },
				{ value: 'dvh', label: 'DVH', default: 0, type: 'number' },
				//
				{
					value: 'fit-content',
					label: 'Fit Content',
					default: 0,
					type: 'number',
				},
				{
					value: 'max-content',
					label: 'Max Content',
					default: 0,
					type: 'number',
				},
				{
					value: 'min-content',
					label: 'Min Content',
					default: 0,
					type: 'number',
				},
				{
					value: 'func',
					label: 'CSS FUNC',
					default: '',
					type: 'text',
				},
			];
			break;

		case 'padding':
		case 'essential':
			cssUnits = [
				{ value: 'px', label: 'PX', default: 0, type: 'number' },
				{ value: '%', label: '%', default: 0, type: 'number' },
				{ value: 'em', label: 'EM', default: 0, type: 'number' },
				{ value: 'rem', label: 'REM', default: 0, type: 'number' },
				{ value: 'ch', label: 'CH', default: 0, type: 'number' },
				{ value: 'vw', label: 'VW', default: 0, type: 'number' },
				{ value: 'vh', label: 'VH', default: 0, type: 'number' },
				{ value: 'dvw', label: 'DVW', default: 0, type: 'number' },
				{ value: 'dvh', label: 'DVH', default: 0, type: 'number' },
				{
					value: 'func',
					label: 'CSS FUNC',
					default: '',
					type: 'text',
				},
			];
			break;

		case 'general':
			cssUnits = [
				{ value: 'px', label: 'PX', default: 0, type: 'number' },
				{ value: '%', label: '%', default: 0, type: 'number' },
				{ value: 'em', label: 'EM', default: 0, type: 'number' },
				{ value: 'rem', label: 'REM', default: 0, type: 'number' },
				{ value: 'ch', label: 'CH', default: 0, type: 'number' },
				{ value: 'vw', label: 'VW', default: 0, type: 'number' },
				{ value: 'vh', label: 'VH', default: 0, type: 'number' },
				{ value: 'dvw', label: 'DVW', default: 0, type: 'number' },
				{ value: 'dvh', label: 'DVH', default: 0, type: 'number' },
				//
				{ value: 'auto', label: 'Auto', default: '', type: 'text' },
				{
					value: 'inherit',
					label: 'Inherit',
					default: '',
					type: 'text',
				},
				{
					value: 'initial',
					label: 'Initial',
					default: '',
					type: 'text',
				},
				{
					value: 'func',
					label: 'CSS FUNC',
					default: '',
					type: 'text',
				},
			];
			break;

		case 'margin':
			cssUnits = [
				{ value: 'px', label: 'PX', default: 0, type: 'number' },
				{ value: '%', label: '%', default: 0, type: 'number' },
				{ value: 'em', label: 'EM', default: 0, type: 'number' },
				{ value: 'rem', label: 'REM', default: 0, type: 'number' },
				{ value: 'ch', label: 'CH', default: 0, type: 'number' },
				{ value: 'vw', label: 'VW', default: 0, type: 'number' },
				{ value: 'vh', label: 'VH', default: 0, type: 'number' },
				{ value: 'dvw', label: 'DVW', default: 0, type: 'number' },
				{ value: 'dvh', label: 'DVH', default: 0, type: 'number' },
				//
				{ value: 'auto', label: 'Auto', default: '', type: 'text' },
				{
					value: 'func',
					label: 'CSS FUNC',
					default: '',
					type: 'text',
				},
			];
			break;

		case 'order':
			cssUnits = [
				{ value: '-', label: '-', default: '', type: 'text' },
				//
				{ value: 'revert', label: 'Revert', default: '', type: 'text' },
				{
					value: 'revert-layer',
					label: 'Revert Layer',
					default: '',
					type: 'text',
				},
				{
					value: 'inherit',
					label: 'Inherit',
					default: '',
					type: 'text',
				},
				{
					value: 'initial',
					label: 'Initial',
					default: '',
					type: 'text',
				},
				{ value: 'unset', label: 'Unset', default: '', type: 'text' },
				{
					value: 'func',
					label: 'CSS FUNC',
					default: '',
					type: 'text',
				},
			];
			break;
	}

	return cssUnits;
}

const cssFunctionsRegex = {
	calc: /(?:^|\s)calc\(\s*(-?\d*\.?\d+(?:%|vh|vw|vmin|vmax|em|rem|px|cm|ex|in|mm|pc|pt|ch|q|deg|rad|grad|turn|s|ms|hz|khz))\s*[+\-\/*]\s*(-?\d*\.?\d+(?:%|vh|vw|vmin|vmax|em|rem|px|cm|ex|in|mm|pc|pt|ch|q|deg|rad|grad|turn|s|ms|hz|khz))\s*\)(?=\s|$)/gi,
	max: /(?:^|\s)max\(\s*((?:-?\d*\.?\d+(?:%|vh|vw|vmin|vmax|em|rem|px|cm|ex|in|mm|pc|pt|ch|q|deg|rad|grad|turn|s|ms|hz|khz)\s*,\s*)*-?\d*\.?\d+(?:%|vh|vw|vmin|vmax|em|rem|px|cm|ex|in|mm|pc|pt|ch|q|deg|rad|grad|turn|s|ms|hz|khz))\s*\)(?=\s|$)/gi,
	min: /(?:^|\s)min\(\s*((?:-?\d*\.?\d+(?:%|vh|vw|vmin|vmax|em|rem|px|cm|ex|in|mm|pc|pt|ch|q|deg|rad|grad|turn|s|ms|hz|khz)\s*,\s*)*-?\d*\.?\d+(?:%|vh|vw|vmin|vmax|em|rem|px|cm|ex|in|mm|pc|pt|ch|q|deg|rad|grad|turn|s|ms|hz|khz))\s*\)(?=\s|$)/gi,
	// clamp: /clamp\(\s*(-?\d*\.?\d+(?:%|vh|vw|vmin|vmax|em|rem|px|cm|ex|in|mm|pc|pt|ch|q|deg|rad|grad|turn|s|ms|hz|khz))\s*,\s*(-?\d*\.?\d+(?:%|vh|vw|vmin|vmax|em|rem|px|cm|ex|in|mm|pc|pt|ch|q|deg|rad|grad|turn|s|ms|hz|khz))\s*,\s*(-?\d*\.?\d+(?:%|vh|vw|vmin|vmax|em|rem|px|cm|ex|in|mm|pc|pt|ch|q|deg|rad|grad|turn|s|ms|hz|khz)))\s*\)/gi,
	translate:
		/(?:^|\s)translate\(\s*(-?\d*\.?\d+(?:%|vh|vw|vmin|vmax|em|rem|px|cm|ex|in|mm|pc|pt|ch|q|deg|rad|grad|turn|s|ms|hz|khz))\s*,\s*(-?\d*\.?\d+(?:%|vh|vw|vmin|vmax|em|rem|px|cm|ex|in|mm|pc|pt|ch|q|deg|rad|grad|turn|s|ms|hz|khz))\s*\)(?=\s|$)/gi,
	scale: /(?:^|\s)scale\(\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*\)(?=\s|$)/gi,
	rotate: /(?:^|\s)rotate\(\s*(-?\d*\.?\d+)(deg|rad|grad|turn)?\s*\)(?=\s|$)/gi,
	rgb: /(?:^|\s)rgb\(\s*(\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3})\s*\)(?=\s|$)/gi,
	rgba: /(?:^|\s)rgba\(\s*(\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(?:0?\.\d|1))\s*\)(?=\s|$)/gi,
	hsl: /(?:^|\s)hsl\(\s*(\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%)?\s*\)(?=\s|$)/gi,
	hsla: /(?:^|\s)hsla\(\s*(\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*(?:0?\.\d|1))\s*\)(?=\s|$)/gi,
	skew: /(?:^|\s)skew\(\s*(-?\d*\.?\d+deg)\s*,\s*(-?\d*\.?\d+deg)\s*\)(?=\s|$)/gi,
	attr: /(?:^|\s)attr\(\s*(['"])?([\w-]+)\1?\s*\)(?=\s|$)/gi,
	var: /(?:^|\s)var\(\s*(['"])?(--[\w-]+)\1?\s*(,\s*([^)]+))?\s*\)(?=\s|$)/gi,
	url: /(?:^|\s)url\(\s*(?:(['"])([^\n\r\f]*)\1|([^\)\s]+))\s*\)(?=\s|$)/gi,
};

/*
	Validator to check CSS functions. If an empty array is given, it checks all CSS functions validators.
*/
export function checkCSSFunctions(allowedFunctions = [], cssValue) {
	if (!cssValue || !isArray(allowedFunctions)) {
		return null;
	}

	const availableFunctions = allowedFunctions.length
		? allowedFunctions
		: Object.keys(cssFunctionsRegex);

	const matchedFunctions = {};

	for (const functionName of availableFunctions) {
		const regexPattern = cssFunctionsRegex[functionName];
		if (regexPattern) {
			const matches = cssValue.match(regexPattern);

			if (matches && matches.length > 0) {
				matchedFunctions[functionName] = matches;
			}
		}
	}

	return Object.keys(matchedFunctions).length > 0 ? matchedFunctions : null;
}
