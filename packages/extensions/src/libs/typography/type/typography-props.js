// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import type { BorderControlBorderStyle } from '@publisher/controls/src/libs/border-control/types';

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
				style: BorderControlBorderStyle,
				color: string,
			},
		},
		textTransform: string,
		letterSpacing: string,
		textDecoration: string,
		textOrientation: string,
		textStroke: {
			width: string,
			style: BorderControlBorderStyle,
			color: string,
		},
	},
	display?: string,
	backgroundClip?: string,
	block: TBlockProps,
	typographyConfig: Object,
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	extensionProps: {
		publisherFontColor: Object,
		publisherFontSize: Object,
		publisherLineHeight: Object,
		publisherTextAlign: Object,
		publisherTextDecoration: Object,
		publisherFontStyle: Object,
		publisherTextTransform: Object,
		publisherDirection: Object,
		publisherTextShadow: Object,
		publisherLetterSpacing: Object,
		publisherWordSpacing: Object,
		publisherTextIndent: Object,
		publisherTextOrientation: Object,
		publisherTextColumns: Object,
		publisherTextStroke: Object,
		publisherWordBreak: Object,
	},
};
