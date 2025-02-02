// @flow
/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';
import { select } from '@wordpress/data';
import { sprintf, __ } from '@wordpress/i18n';

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

export const getFontSizesTitle: () => string = memoize(function (): string {
	const defaultFontSizes = [
		{
			slug: 'small',
			size: '13px',
		},
		{
			slug: 'medium',
			size: '20px',
		},
		{
			slug: 'large',
			size: '36px',
		},
		{
			slug: 'x-large',
			size: '42px',
		},
	];

	const currentFontSizes = getBlockEditorSettings().fontSizes;

	// Check if current sizes match default sizes (ignoring the name property)
	const isDefaultSizes = defaultFontSizes.every((defaultSize) =>
		currentFontSizes.some(
			(currentSize) =>
				defaultSize.slug === currentSize.slug &&
				defaultSize.size === currentSize.size
		)
	);

	if (!isDefaultSizes) {
		const { getCurrentTheme } = select('blockera/data');
		const {
			name: { rendered: themeName },
		} = getCurrentTheme();

		return sprintf(
			// translators: it's the product name (a theme or plugin name)
			__('%s Font Sizes', 'blockera'),
			themeName
		);
	}

	return __('Editor Font Sizes', 'blockera');
});
