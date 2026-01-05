/**
 * Hook for observing iframe lifecycle and managing iframe detection.
 * Handles iframe load events, replacement detection, and script injection.
 */

import { useEffect, useRef, useState, useCallback } from '@wordpress/element';
import { IFRAME_SELECTOR } from '../utils/constants';
import {
	getEditorCanvasIframe,
	getIframeDocument,
	injectHeightMonitoringScript,
	injectEditorStylesWrapperOverride,
} from '../utils/iframeUtils';
import type {
	UseIframeObserverOptions,
	UseIframeObserverReturn,
} from '../types';

/**
 * Hook to observe iframe lifecycle and manage iframe detection.
 * Detects iframe load events, watches for replacement, and injects height monitoring script.
 *
 * @param options - Hook options.
 * @return Current iframe and document references.
 */
export function useIframeObserver({
	onIframeLoad,
	onIframeReplace,
}: UseIframeObserverOptions = {}): UseIframeObserverReturn {
	const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
	const [iframeDocument, setIframeDocument] = useState<Document | null>(null);

	const currentIframeRef = useRef<HTMLIFrameElement | null>(null);
	const loadHandlerRef = useRef<EventListener | null>(null);

	/**
	 * Setup iframe load handler and inject monitoring script.
	 */
	const setupIframe = useCallback(
		(newIframe: HTMLIFrameElement) => {
			// Skip if this is the same iframe we're already watching
			if (newIframe === currentIframeRef.current) {
				return;
			}

			// Remove listener from previous iframe if any
			if (currentIframeRef.current && loadHandlerRef.current) {
				currentIframeRef.current.removeEventListener(
					'load',
					loadHandlerRef.current
				);
			}

			currentIframeRef.current = newIframe;

			// Create load handler (Event listener signature)
			const handleLoad = (): void => {
				const iframeDoc = getIframeDocument(newIframe);

				if (iframeDoc) {
					setIframeDocument(iframeDoc);
					setIframe(newIframe);

					// Inject height monitoring script into iframe
					injectHeightMonitoringScript(iframeDoc);

					// Inject CSS override for editor-styles-wrapper::after
					// This fixes the 40vh height issue
					injectEditorStylesWrapperOverride(iframeDoc);

					// Call callback if provided
					onIframeLoad?.(newIframe);
				}
			};

			loadHandlerRef.current = handleLoad;

			// Add load event listener
			newIframe.addEventListener('load', handleLoad);

			// If iframe is already loaded, call handler immediately
			if (newIframe.contentDocument?.readyState === 'complete') {
				handleLoad();
			}
		},
		[onIframeLoad]
	);

	/**
	 * Initial iframe detection and setup.
	 */
	useEffect(() => {
		const initialIframe = getEditorCanvasIframe();
		if (initialIframe) {
			setupIframe(initialIframe);
		}
	}, [setupIframe]);

	/**
	 * Watch for iframe replacement using MutationObserver.
	 * This handles cases where WordPress replaces the iframe dynamically.
	 */
	useEffect(() => {
		const visualEditor = document.querySelector(
			'.editor-visual-editor, .edit-post-visual-editor'
		);

		if (!visualEditor) {
			return;
		}

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					// Check if an iframe was added
					for (const node of mutation.addedNodes) {
						if (
							node.nodeType === Node.ELEMENT_NODE &&
							node instanceof HTMLIFrameElement &&
							node.getAttribute('name') === 'editor-canvas'
						) {
							// New iframe detected
							onIframeReplace?.(node);
							setupIframe(node);
						}
					}
				}
			}
		});

		observer.observe(visualEditor, {
			childList: true,
			subtree: true,
		});

		return () => {
			observer.disconnect();
		};
	}, [setupIframe, onIframeReplace]);

	/**
	 * Periodic check to ensure iframe is detected.
	 * This catches edge cases where MutationObserver might miss the iframe.
	 */
	useEffect(() => {
		const checkInterval = setInterval(() => {
			const currentIframe = getEditorCanvasIframe();

			// If we don't have an iframe but one exists, set it up
			if (currentIframe && currentIframe !== currentIframeRef.current) {
				setupIframe(currentIframe);
			}
		}, 500);

		return () => {
			clearInterval(checkInterval);
		};
	}, [setupIframe]);

	/**
	 * Cleanup on unmount.
	 */
	useEffect(() => {
		return () => {
			if (currentIframeRef.current && loadHandlerRef.current) {
				currentIframeRef.current.removeEventListener(
					'load',
					loadHandlerRef.current
				);
			}
		};
	}, []);

	return {
		iframe,
		iframeDocument,
	};
}
