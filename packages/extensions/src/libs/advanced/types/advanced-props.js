// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';

export type TAdvancedProps = {
	...BaseExtensionProps,
	values: {
		publisherCustomCSS: string,
	},
	advancedConfig: Object,
	extensionProps: {
		publisherCustomCSS: Object,
	},
};
