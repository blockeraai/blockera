// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isBlockTheme, isString, isUndefined } from '@blockera/utils';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

/**
 * Internal dependencies
 */
import { generateVariableString, getBlockEditorSettings } from './index';
import type { VariableItem } from './types';

export const getColors: () => Array<VariableItem> = memoize(
	function (): Array<VariableItem> {
		let reference = {
			type: 'preset',
		};

		if (isBlockTheme()) {
			const { getCurrentTheme } = select('blockera-core/data');

			const {
				name: { rendered: themeName },
			} = getCurrentTheme();

			reference = {
				type: 'theme',
				theme: themeName,
			};

			return getBlockEditorSettings()?.__experimentalFeatures?.color?.palette?.theme.map(
				(item) => {
					return {
						name: item.name,
						id: item.slug,
						value: item.color,
						reference,
					};
				}
			);
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
					name: item.name,
					id: item.slug,
					value: item.color,
					reference,
				};
			}
		);
	}
);

export const getColor: (id: string) => ?VariableItem = memoize(function (
	id: string
): ?VariableItem {
	return getColors().find((item) => item.id === id);
});

export const getColorBy: (field: string, value: any) => ?VariableItem = memoize(
	function (field: string, value: any): ?VariableItem {
		return getColors().find((item) => item[field] === value);
	}
);

export const getColorVAFromIdString: (value: string) => ValueAddon | string =
	memoize(function (value: string): ValueAddon | string {
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
	});

export const getColorVAFromVarString: (value: string) => ValueAddon | string =
	memoize(function (value: string): ValueAddon | string {
		if (isString(value) && value.startsWith('var:')) {
			return getColorVAFromIdString(value.split('|')[2]);
		}

		return value;
	});
