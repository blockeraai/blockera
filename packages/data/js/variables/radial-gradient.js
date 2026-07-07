// @flow
/**
 * External dependencies
 */
/**
 * Blockera dependencies
 */
import { isBlockTheme, isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getCustomGlobalStylePresetVariables } from './custom-global-style-presets';
import {
	CUSTOM_ORIGIN_REFERENCE,
	PRESET_ORIGIN_REFERENCE,
	getThemeVariableReference,
	mergeVariableItemsBySlug,
} from './merge-global-style-simple-presets';
import { getBlockEditorSettings } from './index';
import type { VariableItem } from './types';

export const getRadialGradients = (): Array<VariableItem> => {
	if (isBlockTheme()) {
		const gradients =
			getBlockEditorSettings()?.__experimentalFeatures?.color?.gradients;

		if (!isUndefined(gradients)) {
			const themeRef = getThemeVariableReference();

			return mergeVariableItemsBySlug(
				[
					{
						items: gradients?.default,
						reference: PRESET_ORIGIN_REFERENCE,
					},
					{ items: gradients?.theme, reference: themeRef },
					{
						items: gradients?.custom,
						reference: CUSTOM_ORIGIN_REFERENCE,
					},
				],
				(item, reference) => {
					if (
						!item?.gradient ||
						!item.gradient.startsWith('radial-gradient')
					) {
						return null;
					}

					if (item.slug === undefined || item.slug === null) {
						return null;
					}

					const id = String(item.slug);

					if (!id) {
						return null;
					}

					return {
						name: item?.name || id,
						id,
						value: item.gradient,
						reference,
					};
				}
			);
		}
	}

	if (
		isUndefined(
			getBlockEditorSettings()?.__experimentalFeatures?.color?.gradients
				?.default
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
				reference: PRESET_ORIGIN_REFERENCE,
			};
		});
};

export const getRadialGradient = (id: string): ?VariableItem => {
	let gradient = getRadialGradients().find((item) => item.id === id);

	if (isUndefined(gradient?.value)) {
		gradient = getCustomGlobalStylePresetVariables('radial-gradient').find(
			(item) => item.id === id
		);
	}

	return gradient;
};

export const getRadialGradientBy = (field: string, value: any): ?VariableItem =>
	getRadialGradients().find((item) => item[field] === value);
