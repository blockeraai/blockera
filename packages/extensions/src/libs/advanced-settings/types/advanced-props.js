// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TAdvancedSettingsProps = {
	values: {
		attributes: Array<Object>,
	},
	block: TBlockProps,
	advancedConfig: Object,
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	extensionProps: {
		publisherAttributes: Object,
	},
};
