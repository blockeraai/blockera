// @flow

/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';

/**
 * Blockera dependencies
 */
import { isString, isObject } from '@blockera/utils';
import type { ValueAddon } from '../types/value-addon';
import { isValueAddonShape } from './value-addon-shape';

/**
 * Internal dependencies
 */
import { generateVariableString, parseVarString } from './utils';
import { getLinearGradient } from './linear-gradient';
import { getRadialGradient } from './radial-gradient';

export const getLinearGradientVAFromIdString: (
	value: string
) => ValueAddon | string = memoize(function (
	value: string
): ValueAddon | string {
	const colorVar = getLinearGradient(value);

	if (colorVar) {
		return {
			settings: {
				...colorVar,
				type: 'linear-gradient',
				var: generateVariableString({
					reference: colorVar?.reference || {
						type: '',
					},
					type: 'linear-gradient',
					id: colorVar?.id || '',
				}),
			},
			name: colorVar?.name || '',
			isValueAddon: true,
			valueType: 'variable',
		};
	}

	return value;
});

export const getRadialGradientVAFromIdString: (
	value: string
) => ValueAddon | string = memoize(function (
	value: string
): ValueAddon | string {
	const colorVar = getRadialGradient(value);

	if (colorVar) {
		return {
			settings: {
				...colorVar,
				type: 'radial-gradient',
				var: generateVariableString({
					reference: colorVar?.reference || {
						type: '',
					},
					type: 'radial-gradient',
					id: colorVar?.id || '',
				}),
			},
			name: colorVar?.name || '',
			isValueAddon: true,
			valueType: 'variable',
		};
	}

	return value;
});

export const getGradientVAFromVarString: (
	value: string
) => ValueAddon | string = memoize(function (
	value: string
): ValueAddon | string {
	if (isString(value)) {
		const { id, varString } = parseVarString(value, 'gradient');

		if (id) {
			let variable = getLinearGradientVAFromIdString(id);

			if (isObject(variable)) {
				return variable;
			}

			variable = getRadialGradientVAFromIdString(id);

			if (isObject(variable)) {
				return variable;
			}

			// same value means the variable not found but should be returned as not found
			if (variable === id && varString) {
				return {
					settings: {
						name: id,
						id: value,
						value: `var(${varString})`,
						type: 'linear-gradient',
						var: varString,
					},
					name: id,
					isValueAddon: true,
					valueType: 'variable',
				};
			}
		}
	}

	return value;
});

export const getGradientVAFromIdString: (value: string) => ValueAddon | string =
	memoize(function (value: string): ValueAddon | string {
		if (isString(value)) {
			const id = value;
			let variable = getLinearGradientVAFromIdString(id);

			if (isObject(variable)) {
				return variable;
			}

			variable = getRadialGradientVAFromIdString(id);

			if (isObject(variable)) {
				return variable;
			}
		}

		return value;
	});

export const getGradientType: (value: string | ValueAddon) => string = memoize(
	function (value: string | ValueAddon): string {
		//$FlowFixMe
		if (isValueAddonShape(value)) {
			//$FlowFixMe
			return value?.settings?.type;
		}

		//$FlowFixMe
		return value.includes('linear-gradient')
			? 'linear-gradient'
			: 'radial-gradient';
	}
);
