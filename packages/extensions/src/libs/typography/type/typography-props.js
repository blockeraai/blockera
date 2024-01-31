// @flow

/**
 * Publisher dependencies
 */
import type { BorderControlBorderStyle } from '@publisher/controls/src/libs/border-control/types';

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';

export type TTypographyProps = {
	...BaseExtensionProps,
	values: {
		fontSize: string,
		lineHeight: string,
		textAlign: string,
		textDecoration: string,
		fontStyle: string,
		textTransform: string,
		direction: string,
		letterSpacing: string,
		wordSpacing: string,
		textIndent: string,
		textOrientation: string,
		textStroke: {
			width: string,
			style: BorderControlBorderStyle,
			color: string,
		},
		textColumns: {
			columns: string,
			gap: string,
			divider: {
				width: string,
				style: BorderControlBorderStyle,
				color: string,
			},
		},
		wordBreak: string,
		fontColor: string,
		textShadow: string,
	},
	display?: string,
	backgroundClip?: string,
	typographyConfig: Object,
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
