// @flow

/**
 * Blockera dependencies
 */
import type { BorderControlBorderStyle } from '@blockera/controls/js/libs/border-control/types';

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { FeatureConfig } from '../../base';

export type TTypographyProps = {
	...BaseExtensionProps,
	extensionConfig: {
		blockeraFontFamily: FeatureConfig,
		blockeraFontAppearance: FeatureConfig,
		blockeraFontSize: FeatureConfig,
		blockeraLineHeight: FeatureConfig,
		blockeraFontColor: FeatureConfig,
		blockeraTextShadow: FeatureConfig,
		blockeraTextAlign: FeatureConfig,
		blockeraTextDecoration: FeatureConfig,
		blockeraTextTransform: FeatureConfig,
		blockeraDirection: FeatureConfig,
		blockeraLetterSpacing: FeatureConfig,
		blockeraWordSpacing: FeatureConfig,
		blockeraTextIndent: FeatureConfig,
		blockeraTextOrientation: FeatureConfig,
		blockeraTextColumns: FeatureConfig,
		blockeraTextStroke: FeatureConfig,
		blockeraWordBreak: FeatureConfig,
		blockeraTextWrap: FeatureConfig,
	},
	values: {
		blockeraFontFamily: string,
		blockeraFontAppearance: string,
		blockeraFontSize: string,
		blockeraLineHeight: string,
		blockeraFontColor: string,
		blockeraTextShadow: [],
		blockeraTextAlign: string,
		blockeraTextDecoration: string,
		blockeraTextTransform: string,
		blockeraDirection: string,
		blockeraLetterSpacing: string,
		blockeraWordSpacing: string,
		blockeraTextIndent: string,
		blockeraTextOrientation: string,
		blockeraTextStroke: {
			width: string,
			style: BorderControlBorderStyle,
			color: string,
		},
		blockeraTextColumns: {
			columns: string,
			gap: string,
			divider: {
				width: string,
				style: BorderControlBorderStyle,
				color: string,
			},
		},
		blockeraWordBreak: string,
		blockeraTextWrap: string,
	},
	display?: string,
	backgroundClip?: string,
	extensionProps: {
		blockeraFontFamily: Object,
		blockeraFontAppearance: Object,
		blockeraFontColor: Object,
		blockeraFontSize: Object,
		blockeraLineHeight: Object,
		blockeraTextAlign: Object,
		blockeraTextDecoration: Object,
		blockeraTextTransform: Object,
		blockeraDirection: Object,
		blockeraTextShadow: Object,
		blockeraLetterSpacing: Object,
		blockeraWordSpacing: Object,
		blockeraTextIndent: Object,
		blockeraTextOrientation: Object,
		blockeraTextColumns: Object,
		blockeraTextStroke: Object,
		blockeraWordBreak: Object,
		blockeraTextWrap: Object,
	},
};
