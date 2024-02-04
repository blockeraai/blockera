// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type ConditionsExtensionProps = {
	block: TBlockProps,
	extensionConfig: {
		publisherConditions: Object,
	},
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	values: {},
	extensionProps: {},
};
