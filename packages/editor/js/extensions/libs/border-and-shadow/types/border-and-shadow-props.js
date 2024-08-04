// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { BorderRadiusValue } from '@blockera/controls';
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
		blockeraBorder: FeatureConfig,
		blockeraBorderRadius: FeatureConfig,
		blockeraBoxShadow: FeatureConfig,
		blockeraOutline: FeatureConfig,
	},
	values: {
		blockeraBorder: {
			color?: string,
			style?: string,
			width?: string,
			top?: Object,
			left?: Object,
			right?: Object,
			bottom?: Object,
			radius?: BorderRadiusValue,
		},
		blockeraBorderRadius: Object,
		blockeraBoxShadow: Array<Object>,
		blockeraOutline: Array<Object>,
	},
	extensionProps: {
		blockeraBoxShadow: Object,
		blockeraOutline: Object,
		blockeraBorder: Object,
		blockeraBorderRadius: Object,
	},
};
