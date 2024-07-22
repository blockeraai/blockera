// @flow

/**
 * Internal dependencies
 */
import type {
	CoreDefinitionModel,
	CoreExtensionDefinition,
	CoreExtensionDefinitionBlock,
} from './types';

export const getExtensions = (
	{
		CoreConfigDefinition,
	}: {
		CoreConfigDefinition: CoreExtensionDefinition,
	},
	blockName: string
): CoreExtensionDefinitionBlock => CoreConfigDefinition[blockName];

export const getExtension = (
	{
		CoreConfigDefinition,
	}: {
		CoreConfigDefinition: CoreExtensionDefinition,
	},
	name: string,
	blockName: string
): CoreDefinitionModel => {
	return CoreConfigDefinition[blockName][name];
};

export const getDefinitions = (
	{
		CustomConfigDefinitions,
	}: {
		CustomConfigDefinitions: CoreExtensionDefinition,
	},
	blockName: string,
	definition: string
): CoreDefinitionModel => CustomConfigDefinitions[blockName][definition];

export const getDefinition = (
	{
		CustomConfigDefinitions,
	}: {
		CustomConfigDefinitions: CoreExtensionDefinition,
	},
	definition: string,
	blockName: string
): CoreDefinitionModel => {
	return CustomConfigDefinitions[blockName][definition];
};
