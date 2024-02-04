// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { BorderRadiusValue } from '@publisher/controls';
import type { FeatureConfig } from '../../base';

export type TBorderAndShadowDefaultProp = {
	borderColor?: string,
	border: {
		color?: string,
		style?: string,
		width?: string,
		top?: Object,
		left?: Object,
		right?: Object,
		bottom?: Object,
		radius?: BorderRadiusValue,
	},
};

export type TBorderAndShadowProps = {
	...BaseExtensionProps,
	extensionConfig: {
		publisherBorder: FeatureConfig,
		publisherBorderRadius: FeatureConfig,
		publisherBoxShadow: FeatureConfig,
		publisherOutline: FeatureConfig,
	},
	values: {
		publisherBorder: {
			color?: string,
			style?: string,
			width?: string,
			top?: Object,
			left?: Object,
			right?: Object,
			bottom?: Object,
			radius?: BorderRadiusValue,
		},
		publisherBorderRadius: Object,
		publisherBoxShadow: Array<Object>,
		publisherOutline: Array<Object>,
	},
	extensionProps: {
		publisherBoxShadow: Object,
		publisherOutline: Object,
		publisherBorder: Object,
		publisherBorderRadius: Object,
	},
};
