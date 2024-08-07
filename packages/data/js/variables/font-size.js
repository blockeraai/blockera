// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';
import { select } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { isBlockTheme } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { getBlockEditorSettings } from './index';
import type { VariableItem } from './types';

export const getFontSizes: () => Array<VariableItem> = memoize(
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
		}

		return getBlockEditorSettings().fontSizes.map((item) => {
			return {
				name: item.name,
				id: item.slug,
				value: item.size,
				fluid: item?.fluid || null,
				reference,
			};
		});
	}
);

export const getFontSize: (id: string) => ?VariableItem = memoize(function (
	id: string
): ?VariableItem {
	return getFontSizes().find((item) => item.id === id);
});

export const getFontSizeBy: (field: string, value: any) => ?VariableItem =
	memoize(function (field: string, value: any): ?VariableItem {
		return getFontSizes().find((item) => item[field] === value);
	});
