/**
 * External dependencies
 */
import { useEffect, useState } from '@wordpress/element';

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
		return;
	}

	sharedInspectorContainer = next;
	notifyContainerListeners();
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
	const [, setRevision] = useState(0);

	useEffect(() => {
		ensureBodyObserver();

		const listener = () => {
			setRevision((revision) => revision + 1);
		};

		containerListeners.add(listener);

		return () => {
			containerListeners.delete(listener);
		};
	}, []);

	return sharedInspectorContainer;
};

export const isBlockInspectorContainerReady = (container) =>
	isConnectedInspector(container);
