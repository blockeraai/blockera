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
	mouseConfig: Object,
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	values: {},
	extensionProps: {},
};
