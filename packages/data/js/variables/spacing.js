// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isBlockTheme, isString, isObject, isUndefined } from '@blockera/utils';
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
import { normalizePresetSize } from './normalize-preset-sizes';
import { parseVarString } from './utils';
import type { VariableItem } from './types';

export const getSpacings = (): Array<VariableItem> => {
	if (isBlockTheme()) {
		const spacingSizes =
			getBlockEditorSettings()?.__experimentalFeatures?.spacing
				?.spacingSizes;

		if (!isUndefined(spacingSizes)) {
			const themeRef = getThemeVariableReference();

			return mergeVariableItemsBySlug(
				[
					{
						items: spacingSizes?.default,
						reference: PRESET_ORIGIN_REFERENCE,
					},
					{ items: spacingSizes?.theme, reference: themeRef },
					{
						items: spacingSizes?.custom,
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
						value: normalizePresetSize(item.size),
						reference,
					};
				}
			);
		}
	}

	const spaces =
		getBlockEditorSettings()?.__experimentalFeatures?.spacing?.spacingSizes
			?.default;

	if (isUndefined(spaces)) {
		return [];
	}

	return spaces.map((item) => ({
		name: item?.name || item.slug,
		id: item.slug,
		value: normalizePresetSize(item.size),
		reference: PRESET_ORIGIN_REFERENCE,
	}));
};

export const getSpacing = (id: string): ?VariableItem => {
	let spacing = getSpacings().find((item) => item.id === id);

	if (isUndefined(spacing?.value)) {
		const { getVariableGroupItems } = select(STORE_NAME);

		spacing = getVariableGroupItems('', 'spacing').find(
			(item) => item.id === id
		);
	}

	if (isUndefined(spacing?.value)) {
		spacing = getCustomGlobalStylePresetVariables('spacing').find(
			(item) => item.id === id
		);
	}

	return spacing;
};

export const getSpacingBy = (field: string, value: any): ?VariableItem =>
	getSpacings().find((item) => item[field] === value);

export const getSpacingVAFromIdString = (
	value: string
): ValueAddon | string => {
	const spacingVar = getSpacing(value);

	if (spacingVar) {
		return {
			settings: {
				...spacingVar,
				type: 'spacing',
				var: generateVariableString({
					reference: spacingVar?.reference || {
						type: '',
					},
					type: 'spacing',
					id: spacingVar?.id || '',
				}),
			},
			name: spacingVar?.name || '',
			isValueAddon: true,
			valueType: 'variable',
		};
	}

	return value;
};

export const getSpacingVAFromVarString = (
	value: string
): ValueAddon | string => {
	if (isString(value)) {
		const { id, varString } = parseVarString(value, 'spacing');

		if (id) {
			const spacingVA = getSpacingVAFromIdString(id);

			if (isObject(spacingVA)) {
				return spacingVA;
			}

			// same value means the variable not found but should be returned as not found
			if (spacingVA === id && varString) {
				return {
					settings: {
						name: id,
						id: value,
						value: `var(${varString})`,
						type: 'spacing',
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
