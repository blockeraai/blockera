// @flow

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../../types';

export type CoreExtensionDefinition = {
	[key: string]: {
		[key: string]: {
			[key: string]: FeatureConfig,
		},
	},
};

export type CoreExtensionDefinitionClient = {
	[key: string]: {
		[key: string]: FeatureConfig,
	},
};

export type CoreDefinitionModel = {
	[key: string]: FeatureConfig,
};
