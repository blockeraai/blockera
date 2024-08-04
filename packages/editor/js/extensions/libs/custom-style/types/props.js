// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';

export type CustomStyleExtensionProps = {
	...BaseExtensionProps,
	values: {
		blockeraCustomCSS: string,
	},
	extensionConfig: Object,
	extensionProps: {
		blockeraCustomCSS: Object,
	},
};
