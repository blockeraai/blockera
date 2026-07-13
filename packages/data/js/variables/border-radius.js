// @flow

/**
 * Blockera dependencies
 */
import { isObject, isString } from '@blockera/utils';
import type { ValueAddon } from '../types/value-addon';

/**
 * Internal dependencies
 */
import {
	getGlobalStylePresetVariableById,
	getMergedGlobalStylePresetVariables,
} from './custom-global-style-presets';
import { generateVariableString, parseVarString } from './utils';
import type { VariableItem } from './types';

export const getBorderRadii = (): Array<VariableItem> =>
	getMergedGlobalStylePresetVariables('border-radius');

export const getBorderRadius = (id: string): ?VariableItem =>
	getGlobalStylePresetVariableById('border-radius', id);

export const getBorderRadiusBy = (field: string, value: mixed): ?VariableItem =>
	getBorderRadii().find((item) => item[field] === value);

export const getBorderRadiusVAFromIdString = (
	value: string
): ValueAddon | string => {
	const borderRadiusVar = getBorderRadius(value);

	if (borderRadiusVar) {
		return {
			settings: {
				...borderRadiusVar,
				type: 'border-radius',
				var: generateVariableString({
					reference: borderRadiusVar?.reference || {
						type: '',
					},
					type: 'border-radius',
					id: borderRadiusVar?.id || '',
				}),
			},
			name: borderRadiusVar?.name || '',
			isValueAddon: true,
			valueType: 'variable',
		};
	}

	return value;
};

export const getBorderRadiusVAFromVarString = (
	value: string
): ValueAddon | string => {
	if (isString(value)) {
		const { id, varString } = parseVarString(value, 'border-radius');

		if (id) {
			const borderRadiusVA = getBorderRadiusVAFromIdString(id);

			if (isObject(borderRadiusVA)) {
				return borderRadiusVA;
			}

			if (borderRadiusVA === id && varString) {
				return {
					settings: {
						name: id,
						id: value,
						value: `var(${varString})`,
						type: 'border-radius',
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

export const getBorderRadiusVAStringFromId = (id: string): ?string => {
	if (!id) {
		return undefined;
	}

	return `var:preset|border-radius|${id}`;
};
