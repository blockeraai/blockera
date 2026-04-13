/**
 * Detects Site Editor "canvas edit" mode without private WordPress APIs.
 *
 * Core adds `is-full-canvas` to `.edit-site-layout` when `canvas === 'edit'`
 * (see @wordpress/edit-site layout). While the layout is not mounted yet, we
 * read `canvas` from the URL to match core defaults (`canvas` defaults to `view`).
 */

import { useSyncExternalStore } from '@wordpress/element';
import { getQueryArgs } from '@wordpress/url';

const SITE_EDITOR_PATH = 'site-editor.php';
const LAYOUT_SELECTOR = '.edit-site-layout';
const EDIT_CANVAS_CLASS = 'is-full-canvas';

function isSiteEditorUrl(): boolean {
	if (typeof window === 'undefined') {
		return false;
	}
	return window.location.pathname.includes(SITE_EDITOR_PATH);
}

/**
 * Returns true when the secondary sidebar should be shown.
 * - Outside Site Editor: always true (e.g. Post Editor).
 * - Site Editor: true only when user has entered the block editor (canvas edit).
 */
function getCanvasEditSnapshot(): boolean {
	if (!isSiteEditorUrl()) {
		return true;
	}

	const layout = document.querySelector(LAYOUT_SELECTOR);
	if (layout) {
		return layout.classList.contains(EDIT_CANVAS_CLASS);
	}

	// Layout not mounted yet — align with core: default canvas is "view" (main screen).
	const canvas = getQueryArgs(window.location.href).canvas;
	return canvas === 'edit';
}

function subscribe(onStoreChange: () => void): () => void {
	if (typeof window === 'undefined') {
		return () => undefined;
	}

	window.addEventListener('popstate', onStoreChange);

	let layoutObserver: MutationObserver | null = null;
	let pollTimer: ReturnType<typeof setInterval> | null = null;
	let layoutAttached = false;

	const attachLayoutObserver = (el: Element) => {
		layoutObserver = new MutationObserver(onStoreChange);
		layoutObserver.observe(el, {
			attributes: true,
			attributeFilter: ['class'],
		});
		onStoreChange();
	};

	const tryAttach = () => {
		if (layoutAttached) {
			return;
		}
		const el = document.querySelector(LAYOUT_SELECTOR);
		if (el) {
			layoutAttached = true;
			if (pollTimer !== null) {
				clearInterval(pollTimer);
				pollTimer = null;
			}
			attachLayoutObserver(el);
		}
	};

	tryAttach();
	if (!layoutAttached) {
		pollTimer = window.setInterval(tryAttach, 50);
	}

	return () => {
		window.removeEventListener('popstate', onStoreChange);
		layoutObserver?.disconnect();
		if (pollTimer !== null) {
			clearInterval(pollTimer);
		}
	};
}

export function useIsCanvasEditMode(): boolean {
	return useSyncExternalStore(
		subscribe,
		getCanvasEditSnapshot,
		// Server / non-browser: do not hide sidebar.
		() => true
	);
}
