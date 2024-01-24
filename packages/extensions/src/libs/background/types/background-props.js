// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import type { ConfigModel } from '../../base/types';

export type IsEnableBackground = ({
	backgroundConfig: { publisherBackground: ConfigModel },
}) => boolean;

export type TBackgroundProps = {
	block: TBlockProps,
	setSettings: (settings: Object, key: string) => void,
	backgroundConfig: Object,
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
