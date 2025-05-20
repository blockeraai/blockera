// @flow

// eslint-disable-next-line jsdoc/valid-types
/** @typedef {import('../api/registration').blockeraBlockExtensionType} blockeraBlockExtensionType */

import type { InnerBlockType } from '../libs/inner-blocks/types';
import type { TBreakpoint, TStates } from '../libs/block-states/types';

/**
 * Returns an action object used in signalling that block types have been added.
 * Ignored from documentation as the recommended usage for this action through registerBlockType from @wordpress/blocks.
 *
 * @ignore
 *
 * @param {blockeraBlockExtensionType|blockeraBlockExtensionType[]} blockExtension Object or array of objects representing blocks to added.
 *
 *
 * @return {Object} Action object.
 */
export function addBlockExtensions(
	blockExtension: Array<Object> | Object
): Object {
	return {
		type: 'ADD_BLOCK_EXTENSIONS',
		blockExtensions: Array.isArray(blockExtension)
			? blockExtension
			: [blockExtension],
	};
}

/**
 * Signals that the passed block extension's settings should be stored in the state.
 *
 * @param {blockeraBlockExtensionType} blockExtension Unprocessed block extension settings.
 */
export const __experimentalRegisterBlockExtension =
	(blockExtension: Array<Object>): Object =>
	({ dispatch }) => {
		dispatch({
			type: 'ADD_UNPROCESSED_BLOCK_EXTENSION',
			blockExtension,
		});

		if (!blockExtension) {
			return;
		}

		dispatch.addBlockExtensions(blockExtension);
	};

/**
 * Returns an action object used to remove a registered block extension.
 * Ignored from documentation as the recommended usage for this action through unregisterBlockExtension from @blockera/editor.
 *
 * @ignore
 *
 * @param {string|string[]} names Block extension name or array of block extension names to be removed.
 *
 *
 * @return {Object} Action object.
 */
export function removeBlockExtensions(names: string | Array<string>): Object {
	return {
		type: 'REMOVE_BLOCK_EXTENSIONS',
		names: Array.isArray(names) ? names : [names],
	};
}

export function changeExtensionCurrentBlock(
	currentBlock: 'master' | InnerBlockType
): Object {
	return {
		currentBlock,
		type: 'CHANGE_CURRENT_BLOCK',
	};
}

export function changeExtensionCurrentBlockState(
	currentStateType: TStates
): Object {
	return {
		currentStateType,
		type: 'CHANGE_CURRENT_BLOCK_STATE',
	};
}

export function changeExtensionInnerBlockState(
	currentInnerBlockState: TStates
): Object {
	return {
		currentInnerBlockState,
		type: 'CHANGE_INNER_BLOCK_STATE',
	};
}

export function changeExtensionCurrentBlockStateBreakpoint(
	currentBreakpoint: TBreakpoint
): Object {
	return {
		currentBreakpoint,
		type: 'CHANGE_CURRENT_BLOCK_STATE_BREAKPOINT',
	};
}

export function setExtensionsActiveBlockVariation(variation: Object): Object {
	return {
		variation,
		type: 'SET_EXTENSIONS_ACTIVE_VARIATION',
	};
}

export function setBlockClientMasterState({
	name,
	clientId,
	currentState,
}: Object): Object {
	return {
		name,
		clientId,
		currentState,
		type: 'SET_BLOCK_CLIENT_CURRENT_STATE',
	};
}

export function setBlockClientInnerState({
	clientId,
	currentState,
	innerBlockType,
}: Object): Object {
	return {
		clientId,
		currentState,
		name: innerBlockType,
		type: 'SET_BLOCK_CLIENT_CURRENT_STATE',
	};
}

export function setBlockClientStates({
	clientId,
	blockType,
	blockStates,
}: Object): Object {
	return {
		clientId,
		blockType,
		blockStates,
		type: 'SET_BLOCK_CLIENT_STATES',
	};
}

export function setBlockClientInners({ inners, clientId }: Object): Object {
	return {
		inners,
		clientId,
		type: 'SET_BLOCK_CLIENT_INNERS',
	};
}

export const registerSharedBlockAttributes = (attributes: Object): Object => {
	return {
		attributes,
		type: 'REGISTER_SHARED_BLOCK_ATTRIBUTES',
	};
};

export const registerBlockTypeAttributes = (
	attributes: Object,
	name: string
): Object => {
	return {
		name,
		attributes,
		type: 'REGISTER_BLOCK_TYPE_ATTRIBUTES',
	};
};
