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
		blockeraFontSize: FeatureConfig,
		blockeraLineHeight: FeatureConfig,
		blockeraFontColor: FeatureConfig,
		blockeraTextShadow: FeatureConfig,
		blockeraTextAlign: FeatureConfig,
		blockeraTextDecoration: FeatureConfig,
		blockeraFontStyle: FeatureConfig,
		blockeraTextTransform: FeatureConfig,
		blockeraDirection: FeatureConfig,
		blockeraLetterSpacing: FeatureConfig,
		blockeraWordSpacing: FeatureConfig,
		blockeraTextIndent: FeatureConfig,
		blockeraTextOrientation: FeatureConfig,
		blockeraTextColumns: FeatureConfig,
		blockeraTextStroke: FeatureConfig,
		blockeraWordBreak: FeatureConfig,
	},
	values: {
		blockeraFontSize: string,
		blockeraLineHeight: string,
		blockeraFontColor: string,
		blockeraTextShadow: [],
		blockeraTextAlign: string,
		blockeraTextDecoration: string,
		blockeraFontStyle: string,
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
	},
	display?: string,
	backgroundClip?: string,
	extensionProps: {
		blockeraFontColor: Object,
		blockeraFontSize: Object,
		blockeraLineHeight: Object,
		blockeraTextAlign: Object,
		blockeraTextDecoration: Object,
		blockeraFontStyle: Object,
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
	},
};
