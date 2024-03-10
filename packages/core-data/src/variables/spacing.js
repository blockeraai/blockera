// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './index';
import type { VariableItem } from './types';

/**
 * Publisher dependencies
 */
import { isBlockTheme, isUndefined } from '@publisher/utils';

export const getSpacings: () => Array<VariableItem> = memoize(
	function (): Array<VariableItem> {
		let reference = {
			type: 'preset',
		};

		if (isBlockTheme()) {
			const { getCurrentTheme } = select('publisher-core/data');

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
