/** @typedef {import('../api/registration').publisherBlockExtensionType} publisherBlockExtensionType */

/**
 * Returns an action object used in signalling that block types have been added.
 * Ignored from documentation as the recommended usage for this action through registerBlockType from @wordpress/blocks.
 *
 * @ignore
 *
 * @param {publisherBlockExtensionType|publisherBlockExtensionType[]} blockExtension Object or array of objects representing blocks to added.
 *
 *
 * @return {Object} Action object.
 */
export function addBlockExtensions(blockExtension) {
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
 * @param {publisherBlockExtensionType} blockExtension Unprocessed block extension settings.
 */
export const __experimentalRegisterBlockExtension =
	(blockExtension) =>
	({ dispatch, select }) => {
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
 * Ignored from documentation as the recommended usage for this action through unregisterBlockExtension from @publisher/extensions.
 *
 * @ignore
 *
 * @param {string|string[]} names Block extension name or array of block extension names to be removed.
 *
 *
 * @return {Object} Action object.
 */
export function removeBlockExtensions(names) {
	return {
		type: 'REMOVE_BLOCK_EXTENSIONS',
		names: Array.isArray(names) ? names : [names],
	};
}
