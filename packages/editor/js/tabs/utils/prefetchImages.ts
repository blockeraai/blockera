/**
 * Batch size for image prefetching
 * Small batches prevent overwhelming the browser
 */
const IMAGE_BATCH_SIZE = 4;

/**
 * Delay between batches (in milliseconds)
 * Allows browser to process other tasks between batches
 */
const BATCH_DELAY_MS = 150;

/**
 * Prefetch a single image URL
 * Uses Image preloading (primary) and link prefetch (secondary) for maximum compatibility
 *
 * @param url - Image URL to prefetch
 * @return Promise that resolves when prefetch is initiated
 */
function prefetchSingleImage(url: string): Promise<void> {
	return new Promise((resolve) => {
		// Validate URL
		if (!url || typeof url !== 'string' || url.trim() === '') {
			resolve();
			return;
		}

		const cleanUrl = url.trim();

		// Additional URL validation
		if (
			!cleanUrl.startsWith('http://') &&
			!cleanUrl.startsWith('https://') &&
			!cleanUrl.startsWith('//') &&
			!cleanUrl.startsWith('/') &&
			!cleanUrl.startsWith('data:')
		) {
			// Invalid URL format, skip
			resolve();
			return;
		}

		// Method 1: Use Image preloading (most reliable, works everywhere)
		// This actually loads the image into browser cache
		try {
			const img = new Image();
			let resolved = false;

			// Set up handlers before setting src to catch immediate loads
			img.onload = (): void => {
				if (!resolved) {
					resolved = true;
					resolve();
				}
			};
			img.onerror = (): void => {
				// Even on error, resolve to continue - image might still be cached
				if (!resolved) {
					resolved = true;
					resolve();
				}
			};

			// Set src to trigger prefetch
			// If image is already cached, onload might fire synchronously
			img.src = cleanUrl;

			// If image was already cached and loaded immediately, check complete property
			if (img.complete && !resolved) {
				resolved = true;
				resolve();
			}
		} catch {
			// If Image fails, try link prefetch
			try {
				const link = document.createElement('link');
				link.rel = 'prefetch';
				link.as = 'image';
				link.href = cleanUrl;
				// Don't set crossOrigin - let browser handle it naturally

				// Add to document head
				document.head.appendChild(link);

				// Clean up after a delay to prevent DOM bloat
				setTimeout(() => {
					try {
						if (link.parentNode) {
							link.parentNode.removeChild(link);
						}
					} catch {
						// Ignore cleanup errors
					}
				}, 30000); // 30 seconds should be enough for prefetch

				resolve();
			} catch {
				// If both methods fail, just resolve to continue
				resolve();
			}
		}
	});
}

/**
 * Yield to browser using requestIdleCallback or setTimeout
 *
 * @param callback - Callback to execute after yielding
 * @return Promise that resolves after yielding
 */
function yieldToBrowser(callback: () => void): Promise<void> {
	return new Promise((resolve) => {
		if (typeof requestIdleCallback !== 'undefined') {
			requestIdleCallback(
				() => {
					callback();
					resolve();
				},
				{ timeout: 1000 }
			);
		} else {
			// Fallback: use requestAnimationFrame + setTimeout for smooth yielding
			requestAnimationFrame(() => {
				setTimeout(() => {
					callback();
					resolve();
				}, 0);
			});
		}
	});
}

/**
 * Prefetch images in batches with delays between batches
 * This ensures the browser can process other tasks and UI remains responsive
 *
 * @param imageUrls - Array of image URLs to prefetch
 * @return Promise that resolves when all images are queued for prefetching
 */
async function prefetchImagesInBatches(imageUrls: string[]): Promise<void> {
	if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
		return;
	}

	// Deduplicate URLs
	const uniqueUrls = [...new Set(imageUrls)];

	// Process in batches
	for (let i = 0; i < uniqueUrls.length; i += IMAGE_BATCH_SIZE) {
		const batch = uniqueUrls.slice(i, i + IMAGE_BATCH_SIZE);

		// Prefetch all images in current batch in parallel
		// Await to ensure they actually start prefetching, but don't wait for completion
		try {
			await Promise.all(batch.map(prefetchSingleImage));
		} catch {
			// Silently handle batch errors - continue with next batch
		}

		// Yield to browser before next batch (except for last batch)
		if (i + IMAGE_BATCH_SIZE < uniqueUrls.length) {
			await yieldToBrowser(() => {
				// Callback runs after yielding - browser can process other tasks
			});

			// Additional small delay to ensure browser has time to process
			await new Promise<void>((resolve) => {
				setTimeout(resolve, BATCH_DELAY_MS);
			});
		}
	}
}

/**
 * Prefetch images asynchronously without blocking the UI
 *
 * This function schedules image prefetching to run in the background using
 * requestIdleCallback (or setTimeout fallback) to ensure it doesn't interfere
 * with UI rendering or user interactions.
 *
 * @param imageUrls - Array of image URLs to prefetch
 */
export function prefetchImages(imageUrls: string[]): void {
	if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
		return;
	}

	// Schedule prefetching to run asynchronously without blocking
	const schedulePrefetch = (callback: () => void): void => {
		if (typeof requestIdleCallback !== 'undefined') {
			requestIdleCallback(callback, { timeout: 2000 });
		} else {
			// Fallback: defer slightly to let current tasks complete
			setTimeout(callback, 0);
		}
	};

	// Schedule prefetching to run in background
	schedulePrefetch(() => {
		// Start prefetching in batches (non-blocking)
		// We intentionally don't await this to avoid blocking the UI
		void prefetchImagesInBatches(imageUrls).catch(() => {
			// Silently handle any errors - prefetching failures shouldn't break the UI
		});
	});
}
