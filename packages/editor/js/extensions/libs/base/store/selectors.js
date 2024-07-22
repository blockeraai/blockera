// @flow

/**
 * Internal dependencies
 */
import type {
	CoreDefinitionModel,
	CoreExtensionDefinition,
	CoreExtensionDefinitionClient,
} from './types';

export const getExtensions = (
	{
		CoreConfigDefinition,
	}: {
		CoreConfigDefinition: CoreExtensionDefinition,
	},
	clientId: string
): CoreExtensionDefinitionClient => CoreConfigDefinition[clientId];

export const getExtension = (
	{
		CoreConfigDefinition,
	}: {
		CoreConfigDefinition: CoreExtensionDefinition,
	},
	name: string,
	clientId: string
): CoreDefinitionModel => {
	return CoreConfigDefinition[clientId][name];
};

export const getDefinitions = (
	{
		CustomConfigDefinitions,
	}: {
		CustomConfigDefinitions: CoreExtensionDefinition,
	},
	clientId: string,
	definition: string
): CoreExtensionDefinitionClient =>
	CustomConfigDefinitions[clientId][definition];

export const getDefinition = (
	{
		CustomConfigDefinitions,
	}: {
		CustomConfigDefinitions: CoreExtensionDefinition,
	},
	definition: string,
	clientId: string
): CoreDefinitionModel => {
	return CustomConfigDefinitions[clientId][definition];
};
