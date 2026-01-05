/**
 * Options for focusing the post title.
 */
interface FocusPostTitleOptions {
	/** Maximum time to wait for the title element (ms). Default: 2000 */
	maxWait?: number;
	/** Polling interval (ms). Default: 100 */
	interval?: number;
}

/**
 * Focus on the post title in the editor and position cursor at the end.
 *
 * The post title can be either:
 * 1. Inside an iframe with name="editor-canvas" (visual editor mode)
 * 2. Directly in the document (if iframe is not used)
 *
 * This function fails silently if the title element is not found.
 *
 * @param options - Options object
 * @return Whether focusing was successful
 */
export async function focusPostTitle({
	maxWait = 2000,
	interval = 100,
}: FocusPostTitleOptions = {}): Promise<boolean> {
	const startTime = Date.now();

	/**
	 * Find the post title element by checking both iframe and main document.
	 *
	 * @return The title element, or null if not found
	 */
	const findTitleElement = (): Element | null => {
		// The post title element has class "editor-post-title" and role="textbox"
		const titleSelector = '.editor-post-title[role="textbox"]';

		// First, check the main document (for non-iframe mode)
		const mainDocTitle = document.querySelector(titleSelector);
		if (mainDocTitle) {
			return mainDocTitle;
		}

		// Then, try to find inside the editor iframe
		try {
			const iframe = document.querySelector(
				'iframe[name="editor-canvas"]'
			) as HTMLIFrameElement | null;

			if (iframe?.contentDocument) {
				const iframeTitle =
					iframe.contentDocument.querySelector(titleSelector);
				if (iframeTitle) {
					return iframeTitle;
				}
			}
		} catch {
			// Cross-origin iframe or other access error - silently ignore
		}

		return null;
	};

	/**
	 * Focus on the title element and move cursor to the end.
	 *
	 * @param titleElement - The title element to focus
	 * @return Whether the operation was successful
	 */
	const focusAndMoveCursorToEnd = (titleElement: Element): boolean => {
		try {
			// Focus the element first
			if (titleElement instanceof HTMLElement) {
				titleElement.focus();
			}

			// Move cursor to the end using Selection API
			const doc = titleElement.ownerDocument;
			const win = doc.defaultView;

			if (!win) {
				return false;
			}

			const selection = win.getSelection();

			if (!selection) {
				return false;
			}

			const range = doc.createRange();

			// Select all content and collapse to end
			range.selectNodeContents(titleElement);
			range.collapse(false); // false = collapse to end

			selection.removeAllRanges();
			selection.addRange(range);

			return true;
		} catch {
			// Any error during focus/selection - silently ignore
			return false;
		}
	};

	// Poll for the title element to appear
	return new Promise<boolean>((resolve) => {
		const checkForTitle = (): void => {
			try {
				const elapsed = Date.now() - startTime;

				// Timeout - give up silently
				if (elapsed >= maxWait) {
					resolve(false);
					return;
				}

				const titleElement = findTitleElement();

				if (titleElement) {
					// Small delay to ensure the editor is fully ready
					requestAnimationFrame(() => {
						const success = focusAndMoveCursorToEnd(titleElement);
						resolve(success);
					});
					return;
				}

				// Try again after interval
				setTimeout(checkForTitle, interval);
			} catch {
				// Any unexpected error - resolve false and don't throw
				resolve(false);
			}
		};

		// Start polling
		checkForTitle();
	});
}
