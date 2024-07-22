// @flow

/**
 * Internal dependencies
 */
import type { CoreDefinitionModel } from './types';

export const addExtension = ({
	name,
	supports,
	blockName,
}: {
	name: string,
	blockName: string,
	supports: CoreDefinitionModel,
}): Object => {
	return {
		name,
		blockName,
		supports,
		type: 'ADD_EXTENSION',
	};
};

export const updateExtension = ({
	name,
	blockName,
	newSupports,
}: {
	name: string,
	blockName: string,
	newSupports: CoreDefinitionModel,
}): Object => {
	return {
		name,
		blockName,
		newSupports,
		type: 'UPDATE_EXTENSION',
	};
};

export const addDefinition = ({
	name,
	blockName,
	extensions,
	definition,
}: {
	name: string,
	blockName: string,
	definition: string,
	extensions: CoreDefinitionModel,
}): Object => {
	return {
		name,
		blockName,
		definition,
		extensions,
		type: 'ADD_DEFINITION',
	};
};

export const updateDefinitionExtensionSupport = ({
	name,
	blockName,
	newSupports,
	definitionName,
}: {
	name: string,
	blockName: string,
	definitionName: string,
	newSupports: CoreDefinitionModel,
}): Object => {
	return {
		name,
		blockName,
		newSupports,
		definitionName,
		type: 'UPDATE_DEFINITION_EXTENSION_SUPPORT',
	};
};
