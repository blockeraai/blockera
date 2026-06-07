// @flow

/**
 * External dependencies
 */
import { type MixedElement } from 'react';
import { useEffect } from '@wordpress/element';
import { getBlockTypes } from '@wordpress/blocks';
import { select, dispatch, subscribe } from '@wordpress/data';

/**
 * Blockera dependencies
 */
import {
	getDualGlobalStylesSelector,
	getWordPressVersion,
} from '@blockera/global-styles-ui/panel-override';

/**
 * Internal dependencies
 */
import { resetInnerExtensionCurrentBlocksForGlobalStyles } from '../../extensions/utils';
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
	// Align extension currentBlock with WP sidebar when leaving document for global styles.
	useEffect(() => {
		const GLOBAL_STYLES_AREA = 'edit-site/global-styles';
		let previousArea =
			select('core/interface')?.getActiveComplementaryArea?.('core') ??
			null;

		const unsubscribe = subscribe(() => {
			const activeArea =
				select('core/interface')?.getActiveComplementaryArea?.(
					'core'
				) ?? null;

			if (
				activeArea === GLOBAL_STYLES_AREA &&
				previousArea !== GLOBAL_STYLES_AREA
			) {
				resetInnerExtensionCurrentBlocksForGlobalStyles();
			}

			previousArea = activeArea;
		});

		return unsubscribe;
	}, []);

	useEffect(() => {
		const blockTypes = getBlockTypes();
		const { globalStylesPanel } = getTargets(getWordPressVersion());
		const { setSelectedBlockRef, setSelectedBlockStyle } =
			dispatch('blockera/editor') || {};
		const { changeExtensionCurrentBlock } =
			dispatch('blockera/extensions') || {};

		const observer = new IntersectionObserverRenderer(
			globalStylesPanel.screen,
			null,
			{
				callback: () => {
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
								setSelectedBlockStyle?.('');
								setSelectedBlockRef?.(undefined);
								resetInnerExtensionCurrentBlocksForGlobalStyles();
							},
							{ once: true }
						);
					}

					if (postDocumentButton) {
						postDocumentButton.addEventListener(
							'click',
							() => {
								changeExtensionCurrentBlock?.('master');
							},
							{ once: true }
						);
					}

					blockTypes.forEach((blockType) => {
						if (!blockType) {
							return;
						}

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
			}
		);

		return () => {
			observer.destroy();
		};
	}, [className]);

	return <></>;
}
