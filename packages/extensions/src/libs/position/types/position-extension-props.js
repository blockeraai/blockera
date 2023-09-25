// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TPositionExtensionProps = {
	block: TBlockProps,
	config: Object,
	children?: MixedElement,
	zIndexValue: string,
	positionValue: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
};
