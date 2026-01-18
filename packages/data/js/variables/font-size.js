// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';
import { isBlockTheme, isUndefined, isString, isObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store';
import { generateVariableString, getBlockEditorSettings } from './index';
import { parseVarString } from './utils';
import type { VariableItem } from './types';

export const getFontSizes: () => Array<VariableItem> = memoize(
	function (): Array<VariableItem> {
		let reference = {
			type: 'preset',
		};

		if (isBlockTheme()) {
			const { getCurrentTheme } = select('blockera/data');

			const {
				name: { rendered: themeName },
			} = getCurrentTheme();

			reference = {
				type: 'theme',
				theme: themeName,
			};
		}

		return getBlockEditorSettings().fontSizes.map((item) => {
			return {
				name: item?.name || item.slug,
				id: item.slug,
				value: item.size,
				fluid: item?.fluid || null,
				reference,
			};
		});
	}
);

export const getFontSize: (id: string) => ?VariableItem = memoize(function (
	id: string
): ?VariableItem {
	let fontSize = getFontSizes().find((item) => item.id === id);

	// If not, check if the font size is in the custom font sizes
	if (isUndefined(fontSize?.value)) {
		const { getVariableGroupItems } = select(STORE_NAME);

		fontSize = getVariableGroupItems('', 'font-size').find(
			(item) => item.id === id
		);
	}

	return fontSize;
});

export const getFontSizeBy: (field: string, value: any) => ?VariableItem =
	memoize(function (field: string, value: any): ?VariableItem {
		return getFontSizes().find((item) => item[field] === value);
	});

export const getFontSizeVAFromIdString: (value: string) => ValueAddon | string =
	memoize(function (value: string): ValueAddon | string {
		const fontSizeVar = getFontSize(value);

		if (fontSizeVar) {
			return {
				settings: {
					...fontSizeVar,
					type: 'font-size',
					var: generateVariableString({
						reference: fontSizeVar?.reference || {
							type: '',
						},
						type: 'font-size',
						id: fontSizeVar?.id || '',
					}),
				},
				name: fontSizeVar?.name || '',
				isValueAddon: true,
				valueType: 'variable',
			};
		}

		return value;
	});

export const getFontSizeVAFromVarString: (
	value: string
) => ValueAddon | string = memoize(function (
	value: string
): ValueAddon | string {
	if (isString(value)) {
		const { id, varString } = parseVarString(value, 'font-size');

		if (id) {
			const fontSizeVA = getFontSizeVAFromIdString(id);

			if (isObject(fontSizeVA)) {
				return fontSizeVA;
			}

			// same value means the variable not found but should be returned as not found
			if (fontSizeVA === id && varString) {
				return {
					settings: {
						name: id,
						id: value,
						value: `var(${varString})`,
						type: 'font-size',
						var: varString,
						fluid: null,
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
