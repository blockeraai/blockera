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
	'grid-area'?: string,
	'align-self'?: string,
	'justify-self'?: string,
	order?: string,
};

export type TGridChildProps = {
	values: {
		gridChildLayout: { alignItems: string, justifyContent: string },
		gridChildOrder: { value: string, area: string },
		gridAreas: Array<Object>,
	},
	block: TBlockProps,
	gridChildConfig: Object,
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	extensionProps: {
		publisherGridChildOrder: Object,
		publisherGridChildLayout: Object,
	},
};
