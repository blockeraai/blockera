/**
 * External dependencies
 */
import { registerCoreBlocks } from '@wordpress/block-library';

/**
 * Internal dependencies
 */
import { registerBlockExtension } from '@blockera/editor';

function registerExtension(extension) {
	registerBlockExtension(extension.name, extension);
}

export function blocksInitializer(extension) {
	registerCoreBlocks();
	registerExtension(extension);
}
