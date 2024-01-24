// @flow

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';
import type { CoreDefinitionModel } from './types';

export const addExtension = ({
	name,
	supports,
}: {
	name: string,
	supports: CoreDefinitionModel,
}): Object => {
	return {
		name,
		supports,
		type: 'ADD_EXTENSION',
	};
};

export const addExtensionSupport = ({
	name,
	support,
	extensionName,
}: {
	name: string,
	support: ConfigModel,
	extensionName: string,
}): Object => {
	return {
		name,
		support,
		extensionName,
		type: 'ADD_EXTENSION_SUPPORT',
	};
};

export const updateExtension = (
	name: string,
	newSupports: CoreDefinitionModel
): Object => {
	return {
		name,
		newSupports,
		type: 'UPDATE_EXTENSION',
	};
};

export const addDefinition = ({
	name,
	extensions,
}: {
	name: string,
	extensions: CoreDefinitionModel,
}): Object => {
	return {
		name,
		extensions,
		type: 'ADD_DEFINITION',
	};
};

export const addDefinitionExtensionSupport = ({
	name,
	support,
	definitionName,
}: {
	name: string,
	support: ConfigModel,
	definitionName: string,
}): Object => {
	return {
		name,
		support,
		definitionName,
		type: 'ADD_DEFINITION_EXTENSION_SUPPORT',
	};
};

export const updateDefinitionExtensionSupport = (
	name: string,
	newSupports: CoreDefinitionModel,
	definitionName: string
): Object => {
	return {
		name,
		newSupports,
		definitionName,
		type: 'UPDATE_DEFINITION_EXTENSION_SUPPORT',
	};
};
