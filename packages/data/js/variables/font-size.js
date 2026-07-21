// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';
import { isBlockTheme, isUndefined, isString, isObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { ValueAddonReference } from '../types';
import { STORE_NAME } from '../store';
import { getCustomGlobalStylePresetVariables } from './custom-global-style-presets';
import {
	CUSTOM_ORIGIN_REFERENCE,
	PRESET_ORIGIN_REFERENCE,
	getThemeVariableReference,
	mergeVariableItemsBySlug,
} from './merge-global-style-simple-presets';
import { generateVariableString, getBlockEditorSettings } from './index';
import {
	normalizeFontSizeFluid,
	normalizePresetSize,
} from './normalize-preset-sizes';
import { parseVarString } from './utils';
import type { VariableItem } from './types';

export const getFontSizes = (): Array<VariableItem> => {
	if (isBlockTheme()) {
		const fontSizesRoot =
			getBlockEditorSettings()?.__experimentalFeatures?.typography
				?.fontSizes;

		if (!isUndefined(fontSizesRoot)) {
			const themeRef = getThemeVariableReference();

			return mergeVariableItemsBySlug(
				[
					{
						items: fontSizesRoot?.default,
						reference: PRESET_ORIGIN_REFERENCE,
					},
					{ items: fontSizesRoot?.theme, reference: themeRef },
					{
						items: fontSizesRoot?.custom,
						reference: CUSTOM_ORIGIN_REFERENCE,
					},
				],
				(item, reference) => {
					if (
						!item ||
						item.slug === undefined ||
						item.slug === null
					) {
						return null;
					}

					const id = String(item.slug);

					if (!id) {
						return null;
					}

					const row: VariableItem = {
						name: item?.name || id,
						id,
						value: normalizePresetSize(item.size),
						reference,
					};

					if (item?.fluid) {
						row.fluid = normalizeFontSizeFluid(item.fluid);
					}

					return row;
				}
			);
		}
	}

	let reference: ValueAddonReference = PRESET_ORIGIN_REFERENCE;

	if (isBlockTheme()) {
		reference = getThemeVariableReference();
	}

	const list = getBlockEditorSettings()?.fontSizes;

	if (!Array.isArray(list)) {
		return [];
	}

	return list.map((item) => ({
		name: item?.name || item.slug,
		id: item.slug,
		value: normalizePresetSize(item.size),
		fluid: item?.fluid ? normalizeFontSizeFluid(item.fluid) : null,
		reference,
	}));
};

export const getFontSize = (id: string): ?VariableItem => {
	let fontSize = getFontSizes().find((item) => item.id === id);

	// If not, check if the font size is in the custom font sizes
	if (isUndefined(fontSize?.value)) {
		const { getVariableGroupItems } = select(STORE_NAME);

		fontSize = getVariableGroupItems('', 'font-size').find(
			(item) => item.id === id
		);
	}

	if (isUndefined(fontSize?.value)) {
		fontSize = getCustomGlobalStylePresetVariables('font-size').find(
			(item) => item.id === id
		);
	}

	return fontSize;
};

export const getFontSizeBy = (field: string, value: any): ?VariableItem =>
	getFontSizes().find((item) => item[field] === value);

export const getFontSizeVAFromIdString = (
	value: string
): ValueAddon | string => {
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
};

export const getFontSizeVAFromVarString = (
	value: string
): ValueAddon | string => {
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
};

export const getFontSizeVAStringFromId = (id: string): ?string => {
	const variableObject = getFontSize(id);

	if (!variableObject) {
		return undefined;
	}

	return `var:preset|font-size|${id}`;
};
