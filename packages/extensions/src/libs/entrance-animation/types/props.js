// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type EntranceExtensionProps = {
	block: TBlockProps,
	extensionConfig: {
		publisherEntranceAnimation: Object,
	},
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	values: {},
	extensionProps: {},
};
