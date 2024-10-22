// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSettings } from '@wordpress/block-editor';

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';
import type { TNativeOption } from '@blockera/controls/js/libs/select-control/types/control-types';

export const getFontFamilies = function (): Array<TNativeOption> {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [editorFontFamilies] = useSettings('typography.fontFamilies');

	const fontFamilies: Array<Object> = [
		{
			label: __('Default', 'blockera'),
			value: '',
		},
	];

	if (!isUndefined(editorFontFamilies.theme)) {
		fontFamilies.push({
			type: 'optgroup',
			label: __('Theme Fonts', 'blockera'),
			options: editorFontFamilies.theme.map((item) => {
				return {
					label: item.name,
					value: item.slug,
				};
			}),
		});
	}

	if (!isUndefined(editorFontFamilies.custom)) {
		fontFamilies.push({
			type: 'optgroup',
			label: __('Custom Fonts', 'blockera'),
			options: editorFontFamilies.custom.map((item) => {
				return {
					label: item.name,
					value: item.slug,
				};
			}),
		});
	}

	return fontFamilies;
};
