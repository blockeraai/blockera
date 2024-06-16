// @flow
/**
 * Internal dependencies
 */
import type { RepeaterControlProps } from '../../repeater-control/types';

export type TImageProps = {
	image: string,
	'image-size': string,
	'image-size-width': string,
	'image-size-height': string,
	'image-position': {
		top: string,
		left: string,
	},
	'image-repeat': string,
	'image-attachment': string,
};

export type TLinearGradientProps = {
	'linear-gradient': string,
	'linear-gradient-angel': string,
	'linear-gradient-repeat': string,
	'linear-gradient-attachment': string,
};

export type TRadialGradientProps = {
	'radial-gradient': string,
	'radial-gradient-position': {
		top: string,
		left: string,
	},
	'radial-gradient-size': string,
	'radial-gradient-repeat': string,
	'radial-gradient-attachment': string,
};

export type TMeshGradientColors = {
	color: string,
};

export type TMeshGradientProps = {
	'mesh-gradient': string,
	'mesh-gradient-colors': { [key: string]: TMeshGradientColors },
	'mesh-gradient-attachment': string,
};

export type TDefaultRepeaterItemValue = {
	type: 'image' | 'linear-gradient' | 'radial-gradient' | 'mesh-gradient',
	...TImageProps,
	...TLinearGradientProps,
	...TRadialGradientProps,
	...TMeshGradientProps,
	isVisible: boolean,
};

export type TBackgroundControlProps = {
	...RepeaterControlProps,
	defaultValue: {} | TDefaultRepeaterItemValue,
	defaultRepeaterItemValue: TDefaultRepeaterItemValue,
};
