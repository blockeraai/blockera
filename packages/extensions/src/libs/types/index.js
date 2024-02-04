// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps } from './block-props';
import type { THandleOnChangeAttributes } from './handle-onchange-attributes';

export type { TBlockProps } from './block-props';
export type { ExtensionProps } from './extension-prop-types';
export type { THandleOnChangeWithPath } from './handle-onchange-with-path';
export type { THandleOnChangeAttributes } from './handle-onchange-attributes';

export type BaseExtensionProps = {
	block: TBlockProps,
	setSettings: (settings: Object, key: string) => void,
	values: {
		[key: string]: any,
	},
	attributes: {
		[key: string]: {
			type: string,
			default: any,
		},
	},
	handleOnChangeAttributes: THandleOnChangeAttributes,
	extensionProps: {
		[key: string]: Object,
	},
	children?: MixedElement,
};
