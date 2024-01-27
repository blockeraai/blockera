// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import type { FeatureConfig } from '../../base';

export type IsEnableBackground = ({
	backgroundConfig: { publisherBackground: FeatureConfig },
}) => boolean;

export type TBackgroundProps = {
	block: TBlockProps,
	setSettings: (settings: Object, key: string) => void,
	backgroundConfig: {
		publisherBackground: FeatureConfig,
		publisherBackgroundColor: FeatureConfig,
		publisherBackgroundClip: FeatureConfig,
	},
	children?: MixedElement,
	values: {
		background: Object,
		backgroundClip: string,
		backgroundColor: string,
	},
	defaultValue: {
		backgroundSize?: string,
		backgroundImage?: string,
	},
	handleOnChangeAttributes: THandleOnChangeAttributes,
	extensionProps: {
		publisherBackground: Object,
		publisherBackgroundColor: Object,
		publisherBackgroundClip: Object,
	},
};
