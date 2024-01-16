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
	'pointer-events'?: string,
};

export type TMouseProps = {
	block: TBlockProps,
	mouseConfig: Object,
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	values: { cursor: string, userSelect: string, pointerEvents: string },
	cursor: string,
	userSelect: string,
	pointerEvents: string,
	extensionProps: {
		publisherCursor: Object,
		publisherUserSelect: Object,
		publisherPointerEvents: Object,
	},
};
