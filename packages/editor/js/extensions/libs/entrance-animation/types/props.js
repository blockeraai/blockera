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
		blockeraEntranceAnimation: Object,
	},
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	values: {},
	extensionProps: {},
};
