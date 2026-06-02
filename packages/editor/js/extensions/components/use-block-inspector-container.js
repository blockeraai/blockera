/**
 * External dependencies
 */
import { useEffect, useState } from '@wordpress/element';

export const BLOCK_INSPECTOR_SELECTOR = '.block-editor-block-inspector';

const isConnectedInspector = (element) =>
	Boolean(element && document.contains(element));

/**
 * Resolves the block inspector sidebar element and keeps it in sync when WordPress
 * replaces or rebuilds the inspector DOM (e.g. switching Block ↔ Styles tabs).
 */
export const useBlockInspectorContainer = () => {
	const [container, setContainer] = useState(null);

	useEffect(() => {
		const syncContainer = () => {
			const inspector = document.querySelector(BLOCK_INSPECTOR_SELECTOR);

			setContainer((previous) => {
				if (!inspector) {
					return null;
				}

				if (
					previous &&
					isConnectedInspector(previous) &&
					previous === inspector
				) {
					return previous;
				}

				return inspector;
			});
		};

		syncContainer();

		const observer = new MutationObserver(syncContainer);

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		return () => observer.disconnect();
	}, []);

	return container;
};

export const isBlockInspectorContainerReady = (container) =>
	isConnectedInspector(container);
