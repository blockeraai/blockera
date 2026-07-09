// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isBlockTheme, isString, isUndefined, isObject } from '@blockera/utils';
import type { ValueAddon } from '../types/value-addon';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store';
import { getCustomGlobalStylePresetVariables } from './custom-global-style-presets';
import {
	CUSTOM_ORIGIN_REFERENCE,
	PRESET_ORIGIN_REFERENCE,
	getThemeVariableReference,
	mergeVariableItemsBySlug,
} from './merge-global-style-simple-presets';
import { generateVariableString, getBlockEditorSettings } from './index';
import { parseVarString } from './utils';
import type { VariableItem } from './types';

export const getColors = (): Array<VariableItem> => {
	if (isBlockTheme()) {
		const palette =
			getBlockEditorSettings()?.__experimentalFeatures?.color?.palette;

		if (!isUndefined(palette)) {
			const themeRef = getThemeVariableReference();

			return mergeVariableItemsBySlug(
				[
					{
						items: palette?.default,
						reference: PRESET_ORIGIN_REFERENCE,
					},
					{ items: palette?.theme, reference: themeRef },
					{
						items: palette?.custom,
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

					return {
						name: item?.name || id,
						id,
						value: item.color,
						reference,
					};
				}
			);
		}
	} else if (!isUndefined(getBlockEditorSettings()?.colors)) {
		const { getCurrentTheme } = select('blockera/data');

		const theme = getCurrentTheme();

		const reference = {
			type: 'theme',
			theme: theme?.name?.rendered || '',
		};

		return getBlockEditorSettings()?.colors.map((item) => {
			return {
				name: item?.name || item.slug,
				id: item.slug,
				value: item.color,
				reference,
			};
		});
	}

	if (
		isUndefined(
			getBlockEditorSettings()?.__experimentalFeatures?.color?.palette
				?.default
		)
	) {
		return [];
	}

	return getBlockEditorSettings()?.__experimentalFeatures?.color?.palette?.default.map(
		(item) => {
			return {
				name: item?.name || item.slug,
				id: item.slug,
				value: item.color,
				reference: PRESET_ORIGIN_REFERENCE,
			};
		}
	);
};

export const getColor = (id: string): ?VariableItem => {
	// First, check if the color is in the default colors of theme or editor
	let color = getColors().find((item) => item.id === id);

	// If not, check if the color is in the custom colors
	if (isUndefined(color?.value)) {
		const { getVariableGroupItems } = select(STORE_NAME);

		color = getVariableGroupItems('', 'color').find(
			(item) => item.id === id
		);
	}

	if (isUndefined(color?.value)) {
		color = getCustomGlobalStylePresetVariables('color').find(
			(item) => item.id === id
		);
	}

	return color;
};

export const getColorBy = (field: string, value: any): ?VariableItem =>
	getColors().find((item) => item[field] === value);

export const getColorVAFromIdString = (value: string): ValueAddon | string => {
	const colorVar = getColor(value);

	if (colorVar) {
		return {
			settings: {
				...colorVar,
				type: 'color',
				var: generateVariableString({
					reference: colorVar?.reference || {
						type: '',
					},
					type: 'color',
					id: colorVar?.id || '',
				}),
			},
			name: colorVar?.name || '',
			isValueAddon: true,
			valueType: 'variable',
		};
	}

	return value;
};

export const getColorVAFromVarString = (value: string): ValueAddon | string => {
	if (isString(value)) {
		const { id, varString } = parseVarString(value, 'color');

		if (id) {
			const colorVA = getColorVAFromIdString(id);

			if (isObject(colorVA)) {
				return colorVA;
			}

			// same value means the variable not found but should be returned as not found
			if (colorVA === id && varString) {
				return {
					settings: {
						name: id,
						id: value,
						value: `var(${varString})`,
						type: 'color',
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
};
