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
import {
	generateVariableString,
	generateVariableStringFromAttributeVarString,
} from './utils';
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
		let id: string | null = null;
		let varString: string | null = null;

		// Handle var: pattern (e.g., "var:preset|gradient|accent-1-to-accent-2")
		if (value.startsWith('var:')) {
			id = value.split('|')[2];
			varString = generateVariableStringFromAttributeVarString(value);
		}
		// Handle CSS var() pattern (e.g., "var(--wp--preset--gradient--accent-1-to-accent-2)")
		else if (value.startsWith('var(--wp--preset--gradient--')) {
			// Extract the ID from the CSS variable name
			// Pattern: var(--wp--preset--gradient--{id}) or var(--wp--preset--gradient--{id}
			// Handles cases with or without closing parenthesis
			const match = value.match(
				/^var\(--wp--preset--gradient--([^,)]+)(?:[,)]|$)/
			);
			if (match && match[1]) {
				id = match[1];
				varString = `--wp--preset--gradient--${id}`;
			}
		}

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
