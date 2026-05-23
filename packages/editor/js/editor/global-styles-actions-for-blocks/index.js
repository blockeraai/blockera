// @flow

/**
 * External dependencies
 */
import { type MixedElement } from 'react';
import { useEffect } from '@wordpress/element';
import { getBlockTypes } from '@wordpress/blocks';
import { select, dispatch } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import { getDualGlobalStylesSelector } from '@blockera/global-styles-ui/panel-override/selectors';

/**
 * Internal dependencies
 */
import { getTargets } from '../header-ui/helpers';
import { getBlockTypeSelector } from './side-bar-listener';
import { sharedListenerCallback } from './listener-callback';
import { IntersectionObserverRenderer } from '../intersection-observer-renderer';

/**
 * Plugin: Blockera Global Styles Panel Activator Observer
 * Observes panel activation and sets up event listeners for block interactions.
 *
 * @param {string} screen - CSS selector for the screen element
 */
export default function GlobalStylesActionsForBlocks({
	className,
}: {
	className: string,
}): MixedElement {
	const blockTypes = getBlockTypes();
	const { setSelectedBlockRef, setSelectedBlockStyle } =
		dispatch('blockera/editor');
	const { changeExtensionCurrentBlock } = dispatch('blockera/extensions');

	const { getEntity } = select('blockera/data') || {};
	const { version } = getEntity('wp');
	const { globalStylesPanel } = getTargets(version);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		new IntersectionObserverRenderer(globalStylesPanel.screen, null, {
			callback: () => {
				// Safety guard: ensure button exists before adding listener
				const globalStylesButton = document.querySelector(
					getDualGlobalStylesSelector('globalStylesSidebarButton')
				);
				const postDocumentButton = document.querySelector(
					'button[aria-controls="edit-post:document"]'
				);

				if (globalStylesButton) {
					globalStylesButton.addEventListener(
						'click',
						() => {
							setSelectedBlockStyle('');
							setSelectedBlockRef(undefined);
						},
						{ once: true }
					);
				}

				if (postDocumentButton) {
					postDocumentButton.addEventListener(
						'click',
						() => {
							changeExtensionCurrentBlock('master');
						},
						{ once: true }
					);
				}

				// Set up listeners for each block type
				blockTypes.forEach((blockType) => {
					// Safety guard: ensure blockType exists
					if (!blockType) {
						return;
					}

					// Set up click listener for block element
					const blockElement = document.querySelector(
						getBlockTypeSelector(blockType.name)
					);

					if (blockElement) {
						blockElement.addEventListener(
							'click',
							() => {
								document.body?.classList?.add(className);
								document.body?.setAttribute(
									'data-test',
									className
								);
								sharedListenerCallback(blockType.name);
							},
							{ once: true }
						);
					}
				});
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <></>;
}
