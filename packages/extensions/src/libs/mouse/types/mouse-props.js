// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TCssProps = {
	cursor?: string,
	'user-select'?: string,
	'pointer-event'?: string,
};

export type TMouseProps = {
	block: TBlockProps,
	config: Object,
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	cursor: string,
	userSelect: string,
	pointerEvents: string,
};
