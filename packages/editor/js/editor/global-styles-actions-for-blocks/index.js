// @flow

/**
 * External dependencies
 */
import { type MixedElement } from 'react';
import { useEffect } from '@wordpress/element';
import { getBlockTypes } from '@wordpress/blocks';
import { select, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getTargets } from '../header-ui/helpers';
import { getBlockTypeSelector } from './side-bar-listener';
import { sharedListenerCallback } from './listener-callback';
import { IntersectionObserverRenderer } from '../global-styles/intersection-observer-renderer';

/**
 * Plugin: Blockera Global Styles Panel Activator Observer
 * Observes panel activation and sets up event listeners for block interactions.
 *
 * @param {string} screen - CSS selector for the screen element
 */
export default function GlobalStylesActionsForBlocks(): MixedElement {
	const blockTypes = getBlockTypes();
	const {
		setSelectedBlockRef,
		setSelectedBlockStyle,
		setStyleVariationBlocks,
	} = dispatch('blockera/editor');
	const { changeExtensionCurrentBlock } = dispatch('blockera/extensions');

	const { getEntity } = select('blockera/data') || {};
	const { version } = getEntity('wp');
	const { globalStylesPanel } = getTargets(version);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		// Cache select function once to avoid repeated lookups
		const { getBlockStyles } = select('core/blocks');

		new IntersectionObserverRenderer(globalStylesPanel.screen, null, {
			callback: () => {
				// Safety guard: ensure button exists before adding listener
				const globalStylesButton = document.querySelector(
					'button[aria-controls="edit-site:global-styles"]'
				);
				const postDocumentButton = document.querySelector(
					'button[aria-controls="edit-post:document"]'
				);

				if (globalStylesButton) {
					globalStylesButton.addEventListener('click', () => {
						setSelectedBlockStyle('');
						setSelectedBlockRef(undefined);
					});
				}

				if (postDocumentButton) {
					postDocumentButton.addEventListener('click', () => {
						changeExtensionCurrentBlock('master');
					});
				}

				// Set up listeners for each block type
				blockTypes.forEach((blockType) => {
					// Safety guard: ensure blockType exists
					if (!blockType) {
						return;
					}

					// Use cached select function instead of calling select() repeatedly
					const blockStyles = getBlockStyles(blockType.name) || [];

					// Register style variations for this block type
					blockStyles.forEach((blockStyle) => {
						// Safety guard: ensure blockStyle exists
						if (!blockStyle) {
							return;
						}

						setStyleVariationBlocks(blockStyle.name, [
							blockType.name,
						]);
					});

					// Set up click listener for block element
					const blockElement = document.querySelector(
						getBlockTypeSelector(blockType.name)
					);

					if (blockElement) {
						blockElement.addEventListener('click', () =>
							sharedListenerCallback(blockType.name)
						);
					}
				});
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <></>;
}
