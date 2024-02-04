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
		publisherGridChildLayout: {
			alignItems: string,
			justifyContent: string,
		},
		publisherGridChildOrder: { value: string, area: string },
		gridAreas: Array<Object>,
	},
	extensionConfig: {
		publisherGridChildLayout: FeatureConfig,
		publisherGridChildOrder: FeatureConfig,
	},
	extensionProps: {
		publisherGridChildLayout: Object,
		publisherGridChildOrder: Object,
	},
};
