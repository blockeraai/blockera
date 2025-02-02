// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';
import { select } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { isBlockTheme, isString, isUndefined } from '@blockera/utils';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store';
import { generateVariableString, getBlockEditorSettings } from './index';
import type { VariableItem } from './types';

export const getColors: () => Array<VariableItem> = memoize(
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
				getBlockEditorSettings()?.__experimentalFeatures?.color?.palette
					?.theme !== undefined
			) {
				return getBlockEditorSettings()?.__experimentalFeatures?.color?.palette?.theme.map(
					(item) => {
						return {
							name: item?.name || item.slug,
							id: item.slug,
							value: item.color,
							reference,
						};
					}
				);
			}
		} else if (!isUndefined(getBlockEditorSettings()?.colors)) {
			const { getCurrentTheme } = select('blockera/data');

			const theme = getCurrentTheme();

			reference = {
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
					reference,
				};
			}
		);
	}
);

export const getColorsTitle: () => string = memoize(function (): string {
	if (isBlockTheme()) {
		if (
			!isUndefined(
				getBlockEditorSettings()?.__experimentalFeatures?.color?.palette
					?.theme
			)
		) {
			const { getCurrentTheme } = select('blockera/data');

			const {
				name: { rendered: themeName },
			} = getCurrentTheme();

			return sprintf(
				// translators: it's the product name (a theme or plugin name)
				__('%s Colors', 'blockera'),
				themeName
			);
		}
	} else if (!isUndefined(getBlockEditorSettings()?.colors)) {
		const { getCurrentTheme } = select('blockera/data');

		const theme = getCurrentTheme();

		if (!isUndefined(theme?.name?.rendered)) {
			return sprintf(
				// translators: it's the product name (a theme or plugin name)
				__('%s Color Palette', 'blockera'),
				theme?.name?.rendered
			);
		}
	}

	return __('Editor Colors', 'blockera');
});

export const getColor: (id: string) => ?VariableItem = memoize(function (
	id: string
): ?VariableItem {
	// First, check if the color is in the default colors of theme or editor
	let color = getColors().find((item) => item.id === id);

	// If not, check if the color is in the custom colors
	if (isUndefined(color?.value)) {
		const { getVariableGroupItems } = select(STORE_NAME);

		color = getVariableGroupItems('', 'color').find(
			(item) => item.id === id
		);
	}

	return color;
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
