// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { BorderRadiusValue } from '@publisher/controls';

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
	borderAndShadowConfig: Object,
	values: {
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
		outline: Object,
		boxShadow: Object,
		borderRadius: Object,
	},
	extensionProps: {
		publisherBoxShadow: Object,
		publisherOutline: Object,
		publisherBorder: Object,
		publisherBorderRadius: Object,
	},
};
