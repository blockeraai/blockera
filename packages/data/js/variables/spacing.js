// @flow

/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isBlockTheme, isUndefined, isString } from '@blockera/utils';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

/**
 * Internal dependencies
 */
import { generateVariableString, getBlockEditorSettings } from './index';
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

			return getBlockEditorSettings()?.__experimentalFeatures?.spacing?.spacingSizes?.theme.map(
				(item) => {
					return {
						name: item.name,
						id: item.slug,
						value: item.size,
						reference,
					};
				}
			);
		}

		const spaces =
			getBlockEditorSettings()?.__experimentalFeatures?.spacing
				?.spacingSizes?.default;

		if (isUndefined(spaces)) {
			return [];
		}

		return spaces.map((item) => {
			return {
				name: item.name,
				id: item.slug,
				value: item.size,
			};
		});
	}
);

export const getSpacing: (id: string) => ?VariableItem = memoize(function (
	id: string
): ?VariableItem {
	return getSpacings().find((item) => item.id === id);
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
		if (isString(value) && value.startsWith('var:')) {
			return getSpacingVAFromIdString(value.split('|')[2]);
		}

		return value;
	});
