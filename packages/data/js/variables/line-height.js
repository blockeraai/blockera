// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import type { ValueAddon } from '../types/value-addon';
import { isBlockTheme, isString, isObject, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store';
import { parseVarString } from './utils';
import type { VariableItem } from './types';
import { normalizePresetSize } from './normalize-preset-sizes';
import { generateVariableString, getBlockEditorSettings } from './index';
import { getBlockeraExperimentalFeatures } from '../blockera-settings-paths';
import { getCustomGlobalStylePresetVariables } from './custom-global-style-presets';
import {
	PRESET_ORIGIN_REFERENCE,
	CUSTOM_ORIGIN_REFERENCE,
	getThemeVariableReference,
	mergeVariableItemsBySlug,
} from './merge-global-style-simple-presets';

export const getLineHeights = (): Array<VariableItem> => {
	if (isBlockTheme()) {
		const blockera = getBlockeraExperimentalFeatures(
			getBlockEditorSettings()?.__experimentalFeatures
		);
		const lineHeightsRoot = blockera?.blockeraLineHeights;

		if (!isUndefined(lineHeightsRoot)) {
			const themeRef = getThemeVariableReference();

			return mergeVariableItemsBySlug(
				[
					{
						items: lineHeightsRoot?.default,
						reference: PRESET_ORIGIN_REFERENCE,
					},
					{ items: lineHeightsRoot?.theme, reference: themeRef },
					{
						items: lineHeightsRoot?.custom,
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

	let reference = PRESET_ORIGIN_REFERENCE;

	if (isBlockTheme()) {
		reference = getThemeVariableReference();
	}

	const list = getBlockEditorSettings()?.lineHeights;

	if (!Array.isArray(list)) {
		return [];
	}

	return list.map((item) => ({
		name: item?.name || item.slug,
		id: item.slug,
		value: normalizePresetSize(item.size),
		reference,
	}));
};

export const getLineHeight = (id: string): ?VariableItem => {
	let lineHeight = getLineHeights().find((item) => item.id === id);

	if (isUndefined(lineHeight?.value)) {
		const { getVariableGroupItems } = select(STORE_NAME);

		lineHeight = getVariableGroupItems('', 'line-height').find(
			(item) => item.id === id
		);
	}

	if (isUndefined(lineHeight?.value)) {
		lineHeight = getCustomGlobalStylePresetVariables('line-height').find(
			(item) => item.id === id
		);
	}

	return lineHeight;
};

export const getLineHeightBy = (field: string, value: any): ?VariableItem =>
	getLineHeights().find((item) => item[field] === value);

export const getLineHeightVAFromIdString = (
	value: string
): ValueAddon | string => {
	const lineHeightVar = getLineHeight(value);

	if (lineHeightVar) {
		return {
			settings: {
				...lineHeightVar,
				type: 'line-height',
				var: generateVariableString({
					reference: lineHeightVar?.reference || {
						type: '',
					},
					type: 'line-height',
					id: lineHeightVar?.id || '',
				}),
			},
			name: lineHeightVar?.name || '',
			isValueAddon: true,
			valueType: 'variable',
		};
	}

	return value;
};

export const getLineHeightVAFromVarString = (
	value: string
): ValueAddon | string => {
	if (isString(value)) {
		const { id, varString } = parseVarString(value, 'line-height');

		if (id) {
			const lineHeightVA = getLineHeightVAFromIdString(id);

			if (isObject(lineHeightVA)) {
				return lineHeightVA;
			}

			if (lineHeightVA === id && varString) {
				return {
					settings: {
						name: id,
						id: value,
						value: `var(${varString})`,
						type: 'line-height',
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

export const getLineHeightVAStringFromId = (id: string): ?string => {
	const variableObject = getLineHeight(id);

	if (!variableObject) {
		return undefined;
	}

	return `var:preset|line-height|${id}`;
};
