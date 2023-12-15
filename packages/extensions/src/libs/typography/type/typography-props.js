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
		display: string,
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
		textColumns: {
			columns: string,
			gap: string,
			divider: {
				width: string,
				style: string,
				color: string,
			},
		},
		textTransform: string,
		letterSpacing: string,
		textDecoration: string,
		textOrientation: string,
		textStroke: {
			width: string,
			style: string,
			color: string,
		},
		textColumnsDividerWidth: string,
		textColumnsDividerStyle: string,
		textColumnsDividerColor: string,
	},
	backgroundClip?: string,
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
