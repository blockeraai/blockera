import { isString, isArray } from '@publisher/utils';

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
			'unset',
			'revert-layer',
			'revert',
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

		case 'padding':
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

		case 'margin':
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
			];
			break;

		case 'order':
			cssUnits = [
				{ value: '-', label: '-', default: 0 },
				//
				{ value: 'revert', label: 'Revert', default: 0 },
				{ value: 'revert-layer', label: 'Revert Layer', default: 0 },
				{ value: 'inherit', label: 'Inherit', default: 0 },
				{ value: 'initial', label: 'Initial', default: 0 },
				{ value: 'unset', label: 'Unset', default: 0 },
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

/**
 * Checks if a string contains multiple CSS function names and applies logical 'OR' between matches.
 *
 * @param {string} value - The input string to search for CSS functions.
 * @param {Array<string>} cssFunctionNames - An array of CSS function names to search for.
 * @return {Object|null} - Object with matched CSS functions or null if no matches are found.
 */

export function checkCSSFunctions(cssFunctionNames, value) {
	if (!value || !isArray(cssFunctionNames)) {
		return null;
	}

	const matchedFunctions = {};
	for (const functionName of cssFunctionNames) {
		const regex = cssFunctionsRegex[functionName];
		if (regex) {
			const matches = value.match(regex);
			if (matches && matches.length > 0) {
				matchedFunctions[functionName] = matches;
			}
		}
	}

	return Object.keys(matchedFunctions).length > 0 ? matchedFunctions : null;
}
