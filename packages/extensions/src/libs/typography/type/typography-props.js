// @flow

/**
 * Publisher dependencies
 */
import type { BorderControlBorderStyle } from '@publisher/controls/src/libs/border-control/types';

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { FeatureConfig } from '../../base';

export type TTypographyProps = {
	...BaseExtensionProps,
	extensionConfig: {
		publisherFontSize: FeatureConfig,
		publisherLineHeight: FeatureConfig,
		publisherFontColor: FeatureConfig,
		publisherTextShadow: FeatureConfig,
		publisherTextAlign: FeatureConfig,
		publisherTextDecoration: FeatureConfig,
		publisherFontStyle: FeatureConfig,
		publisherTextTransform: FeatureConfig,
		publisherDirection: FeatureConfig,
		publisherLetterSpacing: FeatureConfig,
		publisherWordSpacing: FeatureConfig,
		publisherTextIndent: FeatureConfig,
		publisherTextOrientation: FeatureConfig,
		publisherTextColumns: FeatureConfig,
		publisherTextStroke: FeatureConfig,
		publisherWordBreak: FeatureConfig,
	},
	values: {
		publisherFontSize: string,
		publisherLineHeight: string,
		publisherFontColor: string,
		publisherTextShadow: [],
		publisherTextAlign: string,
		publisherTextDecoration: string,
		publisherFontStyle: string,
		publisherTextTransform: string,
		publisherDirection: string,
		publisherLetterSpacing: string,
		publisherWordSpacing: string,
		publisherTextIndent: string,
		publisherTextOrientation: string,
		publisherTextStroke: {
			width: string,
			style: BorderControlBorderStyle,
			color: string,
		},
		publisherTextColumns: {
			columns: string,
			gap: string,
			divider: {
				width: string,
				style: BorderControlBorderStyle,
				color: string,
			},
		},
		publisherWordBreak: string,
	},
	display?: string,
	backgroundClip?: string,
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
