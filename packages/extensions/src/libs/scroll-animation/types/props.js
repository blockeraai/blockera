// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type ScrollExtensionProps = {
	block: TBlockProps,
	extensionConfig: {
		publisherScrollAnimation: Object,
	},
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	values: {},
	extensionProps: {},
};
