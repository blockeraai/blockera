// @flow

/**
 * External dependencies
 */
import { select, dispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { getBlockTypes } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { sharedListenerCallback } from '../listener-callback';
import { getBlockTypeSelector } from '../side-bar-listener';
import { IntersectionObserverRenderer } from '../../intersection-observer-renderer';

/**
 * Plugin: Blockera Global Styles Panel Activator Observer
 * Observes panel activation and sets up event listeners for block interactions.
 *
 * @param {string} screen - CSS selector for the screen element
 */
export const registerPanelActivatorObserverPlugin = (screen: string): void => {
	// Get block types once at registration time (not on every render)
	const blockTypes = getBlockTypes();

	registerPlugin('blockera-global-styles-panel-activator-observer', {
		render() {
			const {
				setSelectedBlockRef,
				setSelectedBlockStyle,
				setStyleVariationBlocks,
			} = dispatch('blockera/editor');
			const { changeExtensionCurrentBlock } = dispatch(
				'blockera/extensions'
			);

			// eslint-disable-next-line react-hooks/rules-of-hooks
			useEffect(() => {
				// Cache select function once to avoid repeated lookups
				const { getBlockStyles } = select('core/blocks');
				const className = 'activated-blockera-global-styles-panel';

				new IntersectionObserverRenderer(screen, null, {
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
							const blockStyles =
								getBlockStyles(blockType.name) || [];

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
								blockElement.addEventListener('click', () => {
									document.body?.classList?.add(className);
									sharedListenerCallback(blockType.name);
								});
							}
						});
					},
				});
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, []);

			return <></>;
		},
	});
};
