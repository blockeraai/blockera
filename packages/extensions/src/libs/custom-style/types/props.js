// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';

export type CustomStyleExtensionProps = {
	...BaseExtensionProps,
	values: {
		publisherCustomCSS: string,
	},
	extensionConfig: Object,
	extensionProps: {
		publisherCustomCSS: Object,
	},
};
