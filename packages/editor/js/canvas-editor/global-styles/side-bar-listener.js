// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';
import { createRoot } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { sharedListenerCallback } from './listener-callback';
import { BlockIcon } from '../../extensions/components/block-icon';

const getBlockTypeSelector = (blockName: string): string => {
	return `button[id="/blocks/${blockName.replace('/', '%2F')}"]`;
};

export const sidebarListener = (blockTypes: Array<Object>): void => {
	blockTypes.forEach((blockType) => {
		const blockElement = document.querySelector(
			getBlockTypeSelector(blockType.name)
		);
		blockElement?.addEventListener('click', () =>
			sharedListenerCallback(blockType.name)
		);

		if (!blockType.attributes?.blockeraPropsId) {
			return;
		}

		const iconWrapperElement = document.createElement('span');
		iconWrapperElement.classList.add('blockera-block-icon-wrapper');
		const root = createRoot(iconWrapperElement);
		root.render(<BlockIcon name={blockType.name} />);

		blockElement?.appendChild(iconWrapperElement);
	});

	document
		.querySelector(
			'.editor-header__settings button[aria-controls="edit-site:global-styles"]'
		)
		?.addEventListener('click', () => {
			dispatch('blockera/editor').setSelectedBlockStyle('');
		});
};

export const sidebarSelector: string = '.edit-site-block-types-search';
