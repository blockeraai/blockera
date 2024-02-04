// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { FeatureConfig } from '../../base';

export type TCssProps = {
	cursor?: string,
	'user-select'?: string,
	'pointer-events'?: string,
};

export type TMouseProps = {
	...BaseExtensionProps,
	mouseConfig: {
		publisherCursor: FeatureConfig,
		publisherUserSelect: FeatureConfig,
		publisherPointerEvents: FeatureConfig,
	},
	values: { cursor: string, userSelect: string, pointerEvents: string },
	extensionProps: {
		publisherCursor: Object,
		publisherUserSelect: Object,
		publisherPointerEvents: Object,
	},
};
