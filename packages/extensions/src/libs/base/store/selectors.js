// @flow

/**
 * Internal dependencies
 */
import type { CoreExtensionDefinition, CoreDefinitionModel } from './types';

export const getExtensions = ({
	CoreConfigDefinition,
}: {
	CoreConfigDefinition: CoreExtensionDefinition,
}): CoreExtensionDefinition => CoreConfigDefinition;

export const getExtension = (
	{
		CoreConfigDefinition,
	}: {
		CoreConfigDefinition: CoreExtensionDefinition,
	},
	name: string
): CoreDefinitionModel => {
	return CoreConfigDefinition[name];
};

export const getDefinitions = ({
	CustomConfigDefinitions,
}: {
	CustomConfigDefinitions: CoreExtensionDefinition,
}): CoreExtensionDefinition => CustomConfigDefinitions;

export const getDefinition = (
	{
		CustomConfigDefinitions,
	}: {
		CustomConfigDefinitions: CoreExtensionDefinition,
	},
	name: string
): CoreDefinitionModel => {
	return CustomConfigDefinitions[name];
};
