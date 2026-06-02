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
import { getDualGlobalStylesSelector } from '@blockera/global-styles-ui/panel-override/selectors';

/**
 * Internal dependencies
 */
import { isInnerBlock } from '../../extensions/components';
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

	const resetExtensionCurrentBlockIfInner = () => {
		const currentBlock =
			select('blockera/extensions')?.getExtensionCurrentBlock?.() ??
			'master';

		if (isInnerBlock(currentBlock)) {
			changeExtensionCurrentBlock('master');
		}
	};

	// Align extension currentBlock with WP sidebar when leaving document for global styles.
	// eslint-disable-next-line react-hooks/rules-of-hooks
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
				resetExtensionCurrentBlockIfInner();
			}

			previousArea = activeArea;
		});

		return unsubscribe;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
							resetExtensionCurrentBlockIfInner();
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
