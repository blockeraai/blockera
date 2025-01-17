// @flow
/**
 * External dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { useSettings } from '@wordpress/block-editor';

/**
 * Blockera dependencies
 */
import { isUndefined, isObject } from '@blockera/utils';
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

	if (!isUndefined(editorFontFamilies?.theme)) {
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

	if (!isUndefined(editorFontFamilies?.custom)) {
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

export const fontAppearancesOptions: Array<TNativeOption> = [
	{
		label: __('Default', 'blockera'),
		value: '',
	},
	{
		type: 'optgroup',
		label: __('Normal Style', 'blockera'),
		value: '',
		options: [
			{
				label: _x('100 - Thin', 'font weight', 'blockera'),
				value: '100-normal',
			},
			{
				label: _x('200 - Extra Light', 'font weight', 'blockera'),
				value: '200-normal',
			},
			{
				label: _x('300 - Light', 'font weight', 'blockera'),
				value: '300-normal',
			},
			{
				label: _x('400 - Regular', 'font weight', 'blockera'),
				value: '400-normal',
			},
			{
				label: _x('500 - Medium', 'font weight', 'blockera'),
				value: '500-normal',
			},
			{
				label: _x('600 - Semi Bold', 'font weight', 'blockera'),
				value: '600-normal',
			},
			{
				label: _x('700 - Bold', 'font weight', 'blockera'),
				value: '700-normal',
			},
			{
				label: _x('800 - Extra Bold', 'font weight', 'blockera'),
				value: '800-normal',
			},
			{
				label: _x('900 - Black', 'font weight', 'blockera'),
				value: '900-normal',
			},
			{
				label: _x('1000 - Extra Black', 'font weight', 'blockera'),
				value: '1000-normal',
			},
		],
	},
	{
		type: 'optgroup',
		label: 'Italic Style',
		value: '',
		options: [
			{
				label:
					_x('100 - Thin', 'font weight', 'blockera') +
					' - ' +
					__('Italic', 'blockera'),
				value: '100-italic',
			},
			{
				label:
					_x('200 - Extra Light', 'font weight', 'blockera') +
					' - ' +
					__('Italic', 'blockera'),
				value: '200-italic',
			},
			{
				label:
					_x('300 - Light', 'font weight', 'blockera') +
					' - ' +
					__('Italic', 'blockera'),
				value: '300-italic',
			},
			{
				label:
					_x('400 - Regular', 'font weight', 'blockera') +
					' - ' +
					__('Italic', 'blockera'),
				value: '400-italic',
			},
			{
				label:
					_x('500 - Medium', 'font weight', 'blockera') +
					' - ' +
					__('Italic', 'blockera'),
				value: '500-italic',
			},
			{
				label:
					_x('600 - Semi Bold', 'font weight', 'blockera') +
					' - ' +
					__('Italic', 'blockera'),
				value: '600-italic',
			},
			{
				label:
					_x('700 - Bold', 'font weight', 'blockera') +
					' - ' +
					__('Italic', 'blockera'),
				value: '700-italic',
			},
			{
				label:
					_x('800 - Extra Bold', 'font weight', 'blockera') +
					' - ' +
					__('Italic', 'blockera'),
				value: '800-italic',
			},
			{
				label:
					_x('900 - Black', 'font weight', 'blockera') +
					' - ' +
					__('Italic', 'blockera'),
				value: '900-italic',
			},
			{
				label:
					_x('1000 - Extra Black', 'font weight', 'blockera') +
					' - ' +
					__('Italic', 'blockera'),
				value: '1000-italic',
			},
		],
	},
];

export const getFontAppearanceObject = (
	id: string
): {
	weight: string,
	style: string,
} => {
	if (isObject(id)) {
		//$FlowFixMe
		return id;
	}

	if (!id) {
		return {
			weight: '',
			style: '',
		};
	}

	const [weight, style] = id.split('-');

	return {
		weight: weight || '',
		style: style || '',
	};
};

export const getFontAppearanceId = (appearance?: {
	weight: string,
	style: string,
}): string => {
	if (!appearance || !isObject(appearance)) {
		return '';
	}

	const { weight, style } = appearance;

	if (!weight && !style) {
		return '';
	}

	return `${weight}-${style}`;
};
