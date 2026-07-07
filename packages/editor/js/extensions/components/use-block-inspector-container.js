/**
 * External dependencies
 */
import { useLayoutEffect, useState } from '@wordpress/element';

export const BLOCK_INSPECTOR_SELECTOR = '.block-editor-block-inspector';

const isConnectedInspector = (element) =>
	Boolean(element && document.contains(element));

let sharedInspectorContainer = null;
const containerListeners = new Set();
let bodyObserverStarted = false;

const notifyContainerListeners = () => {
	containerListeners.forEach((listener) => {
		listener();
	});
};

const syncSharedInspectorContainer = () => {
	const inspector = document.querySelector(BLOCK_INSPECTOR_SELECTOR);
	const next =
		inspector && isConnectedInspector(inspector) ? inspector : null;

	if (sharedInspectorContainer === next) {
		return next;
	}

	sharedInspectorContainer = next;
	notifyContainerListeners();

	return next;
};

const ensureBodyObserver = () => {
	if (bodyObserverStarted) {
		return;
	}

	bodyObserverStarted = true;
	syncSharedInspectorContainer();

	const observer = new MutationObserver(syncSharedInspectorContainer);

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
};

/**
 * Shared block inspector root — one DOM observer for the whole editor session.
 */
export const useBlockInspectorContainer = () => {
	const [container, setContainer] = useState(() => {
		ensureBodyObserver();

		return syncSharedInspectorContainer();
	});

	useLayoutEffect(() => {
		ensureBodyObserver();

		const syncContainer = () => {
			const next = syncSharedInspectorContainer();

			setContainer((current) => (current === next ? current : next));
		};

		containerListeners.add(syncContainer);

		// Inspector may mount between render and this effect (first block selection).
		syncContainer();

		return () => {
			containerListeners.delete(syncContainer);
		};
	}, []);

	return container;
};

/**
 * Resolves the inspector root synchronously (no hook subscription required).
 *
 * @return {HTMLElement|null} Connected block inspector root, if present.
 */
export const getBlockInspectorContainerSync = () => {
	ensureBodyObserver();

	return syncSharedInspectorContainer();
};

export const isBlockInspectorContainerReady = (container) =>
	isConnectedInspector(container);
