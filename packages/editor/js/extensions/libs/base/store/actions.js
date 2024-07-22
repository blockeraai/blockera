// @flow

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';
import type { CoreDefinitionModel } from './types';

export const addExtension = ({
	name,
	supports,
	clientId,
}: {
	name: string,
	clientId: string,
	supports: CoreDefinitionModel,
}): Object => {
	return {
		name,
		clientId,
		supports,
		type: 'ADD_EXTENSION',
	};
};

export const addExtensionSupport = ({
	name,
	support,
	clientId,
	extensionName,
}: {
	name: string,
	clientId: string,
	support: FeatureConfig,
	extensionName: string,
}): Object => {
	return {
		name,
		support,
		clientId,
		extensionName,
		type: 'ADD_EXTENSION_SUPPORT',
	};
};

export const updateExtension = ({
	name,
	clientId,
	newSupports,
}: {
	name: string,
	clientId: string,
	newSupports: CoreDefinitionModel,
}): Object => {
	return {
		name,
		clientId,
		newSupports,
		type: 'UPDATE_EXTENSION',
	};
};

export const addDefinition = ({
	name,
	clientId,
	extensions,
	definition,
}: {
	name: string,
	clientId: string,
	definition: string,
	extensions: CoreDefinitionModel,
}): Object => {
	return {
		name,
		clientId,
		definition,
		extensions,
		type: 'ADD_DEFINITION',
	};
};

export const updateDefinitionExtensionSupport = ({
	name,
	clientId,
	newSupports,
	definitionName,
}: {
	name: string,
	clientId: string,
	definitionName: string,
	newSupports: CoreDefinitionModel,
}): Object => {
	return {
		name,
		clientId,
		newSupports,
		definitionName,
		type: 'UPDATE_DEFINITION_EXTENSION_SUPPORT',
	};
};
