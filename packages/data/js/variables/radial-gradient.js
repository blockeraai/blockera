// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';
import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { isBlockTheme, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './index';
import type { VariableItem } from './types';

// eslint-disable-next-line no-unused-vars
export const getRadialGradients: () => Array<VariableItem> = memoize(
	function () {
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
				!isUndefined(
					getBlockEditorSettings()?.__experimentalFeatures?.color
						?.gradients?.theme
				)
			) {
				return getBlockEditorSettings()
					?.__experimentalFeatures?.color?.gradients?.theme.filter(
						(item) => item.gradient.startsWith('radial-gradient')
					)
					.map((item) => {
						return {
							name: item?.name || item.slug,
							id: item.slug,
							value: item.gradient,
							reference,
						};
					});
			}
		}

		if (
			isUndefined(
				getBlockEditorSettings()?.__experimentalFeatures?.color
					?.gradients?.default
			)
		) {
			return [];
		}

		return getBlockEditorSettings()
			?.__experimentalFeatures?.color?.gradients?.default.filter((item) =>
				item.gradient.startsWith('radial-gradient')
			)
			.map((item) => {
				return {
					name: item?.name || item.slug,
					id: item.slug,
					value: item.gradient,
					reference,
				};
			});
	}
);

export const getRadialGradientsTitle: () => string = memoize(function () {
	if (isBlockTheme()) {
		if (
			!isUndefined(
				getBlockEditorSettings()?.__experimentalFeatures?.color
					?.gradients?.theme
			)
		) {
			return __('Theme Radial Gradients', 'blockera');
		}
	}

	return __('Editor Radial Gradients', 'blockera');
});

export const getRadialGradient: (id: string) => ?VariableItem = memoize(
	function (id: string): ?VariableItem {
		return getRadialGradients().find((item) => item.id === id);
	}
);

export const getRadialGradientBy: (field: string, value: any) => ?VariableItem =
	memoize(function (field: string, value: any): ?VariableItem {
		return getRadialGradients().find((item) => item[field] === value);
	});
