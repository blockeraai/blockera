// @flow

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../../types';

export type CoreExtensionDefinition = {
	[key: string]: {
		[key: string]: ConfigModel,
	},
};

export type CoreDefinitionModel = {
	[key: string]: ConfigModel,
};
