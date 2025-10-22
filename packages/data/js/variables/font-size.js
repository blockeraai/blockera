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
import { STORE_NAME } from '../store';
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
				name: item?.name || item.slug,
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
	let fontSize = getFontSizes().find((item) => item.id === id);

	// If not, check if the font size is in the custom font sizes
	if (isUndefined(fontSize?.value)) {
		const { getVariableGroupItems } = select(STORE_NAME);

		fontSize = getVariableGroupItems('', 'font-size').find(
			(item) => item.id === id
		);
	}

	return fontSize;
});

export const getFontSizeBy: (field: string, value: any) => ?VariableItem =
	memoize(function (field: string, value: any): ?VariableItem {
		return getFontSizes().find((item) => item[field] === value);
	});
