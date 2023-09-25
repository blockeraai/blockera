// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TTypographyProps = {
	values: {
		fontSize: string,
		textAlign: string,
		fontStyle: string,
		direction: string,
		fontColor: string,
		wordBreak: string,
		textIndent: string,
		textShadow: string,
		lineHeight: string,
		wordSpacing: string,
		textColumns: string,
		textTransform: string,
		letterSpacing: string,
		textDecoration: string,
		textOrientation: string,
		textColumnsGap: string,
		textStrokeWidth: string,
		textStrokeColor: string,
		textColumnsDividerWidth: string,
		textColumnsDividerStyle: string,
		textColumnsDividerColor: string,
	},
	block: TBlockProps,
	config: Object,
	children?: MixedElement,
	defaultValue: {
		fontSize?: string,
		typography: {
			fontSize?: string,
			fontStyle?: string,
			fontWeight?: string,
			textTransform?: string,
			lineHeight?: string,
			letterSpacing?: string,
			textDecoration?: string,
		},
	},
	handleOnChangeAttributes: THandleOnChangeAttributes,
};
