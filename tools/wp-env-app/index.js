/**
 * WordPress dependencies
 */
// import domReady from '@wordpress/dom-ready';

/**
 * Internal dependencies
 */
import {
	applyHooks,
	registerBlockExtension,
	SharedBlockExtension,
	sharedBlockExtensionAttributes,
	sharedBlockExtensionSupports,
} from '@blockera/extensions';

const Shared = {
	name: 'Shared',
	attributes: {
		...sharedBlockExtensionAttributes,
	},
	supports: {
		...sharedBlockExtensionSupports,
	},
	edit: ({ children, ...props }) => {
		return (
			<SharedBlockExtension {...props}>{children}</SharedBlockExtension>
		);
	},
};

class Setup {
	addExtensions() {
		const BlockLibrary = [Shared];

		for (const key in BlockLibrary) {
			if (!Object.hasOwnProperty.call(BlockLibrary, key)) {
				continue;
			}

			const currentBlock = BlockLibrary[key];

			if (!currentBlock?.name && 'Shared' !== key) {
				console.warn(
					'Block extension validation: Block extension must contain name param!'
				);
				continue;
			}

			registerBlockExtension(currentBlock.name || key, currentBlock);
		}

		return this;
	}

	addBlocks() {
		//TODO: implements registration blockera custom blocks into WordPress Block Editor (Gutenberg).

		return this;
	}
}

const setupInstance = new Setup();

setupInstance.addExtensions().addBlocks();

applyHooks();
