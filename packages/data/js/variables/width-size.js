// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import type { ValueAddon } from '../types/value-addon';
import { isString, isUndefined, isObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store';
import { getBlockEditorSettings } from './index';
import type { VariableItem } from './types';
import { generateVariableString, parseVarString } from './utils';
import { getBlockeraExperimentalFeatures } from '../blockera-settings-paths';
import { normalizePresetSize } from './normalize-preset-sizes';
import { CUSTOM_ORIGIN_REFERENCE } from './merge-global-style-simple-presets';

export const getWidthSizes = (): Array<VariableItem> | [] => {
	const reference = {
		type: 'preset',
	};

	const features = getBlockEditorSettings()?.__experimentalFeatures;
	const layout = features?.layout;

	const items = [];

	if (isUndefined(layout)) {
		return items;
	}

	if (!isUndefined(layout?.contentSize)) {
		items.push({
			name: __('Content Width', 'blockera'),
			id: 'contentSize',
			value: layout?.contentSize,
			reference,
		});
	}

	if (!isUndefined(layout?.wideSize)) {
		items.push({
			name: __('Site Wide Width', 'blockera'),
			id: 'wideSize',
			value: layout?.wideSize,
			reference,
		});
	}

	const customWidthSizes =
		getBlockeraExperimentalFeatures(features)?.blockeraWidthSizes?.custom;
	if (Array.isArray(customWidthSizes)) {
		for (const raw of customWidthSizes) {
			if (!raw || raw.slug === undefined || raw.slug === null) {
				continue;
			}
			const id = String(raw.slug);
			if (!id) {
				continue;
			}
			items.push({
				name: raw?.name || id,
				id,
				value: normalizePresetSize(raw.size || ''),
				reference: CUSTOM_ORIGIN_REFERENCE,
			});
		}
	}

	return items;
};

export const getWidthSize = (id: string): ?VariableItem => {
	let widthSize = getWidthSizes().find((item) => item.id === id);

	// If not, check if the color is in the custom colors
	if (isUndefined(widthSize?.value)) {
		const { getVariableGroupItems } = select(STORE_NAME);

		widthSize = getVariableGroupItems('', 'width-size').find(
			(item) => item.id === id
		);
	}

	return widthSize;
};

export const getWidthSizeBy = (field: string, value: any): ?VariableItem =>
	getWidthSizes().find((item) => item[field] === value);

export const getWidthSizeVAFromIdString = (
	value: string
): ValueAddon | string => {
	const widthSizeVar = getWidthSize(value);

	if (widthSizeVar) {
		return {
			settings: {
				...widthSizeVar,
				type: 'width-size',
				var: generateVariableString({
					reference: widthSizeVar?.reference || {
						type: '',
					},
					type: 'width-size',
					id: widthSizeVar?.id || '',
				}),
			},
			name: widthSizeVar?.name || '',
			isValueAddon: true,
			valueType: 'variable',
		};
	}

	return value;
};

export const getWidthSizeVAFromVarString = (
	value: string
): ValueAddon | string => {
	if (isString(value)) {
		const { id, varString } = parseVarString(value, 'width-size');

		if (id) {
			const widthSizeVA = getWidthSizeVAFromIdString(id);

			if (isObject(widthSizeVA)) {
				return widthSizeVA;
			}

			if (widthSizeVA === id && varString) {
				return {
					settings: {
						name: id,
						id: value,
						value: `var(${varString})`,
						type: 'width-size',
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
