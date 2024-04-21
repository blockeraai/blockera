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
		blockeraCursor: FeatureConfig,
		blockeraUserSelect: FeatureConfig,
		blockeraPointerEvents: FeatureConfig,
	},
	values: { cursor: string, userSelect: string, pointerEvents: string },
	extensionProps: {
		blockeraCursor: Object,
		blockeraUserSelect: Object,
		blockeraPointerEvents: Object,
	},
};
