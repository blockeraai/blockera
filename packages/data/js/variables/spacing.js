// @flow

/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isBlockTheme, isString, isObject, isUndefined } from '@blockera/utils';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store';
import { getCustomGlobalStylePresetVariables } from './custom-global-style-presets';
import { generateVariableString, getBlockEditorSettings } from './index';
import { parseVarString } from './utils';
import type { VariableItem } from './types';

export const getSpacings: () => Array<VariableItem> = memoize(
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

			if (
				getBlockEditorSettings()?.__experimentalFeatures?.spacing
					?.spacingSizes?.theme !== undefined
			) {
				return getBlockEditorSettings()?.__experimentalFeatures?.spacing?.spacingSizes?.theme.map(
					(item) => {
						return {
							name: item?.name || item.slug,
							id: item.slug,
							value: item.size,
							reference,
						};
					}
				);
			}
		}

		const spaces =
			getBlockEditorSettings()?.__experimentalFeatures?.spacing
				?.spacingSizes?.default;

		if (isUndefined(spaces)) {
			return [];
		}

		return spaces.map((item) => {
			return {
				name: item?.name || item.slug,
				id: item.slug,
				value: item.size,
			};
		});
	}
);

export const getSpacing: (id: string) => ?VariableItem = memoize(function (
	id: string
): ?VariableItem {
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
});

export const getSpacingBy: (field: string, value: any) => ?VariableItem =
	memoize(function (field: string, value: any): ?VariableItem {
		return getSpacings().find((item) => item[field] === value);
	});

export const getSpacingVAFromIdString: (value: string) => ValueAddon | string =
	memoize(function (value: string): ValueAddon | string {
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
	});

export const getSpacingVAFromVarString: (value: string) => ValueAddon | string =
	memoize(function (value: string): ValueAddon | string {
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
	});
