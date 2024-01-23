// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TAdvancedProps = {
	values: {
		cSSProperties: Array<Object>,
	},
	block: TBlockProps,
	advancedConfig: Object,
	children?: MixedElement,
	defaultValue: {
		width?: string,
		height?: string,
		overflow?: string,
	},
	handleOnChangeAttributes: THandleOnChangeAttributes,
	extensionProps: {
		publisherCSSProperties: Object,
	},
};
