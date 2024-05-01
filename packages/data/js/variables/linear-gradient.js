// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isBlockTheme, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './index';
import type { VariableItem } from './types';

export const getLinearGradients: () => Array<VariableItem> = memoize(
	function () {
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

			return getBlockEditorSettings()
				?.__experimentalFeatures?.color?.gradients?.theme.filter(
					(item) => item.gradient.startsWith('linear-gradient')
				)
				.map((item) => {
					return {
						name: item.name,
						id: item.slug,
						value: item.gradient,
						reference,
					};
				});
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
				item.gradient.startsWith('linear-gradient')
			)
			.map((item) => {
				return {
					name: item.name,
					id: item.slug,
					value: item.gradient,
					reference,
				};
			});
	}
);

export const getLinearGradient: (id: string) => ?VariableItem = memoize(
	function (id: string): ?VariableItem {
		return getLinearGradients().find((item) => item.id === id);
	}
);

export const getLinearGradientBy: (field: string, value: any) => ?VariableItem =
	memoize(function (field: string, value: any): ?VariableItem {
		return getLinearGradients().find((item) => item[field] === value);
	});
