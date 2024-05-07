// @flow
/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { FeatureConfig } from '../../base';

export type TCssProps = {
	'grid-area'?: string,
	'align-self'?: string,
	'justify-self'?: string,
	order?: string,
};

export type TGridChildProps = {
	...BaseExtensionProps,
	values: {
		blockeraGridChildLayout: {
			alignItems: string,
			justifyContent: string,
		},
		blockeraGridChildOrder: { value: string, area: string },
		gridAreas: Array<Object>,
	},
	extensionConfig: {
		blockeraGridChildLayout: FeatureConfig,
		blockeraGridChildOrder: FeatureConfig,
	},
	extensionProps: {
		blockeraGridChildLayout: Object,
		blockeraGridChildOrder: Object,
	},
};
