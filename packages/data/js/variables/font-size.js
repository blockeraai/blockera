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
import { isBlockTheme, isUndefined, isString } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store';
import {
	generateVariableString,
	getBlockEditorSettings,
	generateVariableStringFromAttributeVarString,
} from './index';
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
	if (isString(value) && value.startsWith('var:')) {
		const varId = value.split('|')[2];
		const fontSizeVA = getFontSizeVAFromIdString(varId);

		// same value means the variable not found but should be returned as not found
		if (fontSizeVA === varId) {
			const varString =
				generateVariableStringFromAttributeVarString(value);

			return {
				settings: {
					name: varId,
					id: value,
					value: `var(${varString})`,
					type: 'font-size',
					var: varString,
				},
				name: varId,
				isValueAddon: true,
				valueType: 'variable',
			};
		}

		return fontSizeVA;
	}

	return value;
});
