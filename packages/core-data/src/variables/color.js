// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';

/**
 * Publisher dependencies
 */
import { isBlockTheme, isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './index';
import type { VariableItem } from './types';
import { getCurrentTheme } from '../index';

export const getColors: () => Array<VariableItem> = memoize(
	function (): Array<VariableItem> {
		let reference = {
			type: 'preset',
		};

		if (isBlockTheme()) {
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
