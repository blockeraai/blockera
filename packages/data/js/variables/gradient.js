// @flow

/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';

/**
 * Blockera dependencies
 */
import { isString, isObject } from '@blockera/utils';
import { isValid } from '@blockera/controls/js/value-addons/utils';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

/**
 * Internal dependencies
 */
import { generateVariableString } from './utils';
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
	if (isString(value) && value.startsWith('var:')) {
		const id = value.split('|')[2];
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
		if (isValid(value)) {
			//$FlowFixMe
			return value?.settings?.type;
		}

		//$FlowFixMe
		return value.includes('linear-gradient')
			? 'linear-gradient'
			: 'radial-gradient';
	}
);
