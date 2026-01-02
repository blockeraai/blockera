// Resemble.js loading state
let resembleLoaded = false;

// Helper function to append cache-busting parameter to image URLs
// Skips cache-busting for data URLs (they already contain the image data)
function addCacheBuster(url) {
	// Data URLs don't need cache busting
	if (url.startsWith('data:')) {
		return url;
	}
	const separator = url.includes('?') ? '&' : '?';
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(7);
	return url + separator + 't=' + timestamp + '&r=' + random;
}

const loadResemble = () => {
	return new Promise((resolve, reject) => {
		// Check if Resemble.js is already loaded (check both window.resemble and global resemble)
		const isResembleLoaded =
			typeof resemble !== 'undefined' ||
			(typeof window !== 'undefined' &&
				typeof window.resemble !== 'undefined');
		if (isResembleLoaded) {
			resembleLoaded = true;
			resolve();
			return;
		}

		// Wait for Resemble.js to load (with timeout)
		// Since script.js is loaded after Resemble.js via onload, it should be available
		// But we'll wait a bit to be safe in case of timing issues
		let attempts = 0;
		const maxAttempts = 100; // 10 seconds max wait
		const checkInterval = setInterval(() => {
			attempts++;
			if (
				typeof resemble !== 'undefined' ||
				(typeof window !== 'undefined' &&
					typeof window.resemble !== 'undefined')
			) {
				clearInterval(checkInterval);
				resembleLoaded = true;
				resolve();
			} else if (attempts >= maxAttempts) {
				clearInterval(checkInterval);
				reject(
					new Error(
						'Resemble.js failed to load. Please check your internet connection and try refreshing the page.'
					)
				);
			}
		}, 100);
	});
};

// State
let currentFailingIndex = -1;
const failingTestIds = [];
// Each test case has 2 comparisons: desktop and mobile
// Each comparison involves both editor and frontend files
const totalTests = tests.length * 2;
let passingTests = 0;
let failingTests = 0;
let missingTests = 0;
// Threshold for comparison (default 3% = 0.03)
let comparisonThreshold = 0.03;
// Current filter state
let currentFilter = 'all';
// Store comparison results for re-evaluation when threshold changes
const comparisonResults = new Map();
// Store image dimensions for dimension comparison
const imageDimensions = new Map();

// Initialize
document.getElementById('stat-categories').textContent = tests.length;
document.getElementById('stat-total').textContent = totalTests;

// Create test sections
const container = document.getElementById('tests-container');

tests.forEach((test, index) => {
	const section = document.createElement('div');
	section.className = 'test-section';
	section.id = `test-${test.id}`;
	section.dataset.testIndex = index;

	section.innerHTML = `
        <div class="test-header">
            <span>${test.id}</span>
            <div class="test-header-actions">
                <button class="test-retry-btn" data-test-id="${test.id}" title="Retry test">
                    Retry
                </button>
            </div>
        </div>
        <div class="row-label">Desktop</div>
        <div class="test-row desktop-row" data-test-id="${test.id}" data-type="desktop">
            <div class="image-wrapper">
                <div class="image-label" data-label-type="editor-desktop">Editor<span class="dimensions"></span></div>
                <div class="image-container" data-image-type="editor-desktop">
                    <div class="image-placeholder"></div>
                </div>
            </div>
            <div class="diff-wrapper">
                <div class="diff-label" data-diff-type="desktop">Difference<span class="dimensions"></span></div>
                <div class="diff-container" data-diff-type="desktop">
                    <div class="diff-placeholder">Loading...</div>
                </div>
            </div>
            <div class="image-wrapper">
                <div class="image-label" data-label-type="frontend-desktop">Frontend<span class="dimensions"></span></div>
                <div class="image-container" data-image-type="frontend-desktop">
                    <div class="image-placeholder"></div>
                </div>
            </div>
        </div>
        <div class="row-label">Mobile</div>
        <div class="test-row mobile-row" data-test-id="${test.id}" data-type="mobile">
            <div class="image-wrapper">
                <div class="image-label" data-label-type="editor-mobile">Editor<span class="dimensions"></span></div>
                <div class="image-container" data-image-type="editor-mobile">
                    <div class="image-placeholder"></div>
                </div>
            </div>
            <div class="diff-wrapper">
                <div class="diff-label" data-diff-type="mobile">Difference<span class="dimensions"></span></div>
                <div class="diff-container" data-diff-type="mobile">
                    <div class="diff-placeholder">Loading...</div>
                </div>
            </div>
            <div class="image-wrapper">
                <div class="image-label" data-label-type="frontend-mobile">Frontend<span class="dimensions"></span></div>
                <div class="image-container" data-image-type="frontend-mobile">
                    <div class="image-placeholder"></div>
                </div>
            </div>
        </div>
    `;

	container.appendChild(section);
});

// Attach retry button handlers
function attachRetryHandlers() {
	document.querySelectorAll('.test-retry-btn').forEach((btn) => {
		btn.addEventListener('click', async function () {
			const testId = this.dataset.testId;
			await retryTest(testId);
		});
	});
}

// Retry a specific test - reload images and re-run comparisons
async function retryTest(testId) {
	const test = tests.find((t) => t.id === testId);
	if (!test) {
		console.error('Test not found:', testId);
		return;
	}

	const section = document.getElementById(`test-${test.id}`);
	if (!section) {
		console.error('Test section not found:', testId);
		return;
	}

	const retryBtn = section.querySelector('.test-retry-btn');
	if (!retryBtn) {
		return;
	}

	// Disable button and show loading state
	retryBtn.disabled = true;
	retryBtn.classList.add('retrying');
	const originalHTML = retryBtn.innerHTML;
	retryBtn.textContent = 'Retrying...';

	// Get current test status to subtract from statistics
	const desktopContainer = section.querySelector(
		'.desktop-row .diff-container'
	);
	const mobileContainer = section.querySelector(
		'.mobile-row .diff-container'
	);
	const desktopFailed = desktopContainer?.dataset.failed === 'true';
	const mobileFailed = mobileContainer?.dataset.failed === 'true';

	const editorDesktopExists = test.images['editor-desktop']?.exists;
	const editorMobileExists = test.images['editor-mobile']?.exists;
	const frontendDesktopExists = test.images['frontend-desktop']?.exists;
	const frontendMobileExists = test.images['frontend-mobile']?.exists;

	// Subtract old counts from statistics
	if (!desktopFailed && editorDesktopExists && frontendDesktopExists) {
		passingTests = Math.max(0, passingTests - 1);
	}
	if (!mobileFailed && editorMobileExists && frontendMobileExists) {
		passingTests = Math.max(0, passingTests - 1);
	}
	if (desktopFailed && editorDesktopExists && frontendDesktopExists) {
		failingTests = Math.max(0, failingTests - 1);
	}
	if (mobileFailed && editorMobileExists && frontendMobileExists) {
		failingTests = Math.max(0, failingTests - 1);
	}
	if (!editorDesktopExists || !frontendDesktopExists) {
		missingTests = Math.max(0, missingTests - 1);
	}
	if (!editorMobileExists || !frontendMobileExists) {
		missingTests = Math.max(0, missingTests - 1);
	}

	// Remove from failing test IDs if it was there
	const failingIndex = failingTestIds.indexOf(test.id);
	if (failingIndex > -1) {
		failingTestIds.splice(failingIndex, 1);
	}

	// Clear old comparison results
	comparisonResults.delete(`${test.id}-desktop`);
	comparisonResults.delete(`${test.id}-mobile`);

	// Clear image dimensions
	imageDimensions.delete(`${test.id}-editor-desktop`);
	imageDimensions.delete(`${test.id}-frontend-desktop`);
	imageDimensions.delete(`${test.id}-editor-mobile`);
	imageDimensions.delete(`${test.id}-frontend-mobile`);

	// Reset diff containers to loading state
	const desktopDiffContainer = section.querySelector(
		'.desktop-row .diff-container'
	);
	const mobileDiffContainer = section.querySelector(
		'.mobile-row .diff-container'
	);
	if (desktopDiffContainer) {
		desktopDiffContainer.innerHTML =
			'<div class="diff-placeholder">Loading...</div>';
		desktopDiffContainer.dataset.failed = '';
	}
	if (mobileDiffContainer) {
		mobileDiffContainer.innerHTML =
			'<div class="diff-placeholder">Loading...</div>';
		mobileDiffContainer.dataset.failed = '';
	}

	// Reset diff labels
	const desktopDiffLabel = section.querySelector('.desktop-row .diff-label');
	const mobileDiffLabel = section.querySelector('.mobile-row .diff-label');
	if (desktopDiffLabel) {
		desktopDiffLabel.innerHTML =
			'Difference<span class="dimensions"></span>';
		desktopDiffLabel.classList.remove('passing', 'failing');
	}
	if (mobileDiffLabel) {
		mobileDiffLabel.innerHTML =
			'Difference<span class="dimensions"></span>';
		mobileDiffLabel.classList.remove('passing', 'failing');
	}

	// Reset row failed state
	const desktopRow = section.querySelector('.desktop-row');
	const mobileRow = section.querySelector('.mobile-row');
	if (desktopRow) {
		desktopRow.dataset.failed = '';
	}
	if (mobileRow) {
		mobileRow.dataset.failed = '';
	}

	// Reload images with cache-busting and wait for them to fully load
	const imageTypes = [
		'editor-desktop',
		'frontend-desktop',
		'editor-mobile',
		'frontend-mobile',
	];
	const imageLoadPromises = [];

	for (const imageType of imageTypes) {
		const imageData = test.images[imageType];
		const container = section.querySelector(
			`.image-container[data-image-type="${imageType}"]`
		);
		const placeholder = container?.querySelector('.image-placeholder');
		const label = section.querySelector(
			`.image-label[data-label-type="${imageType}"]`
		);
		const dimensionsSpan = label?.querySelector('.dimensions');

		if (!imageData.exists || !container || !placeholder) {
			continue;
		}

		// Clear existing image
		placeholder.innerHTML = '';
		container.classList.remove('missing');

		// Load new image with cache-busting
		const img = document.createElement('img');
		img.src = addCacheBuster(imageData.url);
		img.alt = imageData.filename;

		// Create promise for this image load
		const imageLoadPromise = new Promise((resolve, reject) => {
			img.onerror = function () {
				container.classList.add('missing');
				if (dimensionsSpan) {
					dimensionsSpan.textContent = '';
				}
				placeholder.innerHTML = `
					<div class="missing-image">
						<div class="missing-image-icon">❌</div>
						<div class="missing-image-text">Failed to Load</div>
						<div style="font-size: 12px; margin-top: 5px; opacity: 0.7;">${imageData.filename}</div>
					</div>
				`;
				reject(new Error(`Failed to load ${imageType}`));
			};
			img.onload = function () {
				placeholder.innerHTML = '';
				placeholder.appendChild(img);
				if (dimensionsSpan) {
					dimensionsSpan.textContent = `(${img.naturalWidth} × ${img.naturalHeight})`;
				}
				const dimensionKey = `${test.id}-${imageType}`;
				imageDimensions.set(dimensionKey, {
					width: img.naturalWidth,
					height: img.naturalHeight,
				});
				checkAndUpdateRowLabelDimensions(test.id, imageType);
				img.addEventListener('click', function () {
					openLightbox(
						img.src,
						`${imageType.replace('-', ' ')} - ${test.id}`
					);
				});
				resolve(img);
			};
		});

		imageLoadPromises.push(imageLoadPromise);
		placeholder.appendChild(img);
	}

	// Wait for all images to fully load before proceeding with comparisons
	try {
		await Promise.all(imageLoadPromises);
	} catch (error) {
		// Some images failed to load, but continue with comparisons for the ones that loaded
		console.warn('Some images failed to load during retry:', error);
	}

	// Re-run comparisons using the newly loaded images
	await processComparison(test, 'desktop');
	await new Promise((resolve) => setTimeout(resolve, 0));
	await processComparison(test, 'mobile');

	// Update statistics with new results
	const newDesktopFailed = desktopDiffContainer?.dataset.failed === 'true';
	const newMobileFailed = mobileDiffContainer?.dataset.failed === 'true';

	if (!newDesktopFailed && editorDesktopExists && frontendDesktopExists) {
		passingTests++;
	}
	if (!newMobileFailed && editorMobileExists && frontendMobileExists) {
		passingTests++;
	}
	if (newDesktopFailed && editorDesktopExists && frontendDesktopExists) {
		failingTests++;
	}
	if (newMobileFailed && editorMobileExists && frontendMobileExists) {
		failingTests++;
	}
	if (!editorDesktopExists || !frontendDesktopExists) {
		missingTests++;
	}
	if (!editorMobileExists || !frontendMobileExists) {
		missingTests++;
	}

	// Update failing test IDs
	if (
		(newDesktopFailed && editorDesktopExists && frontendDesktopExists) ||
		(newMobileFailed && editorMobileExists && frontendMobileExists)
	) {
		if (!failingTestIds.includes(test.id)) {
			failingTestIds.push(test.id);
		}
	}

	// Update test section status
	updateTestSectionStatus(
		test.id,
		newDesktopFailed,
		newMobileFailed,
		editorDesktopExists,
		frontendDesktopExists,
		editorMobileExists,
		frontendMobileExists
	);

	// Update statistics display
	document.getElementById('stat-passing').textContent = passingTests;
	document.getElementById('stat-failing').textContent = failingTests;
	document.getElementById('stat-missing').textContent = missingTests;

	// Update navigation buttons
	updateNavigationButtons();

	// Re-enable button
	retryBtn.disabled = false;
	retryBtn.classList.remove('retrying');
	retryBtn.innerHTML = originalHTML;
}

// Load images and render placeholders
tests.forEach((test) => {
	[
		'editor-desktop',
		'frontend-desktop',
		'editor-mobile',
		'frontend-mobile',
	].forEach((imageType) => {
		const imageData = test.images[imageType];
		const container = document.querySelector(
			`#test-${test.id} .image-container[data-image-type="${imageType}"]`
		);
		const placeholder = container.querySelector('.image-placeholder');
		const label = document.querySelector(
			`#test-${test.id} .image-label[data-label-type="${imageType}"]`
		);
		const dimensionsSpan = label
			? label.querySelector('.dimensions')
			: null;

		if (!imageData.exists) {
			container.classList.add('missing');
			if (dimensionsSpan) {
				dimensionsSpan.textContent = '';
			}
			placeholder.innerHTML = `
                <div class="missing-image">
                    <div class="missing-image-icon">🖼️</div>
                    <div class="missing-image-text">Image Not Found</div>
                    <div style="font-size: 12px; margin-top: 5px; opacity: 0.7;">${imageData.filename}</div>
                </div>
            `;
		} else {
			const img = document.createElement('img');
			// Append cache-busting parameter to prevent browser caching
			img.src = addCacheBuster(imageData.url);
			img.alt = imageData.filename;
			img.onerror = function () {
				container.classList.add('missing');
				if (dimensionsSpan) {
					dimensionsSpan.textContent = '';
				}
				placeholder.innerHTML = `
                    <div class="missing-image">
                        <div class="missing-image-icon">❌</div>
                        <div class="missing-image-text">Failed to Load</div>
                        <div style="font-size: 12px; margin-top: 5px; opacity: 0.7;">${imageData.filename}</div>
                    </div>
                `;
			};
			img.onload = function () {
				placeholder.innerHTML = '';
				placeholder.appendChild(img);
				// Update dimensions in label
				if (dimensionsSpan) {
					dimensionsSpan.textContent = `(${img.naturalWidth} × ${img.naturalHeight})`;
				}
				// Store dimensions for comparison
				const dimensionKey = `${test.id}-${imageType}`;
				imageDimensions.set(dimensionKey, {
					width: img.naturalWidth,
					height: img.naturalHeight,
				});
				// Check dimensions and update row label
				checkAndUpdateRowLabelDimensions(test.id, imageType);
				// Add click handler for lightbox
				img.addEventListener('click', function () {
					openLightbox(
						img.src,
						`${imageType.replace('-', ' ')} - ${test.id}`
					);
				});
			};
			placeholder.appendChild(img);
		}
	});
});

// Attach retry handlers after images are loaded
attachRetryHandlers();

// Function to update test section status (checkmark and background)
function updateTestSectionStatus(
	testId,
	desktopFailed,
	mobileFailed,
	editorDesktopExists,
	frontendDesktopExists,
	editorMobileExists,
	frontendMobileExists
) {
	const section = document.getElementById(`test-${testId}`);
	if (!section) return;

	const testHeader = section.querySelector('.test-header');
	if (!testHeader) return;

	// Check if images are missing
	const hasMissingImages =
		!editorDesktopExists ||
		!frontendDesktopExists ||
		!editorMobileExists ||
		!frontendMobileExists;

	// Check if both desktop and mobile passed (only if images exist)
	const desktopPassed =
		!desktopFailed && editorDesktopExists && frontendDesktopExists;
	const mobilePassed =
		!mobileFailed && editorMobileExists && frontendMobileExists;
	const bothPassed = desktopPassed && mobilePassed;

	// Check if comparison failed (images exist but comparison failed)
	const eitherFailed =
		(desktopFailed && editorDesktopExists && frontendDesktopExists) ||
		(mobileFailed && editorMobileExists && frontendMobileExists);

	// Get or create actions container
	let actionsContainer = testHeader.querySelector('.test-header-actions');
	if (!actionsContainer) {
		actionsContainer = document.createElement('div');
		actionsContainer.className = 'test-header-actions';
		// Find retry button - it should already be in a test-header-actions container
		const retryBtn = testHeader.querySelector('.test-retry-btn');
		if (
			retryBtn &&
			retryBtn.parentNode &&
			retryBtn.parentNode.classList.contains('test-header-actions')
		) {
			// Retry button is already in an actions container, use that
			actionsContainer = retryBtn.parentNode;
		} else {
			// Create new container and append to header
			testHeader.appendChild(actionsContainer);
			// Move retry button if it exists
			if (retryBtn && retryBtn.parentNode) {
				actionsContainer.appendChild(retryBtn);
			}
		}
	}

	// Move any existing status icons to actions container if they're not already there
	const existingStatusIcons = testHeader.querySelectorAll(
		'.test-header-checkmark, .test-header-xmark, .test-header-missing'
	);
	existingStatusIcons.forEach((icon) => {
		if (icon.parentNode !== actionsContainer) {
			actionsContainer.appendChild(icon);
		}
	});

	// Add or remove checkmark/X icon/Missing icon
	let checkmark = actionsContainer.querySelector('.test-header-checkmark');
	let xmark = actionsContainer.querySelector('.test-header-xmark');
	let missingIcon = actionsContainer.querySelector('.test-header-missing');

	if (bothPassed) {
		// Both passed: show checkmark, remove other icons
		if (!checkmark) {
			checkmark = document.createElement('div');
			checkmark.className = 'test-header-checkmark';
			checkmark.textContent = '✓';
			actionsContainer.appendChild(checkmark);
		}
		if (xmark) {
			xmark.remove();
		}
		if (missingIcon) {
			missingIcon.remove();
		}
		section.classList.add('test-passed');
		section.classList.remove('test-failed');
		section.classList.remove('test-missing');
	} else if (hasMissingImages) {
		// Images missing: show missing icon, remove other icons
		if (!missingIcon) {
			missingIcon = document.createElement('div');
			missingIcon.className = 'test-header-missing';
			missingIcon.textContent = '⚠';
			actionsContainer.appendChild(missingIcon);
		}
		if (checkmark) {
			checkmark.remove();
		}
		if (xmark) {
			xmark.remove();
		}
		section.classList.add('test-missing');
		section.classList.remove('test-passed');
		section.classList.remove('test-failed');
	} else if (eitherFailed) {
		// Comparison failed: show X icon, remove other icons
		if (!xmark) {
			xmark = document.createElement('div');
			xmark.className = 'test-header-xmark';
			xmark.textContent = '✕';
			actionsContainer.appendChild(xmark);
		}
		if (checkmark) {
			checkmark.remove();
		}
		if (missingIcon) {
			missingIcon.remove();
		}
		section.classList.add('test-failed');
		section.classList.remove('test-passed');
		section.classList.remove('test-missing');
	} else {
		// Neither condition met (shouldn't happen in practice)
		if (checkmark) {
			checkmark.remove();
		}
		if (xmark) {
			xmark.remove();
		}
		if (missingIcon) {
			missingIcon.remove();
		}
		section.classList.remove('test-passed');
		section.classList.remove('test-failed');
		section.classList.remove('test-missing');
	}

	// Apply current filter after status update
	applyFilter();
}

// Function to set the active filter
function setFilter(filter) {
	currentFilter = filter;

	// Update button states
	document.querySelectorAll('.filter-btn').forEach((btn) => {
		if (btn.dataset.filter === filter) {
			btn.classList.add('active');
		} else {
			btn.classList.remove('active');
		}
	});

	// Apply the filter
	applyFilter();
}

// Attach filter button event listeners
function attachFilterHandlers() {
	document.querySelectorAll('.filter-btn').forEach((btn) => {
		btn.addEventListener('click', function () {
			setFilter(this.dataset.filter);
		});
	});
}

// Function to apply the current filter to test sections
function applyFilter() {
	const testSections = document.querySelectorAll('.test-section');

	testSections.forEach((section) => {
		const isPassed = section.classList.contains('test-passed');
		const isFailed = section.classList.contains('test-failed');
		const isMissing = section.classList.contains('test-missing');

		let shouldShow = false;

		switch (currentFilter) {
			case 'all':
				shouldShow = true;
				break;
			case 'passing':
				shouldShow = isPassed;
				break;
			case 'failing':
				shouldShow = isFailed;
				break;
			case 'missing':
				shouldShow = isMissing;
				break;
			default:
				shouldShow = true;
		}

		if (shouldShow) {
			section.style.display = '';
		} else {
			section.style.display = 'none';
		}
	});
}

// Function to check and update row label dimensions
function checkAndUpdateRowLabelDimensions(testId, imageType) {
	// Determine row type (desktop or mobile)
	const isDesktop = imageType.includes('desktop');
	const rowType = isDesktop ? 'desktop' : 'mobile';

	// Get editor and frontend image types for this row
	const editorType = isDesktop ? 'editor-desktop' : 'editor-mobile';
	const frontendType = isDesktop ? 'frontend-desktop' : 'frontend-mobile';

	// Get dimensions for both images
	const editorKey = `${testId}-${editorType}`;
	const frontendKey = `${testId}-${frontendType}`;
	const editorDims = imageDimensions.get(editorKey);
	const frontendDims = imageDimensions.get(frontendKey);

	// Both images must be loaded to compare
	if (!editorDims || !frontendDims) {
		return;
	}

	// Get row label element - find it by selecting the test row and getting its previous sibling
	const testRow = document.querySelector(
		`#test-${testId} .test-row.${rowType}-row`
	);
	if (!testRow) {
		return;
	}

	const rowLabel = testRow.previousElementSibling;
	if (!rowLabel || !rowLabel.classList.contains('row-label')) {
		return;
	}

	// Compare dimensions
	const widthDiff = editorDims.width !== frontendDims.width;
	const heightDiff = editorDims.height !== frontendDims.height;

	// Remove existing warning if any
	const existingWarning = rowLabel.querySelector('.dimension-warning');
	if (existingWarning) {
		existingWarning.remove();
	}

	// Add warning if dimensions differ
	if (widthDiff || heightDiff) {
		let warningText = '';
		if (widthDiff && heightDiff) {
			warningText = 'Different width and height';
		} else if (widthDiff) {
			warningText = 'Different width';
		} else if (heightDiff) {
			warningText = 'Different height';
		}

		if (warningText) {
			const warningSpan = document.createElement('span');
			warningSpan.className = 'dimension-warning';
			warningSpan.textContent = warningText;
			rowLabel.appendChild(warningSpan);
		}
	}
}

// Comparison function using Resemble.js
async function compareImages(img1, img2, width, height) {
	return new Promise((resolve) => {
		try {
			// Get Resemble.js API reference
			let resembleApi = null;
			if (typeof resemble !== 'undefined') {
				resembleApi = resemble;
			} else if (
				typeof window !== 'undefined' &&
				typeof window.resemble !== 'undefined'
			) {
				resembleApi = window.resemble;
			}

			if (!resembleLoaded || !resembleApi) {
				resolve({
					identical: false,
					error: 'Resemble.js not loaded',
				});
				return;
			}

			// Convert images to data URLs for Resemble.js
			const canvas1 = document.createElement('canvas');
			const canvas2 = document.createElement('canvas');
			canvas1.width = img1.naturalWidth;
			canvas1.height = img1.naturalHeight;
			canvas2.width = img2.naturalWidth;
			canvas2.height = img2.naturalHeight;

			const ctx1 = canvas1.getContext('2d');
			const ctx2 = canvas2.getContext('2d');
			ctx1.drawImage(img1, 0, 0);
			ctx2.drawImage(img2, 0, 0);

			const img1DataUrl = canvas1.toDataURL('image/png');
			const img2DataUrl = canvas2.toDataURL('image/png');

			// Configure Resemble.js output settings
			resembleApi.outputSettings({
				errorType: 'movementDifferenceIntensity',
				transparency: 0.3,
				largeImageThreshold: 0, // Disable threshold to process all images
				useCrossOrigin: false,
			});

			// Create comparison with Resemble.js
			resembleApi(img1DataUrl)
				.compareTo(img2DataUrl)
				.scaleToSameSize()
				.ignoreLess()
				.onComplete(function (data) {
					try {
						// Resemble.js returns mismatch percentage (0-100)
						const diffPercentage = data.misMatchPercentage / 100;

						// Get the diff image data URL
						const diffImageDataUrl = data.getImageDataUrl();

						// Create a canvas from the diff image to ensure consistent dimensions
						const diffImg = new Image();
						diffImg.onload = function () {
							const diffCanvas = document.createElement('canvas');
							diffCanvas.width = width;
							diffCanvas.height = height;
							const diffCtx = diffCanvas.getContext('2d');
							diffCtx.drawImage(diffImg, 0, 0, width, height);

							resolve({
								identical: data.misMatchPercentage === 0,
								diffCount: Math.floor(
									(data.misMatchPercentage / 100) *
										width *
										height
								),
								diffPercentage,
								diffImage: diffCanvas.toDataURL(),
							});
						};
						diffImg.onerror = function () {
							resolve({
								identical: false,
								error: 'Failed to load diff image',
							});
						};
						diffImg.src = diffImageDataUrl;
					} catch (error) {
						resolve({
							identical: false,
							error: error.message,
						});
					}
				});
		} catch (error) {
			resolve({
				identical: false,
				error: error.message,
			});
		}
	});
}

// Process comparisons sequentially
async function processComparisons() {
	const progressIndicator = document.getElementById('progress-indicator');
	const progressText = document.getElementById('progress-text');
	progressIndicator.classList.add('active');

	let completed = 0;
	const total = tests.length * 2; // desktop + mobile comparisons per test

	for (let testIndex = 0; testIndex < tests.length; testIndex++) {
		const test = tests[testIndex];

		// Process desktop comparison
		await processComparison(test, 'desktop', testIndex);
		completed++;
		progressText.textContent = `Comparing ${completed} of ${total} comparisons...`;

		// Yield to browser
		await new Promise((resolve) => setTimeout(resolve, 0));

		// Process mobile comparison
		await processComparison(test, 'mobile', testIndex);
		completed++;
		progressText.textContent = `Comparing ${completed} of ${total} comparisons...`;

		// Update test status
		const section = document.getElementById(`test-${test.id}`);
		const desktopFailed =
			section.querySelector('.desktop-row .diff-container').dataset
				.failed === 'true';
		const mobileFailed =
			section.querySelector('.mobile-row .diff-container').dataset
				.failed === 'true';

		// Check if images exist
		const editorDesktopExists = test.images['editor-desktop']?.exists;
		const editorMobileExists = test.images['editor-mobile']?.exists;
		const frontendDesktopExists = test.images['frontend-desktop']?.exists;
		const frontendMobileExists = test.images['frontend-mobile']?.exists;

		// Count passing tests
		// Each comparison is 1 test: editor-desktop vs frontend-desktop OR editor-mobile vs frontend-mobile
		// Desktop comparison: test passes if both images exist and comparison passes
		if (!desktopFailed && editorDesktopExists && frontendDesktopExists) {
			passingTests++; // 1 test passes
		}
		// Mobile comparison: test passes if both images exist and comparison passes
		if (!mobileFailed && editorMobileExists && frontendMobileExists) {
			passingTests++; // 1 test passes
		}

		// Count failing tests (only if images exist - missing images are not counted as failures)
		// Each failed comparison is 1 failing test
		if (desktopFailed && editorDesktopExists && frontendDesktopExists) {
			failingTests++; // 1 test fails
		}
		if (mobileFailed && editorMobileExists && frontendMobileExists) {
			failingTests++; // 1 test fails
		}

		// Count missing tests (when images don't exist)
		if (!editorDesktopExists || !frontendDesktopExists) {
			missingTests++; // 1 test is missing
		}
		if (!editorMobileExists || !frontendMobileExists) {
			missingTests++; // 1 test is missing
		}

		// Track test cases with failures for navigation (only actual failures, not missing)
		if (
			(desktopFailed && editorDesktopExists && frontendDesktopExists) ||
			(mobileFailed && editorMobileExists && frontendMobileExists)
		) {
			failingTestIds.push(test.id);
		}

		// Update test section status (checkmark and background)
		updateTestSectionStatus(
			test.id,
			desktopFailed,
			mobileFailed,
			editorDesktopExists,
			frontendDesktopExists,
			editorMobileExists,
			frontendMobileExists
		);

		// Update statistics
		document.getElementById('stat-passing').textContent = passingTests;
		document.getElementById('stat-failing').textContent = failingTests;
		document.getElementById('stat-missing').textContent = missingTests;

		// Yield to browser
		await new Promise((resolve) => setTimeout(resolve, 0));
	}

	progressIndicator.classList.remove('active');
	updateNavigationButtons();

	// Ensure threshold handler is attached after comparisons complete
	attachThresholdHandler();

	// Apply current filter after all comparisons complete
	applyFilter();
}

async function processComparison(test, type) {
	const editorType = `editor-${type}`;
	const frontendType = `frontend-${type}`;

	const editorData = test.images[editorType];
	const frontendData = test.images[frontendType];

	const diffContainer = document.querySelector(
		`#test-${test.id} .diff-container[data-diff-type="${type}"]`
	);
	const diffLabel = document.querySelector(
		`#test-${test.id} .diff-label[data-diff-type="${type}"]`
	);
	const diffDimensionsSpan = diffLabel
		? diffLabel.querySelector('.dimensions')
		: null;
	const row = document.querySelector(`#test-${test.id} .${type}-row`);

	// Check if images exist
	if (!editorData.exists || !frontendData.exists) {
		diffContainer.innerHTML =
			'<div class="diff-error">⚠️ Missing Image</div>';
		if (diffDimensionsSpan) {
			diffDimensionsSpan.textContent = '';
		}
		diffContainer.dataset.failed = 'true';
		row.dataset.failed = 'true';
		return;
	}

	// Check if images are already loaded in the DOM (e.g., from retry)
	const existingEditorImg = document.querySelector(
		`#test-${test.id} .image-container[data-image-type="${editorType}"] img`
	);
	const existingFrontendImg = document.querySelector(
		`#test-${test.id} .image-container[data-image-type="${frontendType}"] img`
	);

	let editorImg, frontendImg;
	let imagesLoaded;

	// If images are already loaded in DOM and complete, use them
	if (
		existingEditorImg &&
		existingEditorImg.complete &&
		existingEditorImg.naturalWidth > 0 &&
		existingFrontendImg &&
		existingFrontendImg.complete &&
		existingFrontendImg.naturalWidth > 0
	) {
		editorImg = existingEditorImg;
		frontendImg = existingFrontendImg;
		imagesLoaded = Promise.resolve();
	} else {
		// Load images fresh with cache-busting
		editorImg = new Image();
		frontendImg = new Image();

		imagesLoaded = Promise.all([
			new Promise((resolve, reject) => {
				editorImg.onload = resolve;
				editorImg.onerror = () =>
					reject(new Error('Editor image failed to load'));
				// Append cache-busting parameter to prevent browser caching
				editorImg.src = addCacheBuster(editorData.url);
			}),
			new Promise((resolve, reject) => {
				frontendImg.onload = resolve;
				frontendImg.onerror = () =>
					reject(new Error('Frontend image failed to load'));
				// Append cache-busting parameter to prevent browser caching
				frontendImg.src = addCacheBuster(frontendData.url);
			}),
		]);
	}

	try {
		await imagesLoaded;

		// Ensure both images have same dimensions
		const width = Math.max(
			editorImg.naturalWidth,
			frontendImg.naturalWidth
		);
		const height = Math.max(
			editorImg.naturalHeight,
			frontendImg.naturalHeight
		);

		// Update diff label dimensions
		if (diffDimensionsSpan) {
			diffDimensionsSpan.textContent = `(${width} × ${height})`;
		}

		const result = await compareImages(
			editorImg,
			frontendImg,
			width,
			height
		);

		// Update diff label with difference percentage
		if (diffLabel && result.diffPercentage !== undefined) {
			const percentageText = result.identical
				? '0.0%'
				: (result.diffPercentage * 100).toFixed(2) + '%';
			const labelText = diffLabel.textContent.split('(')[0].trim();
			diffLabel.innerHTML = `${labelText} (${percentageText})<span class="dimensions"></span>`;
			const updatedDimensionsSpan =
				diffLabel.querySelector('.dimensions');
			if (updatedDimensionsSpan && diffDimensionsSpan) {
				updatedDimensionsSpan.textContent =
					diffDimensionsSpan.textContent;
			}
		}

		// Store result for re-evaluation when threshold changes
		const resultKey = `${test.id}-${type}`;
		comparisonResults.set(resultKey, {
			result,
			test,
			type,
			diffContainer,
			diffLabel,
			diffDimensionsSpan,
			row,
			editorType,
			frontendType,
		});

		if (result.error) {
			diffContainer.innerHTML = `<div class="diff-error">Error: ${result.error}</div>`;
			diffContainer.dataset.failed = 'true';
			row.dataset.failed = 'true';
			// Update diff label classes
			if (diffLabel) {
				diffLabel.classList.remove('passing');
				diffLabel.classList.add('failing');
			}
		} else if (
			result.identical ||
			(result.diffPercentage !== undefined &&
				result.diffPercentage < comparisonThreshold)
		) {
			// Show diff image with 70% opacity and checkmark overlay for passing tests
			const diffImg = document.createElement('img');
			diffImg.src = result.diffImage;
			diffImg.className = 'diff-image diff-image-passing';
			diffImg.alt = 'Difference';
			diffImg.addEventListener('click', function () {
				// Get editor and frontend image URLs for comparison modes
				const editorImg = document.querySelector(
					`#test-${test.id} .image-container[data-image-type="${editorType}"] img`
				);
				const frontendImg = document.querySelector(
					`#test-${test.id} .image-container[data-image-type="${frontendType}"] img`
				);
				const editorSrc = editorImg ? editorImg.src : null;
				const frontendSrc = frontendImg ? frontendImg.src : null;
				openLightbox(
					result.diffImage,
					`Difference - ${type} - ${test.id}`,
					editorSrc,
					frontendSrc
				);
			});
			const checkmarkOverlay = document.createElement('div');
			checkmarkOverlay.className = 'checkmark checkmark-overlay';
			checkmarkOverlay.textContent = '✓';
			diffContainer.innerHTML = '';
			diffContainer.appendChild(diffImg);
			diffContainer.appendChild(checkmarkOverlay);
			diffContainer.dataset.failed = 'false';
			// Update diff label classes
			if (diffLabel) {
				diffLabel.classList.remove('failing');
				diffLabel.classList.add('passing');
			}
		} else {
			const diffImg = document.createElement('img');
			diffImg.src = result.diffImage;
			diffImg.className = 'diff-image';
			diffImg.alt = 'Difference';
			diffImg.addEventListener('click', function () {
				// Get editor and frontend image URLs for comparison modes
				const editorImg = document.querySelector(
					`#test-${test.id} .image-container[data-image-type="${editorType}"] img`
				);
				const frontendImg = document.querySelector(
					`#test-${test.id} .image-container[data-image-type="${frontendType}"] img`
				);
				const editorSrc = editorImg ? editorImg.src : null;
				const frontendSrc = frontendImg ? frontendImg.src : null;
				openLightbox(
					result.diffImage,
					`Difference - ${type} - ${test.id}`,
					editorSrc,
					frontendSrc
				);
			});
			diffContainer.innerHTML = '';
			diffContainer.appendChild(diffImg);
			diffContainer.dataset.failed = 'true';
			row.dataset.failed = 'true';
			// Update diff label classes
			if (diffLabel) {
				diffLabel.classList.remove('passing');
				diffLabel.classList.add('failing');
			}
		}
	} catch (error) {
		diffContainer.innerHTML = `<div class="diff-error">Error: ${error.message}</div>`;
		diffContainer.dataset.failed = 'true';
		row.dataset.failed = 'true';
		// Update diff label classes
		if (diffLabel) {
			diffLabel.classList.remove('passing');
			diffLabel.classList.add('failing');
		}
	}
}

// Navigation functions
function updateNavigationButtons() {
	const prevBtn = document.getElementById('btn-prev');
	const nextBtn = document.getElementById('btn-next');

	// Return early if buttons don't exist
	if (!prevBtn || !nextBtn) {
		return;
	}

	if (failingTestIds.length === 0) {
		prevBtn.disabled = true;
		nextBtn.disabled = true;
		return;
	}

	if (currentFailingIndex <= 0) {
		prevBtn.disabled = true;
	} else {
		prevBtn.disabled = false;
	}

	if (currentFailingIndex >= failingTestIds.length - 1) {
		nextBtn.disabled = true;
	} else {
		nextBtn.disabled = false;
	}
}

// Used on the index.php
// eslint-disable-next-line no-unused-vars
function navigateToFailing(direction) {
	if (failingTestIds.length === 0) {
		return;
	}

	currentFailingIndex += direction;
	currentFailingIndex = Math.max(
		0,
		Math.min(currentFailingIndex, failingTestIds.length - 1)
	);

	const testId = failingTestIds[currentFailingIndex];
	const section = document.getElementById(`test-${testId}`);

	if (section) {
		// Remove previous highlights
		document.querySelectorAll('.test-section.highlighted').forEach((s) => {
			s.classList.remove('highlighted');
		});

		// Highlight current
		section.classList.add('highlighted');

		// Scroll to section
		section.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	updateNavigationButtons();
}

// Lightbox state
let lightboxState = {
	editorImageSrc: null,
	frontendImageSrc: null,
	diffImageSrc: null,
	caption: '',
	isComparison: false,
	currentMode: 'difference',
};

// Lightbox functions
function openLightbox(imageSrc, caption, editorSrc = null, frontendSrc = null) {
	const lightbox = document.getElementById('lightbox');
	const container = document.getElementById('lightbox-comparison-container');
	const lightboxCaption = document.getElementById('lightbox-caption');

	// Check if this is a comparison (diff image)
	const isComparison = editorSrc !== null && frontendSrc !== null;

	lightboxState = {
		editorImageSrc: editorSrc,
		frontendImageSrc: frontendSrc,
		diffImageSrc: imageSrc,
		caption,
		isComparison,
		currentMode: 'difference',
	};

	// Render all comparison modes if it's a comparison, otherwise just show the image
	if (isComparison) {
		renderAllComparisonModes();
	} else {
		container.innerHTML = '';
		container.className = '';
		const img = document.createElement('img');
		img.className = 'lightbox-image';
		// Append cache-busting parameter to prevent browser caching
		img.src = addCacheBuster(imageSrc);
		img.alt = caption;
		container.appendChild(img);
	}

	lightboxCaption.textContent = caption;
	lightbox.classList.add('active');
	document.body.style.overflow = 'hidden';
}

function renderAllComparisonModes() {
	const container = document.getElementById('lightbox-comparison-container');
	container.innerHTML = '';
	container.className = 'comparison-modes-container';

	// Difference mode
	const differenceSection = document.createElement('div');
	differenceSection.className = 'comparison-mode-section';
	const differenceTitle = document.createElement('div');
	differenceTitle.className = 'comparison-mode-title';
	differenceTitle.textContent = 'Difference';
	const differenceContainer = document.createElement('div');
	differenceContainer.className = 'comparison-difference';
	const diffImg = document.createElement('img');
	diffImg.className = 'lightbox-image';
	diffImg.src = lightboxState.diffImageSrc;
	diffImg.alt = 'Difference';
	differenceContainer.appendChild(diffImg);
	differenceSection.appendChild(differenceTitle);
	differenceSection.appendChild(differenceContainer);
	container.appendChild(differenceSection);

	// Side-by-side mode
	const sideBySideSection = document.createElement('div');
	sideBySideSection.className = 'comparison-mode-section';
	const sideBySideTitle = document.createElement('div');
	sideBySideTitle.className = 'comparison-mode-title';
	sideBySideTitle.textContent = 'Side by Side';
	const sideBySideContainer = document.createElement('div');
	sideBySideContainer.className = 'comparison-side-by-side';
	const editorImg = document.createElement('img');
	// Append cache-busting parameter to prevent browser caching
	editorImg.src = addCacheBuster(lightboxState.editorImageSrc);
	editorImg.alt = 'Editor';
	const frontendImg = document.createElement('img');
	frontendImg.src = addCacheBuster(lightboxState.frontendImageSrc);
	frontendImg.alt = 'Frontend';
	sideBySideContainer.appendChild(editorImg);
	sideBySideContainer.appendChild(frontendImg);
	sideBySideSection.appendChild(sideBySideTitle);
	sideBySideSection.appendChild(sideBySideContainer);
	container.appendChild(sideBySideSection);

	// Overlay mode
	const overlaySection = document.createElement('div');
	overlaySection.className = 'comparison-mode-section';
	const overlayTitle = document.createElement('div');
	overlayTitle.className = 'comparison-mode-title';
	overlayTitle.textContent = 'Overlay (drag slider to compare)';
	const overlayContainer = document.createElement('div');
	overlayContainer.className = 'comparison-overlay';

	const baseImg = document.createElement('img');
	baseImg.className = 'base-image';
	// Append cache-busting parameter to prevent browser caching
	baseImg.src = addCacheBuster(lightboxState.editorImageSrc);
	baseImg.alt = 'Editor';

	const overlayImg = document.createElement('img');
	overlayImg.className = 'overlay-image';
	overlayImg.src = addCacheBuster(lightboxState.frontendImageSrc);
	overlayImg.alt = 'Frontend';

	// Ensure overlay image matches base image dimensions exactly
	function updateOverlaySize() {
		if (
			baseImg.complete &&
			baseImg.naturalWidth > 0 &&
			baseImg.naturalHeight > 0
		) {
			// Use natural dimensions to calculate displayed size
			const baseRect = baseImg.getBoundingClientRect();
			const containerRect = overlayContainer.getBoundingClientRect();
			overlayImg.style.width = baseRect.width + 'px';
			overlayImg.style.height = baseRect.height + 'px';
			overlayImg.style.maxWidth = 'none';
			overlayImg.style.maxHeight = 'none';
			// Ensure overlay is centered (transform is already set in CSS)

			// Update slider height to match image height
			slider.style.height = baseRect.height + 'px';

			// Reset slider position to center based on image position
			const imageLeft = baseRect.left - containerRect.left;
			const sliderLeft = imageLeft + (baseRect.width * 50) / 100;
			slider.style.left = sliderLeft + 'px';
			slider.style.transform = 'translateX(-50%)';
		}
	}

	baseImg.onload = function () {
		// Small delay to ensure layout is complete
		setTimeout(updateOverlaySize, 10);
	};

	// Also handle overlay image load to ensure proper sizing
	overlayImg.onload = function () {
		updateOverlaySize();
	};

	// Update on window resize
	window.addEventListener('resize', updateOverlaySize);

	const slider = document.createElement('div');
	slider.className = 'comparison-slider';

	let isDragging = false;
	slider.addEventListener('mousedown', (e) => {
		isDragging = true;
		e.preventDefault();
	});

	document.addEventListener('mousemove', (e) => {
		if (!isDragging) return;
		// Use base image dimensions instead of container
		const baseRect = baseImg.getBoundingClientRect();
		const containerRect = overlayContainer.getBoundingClientRect();

		// Calculate mouse position relative to the image's left edge
		// Account for the image's position within the container
		const imageLeft = baseRect.left - containerRect.left;
		const x = e.clientX - containerRect.left - imageLeft;

		// Constrain slider to image width (0 to baseRect.width)
		const percentage = Math.max(
			0,
			Math.min(100, (x / baseRect.width) * 100)
		);

		// Calculate slider position relative to container
		const sliderLeft = imageLeft + (baseRect.width * percentage) / 100;
		slider.style.left = sliderLeft + 'px';
		overlayImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
	});

	document.addEventListener('mouseup', () => {
		isDragging = false;
	});

	overlayContainer.appendChild(baseImg);
	overlayContainer.appendChild(overlayImg);
	overlayContainer.appendChild(slider);
	overlaySection.appendChild(overlayTitle);
	overlaySection.appendChild(overlayContainer);
	container.appendChild(overlaySection);

	// Blink/Toggle mode
	const blinkSection = document.createElement('div');
	blinkSection.className = 'comparison-mode-section';
	const blinkTitle = document.createElement('div');
	blinkTitle.className = 'comparison-mode-title';
	blinkTitle.textContent = 'Blink Comparison (click to toggle)';
	const blinkContainer = document.createElement('div');
	blinkContainer.className = 'comparison-blink';

	const blinkBaseImg = document.createElement('img');
	// Append cache-busting parameter to prevent browser caching
	blinkBaseImg.src = addCacheBuster(lightboxState.editorImageSrc);
	blinkBaseImg.alt = 'Editor';

	const blinkOverlayImg = document.createElement('img');
	blinkOverlayImg.className = 'blink-image';
	blinkOverlayImg.src = addCacheBuster(lightboxState.frontendImageSrc);
	blinkOverlayImg.alt = 'Frontend';

	// Ensure both images have same dimensions
	blinkBaseImg.onload = function () {
		const rect = blinkBaseImg.getBoundingClientRect();
		blinkOverlayImg.style.width = rect.width + 'px';
		blinkOverlayImg.style.height = rect.height + 'px';
	};

	blinkOverlayImg.onload = function () {
		if (blinkBaseImg.complete && blinkBaseImg.offsetWidth > 0) {
			const rect = blinkBaseImg.getBoundingClientRect();
			blinkOverlayImg.style.width = rect.width + 'px';
			blinkOverlayImg.style.height = rect.height + 'px';
		}
	};

	let showingEditor = true;
	const blinkToggle = document.createElement('button');
	blinkToggle.className = 'comparison-blink-toggle';
	blinkToggle.textContent = 'Show Frontend';
	blinkToggle.addEventListener('click', function () {
		showingEditor = !showingEditor;
		if (showingEditor) {
			blinkBaseImg.style.opacity = '1';
			blinkOverlayImg.classList.remove('active');
			blinkToggle.textContent = 'Show Frontend';
		} else {
			blinkBaseImg.style.opacity = '0';
			blinkOverlayImg.classList.add('active');
			blinkToggle.textContent = 'Show Editor';
		}
	});

	blinkContainer.appendChild(blinkBaseImg);
	blinkContainer.appendChild(blinkOverlayImg);
	blinkSection.appendChild(blinkTitle);
	blinkSection.appendChild(blinkContainer);
	blinkSection.appendChild(blinkToggle);
	container.appendChild(blinkSection);
}

function closeLightbox() {
	const lightbox = document.getElementById('lightbox');
	lightbox.classList.remove('active');
	document.body.style.overflow = '';
	// Reset state
	lightboxState = {
		editorImageSrc: null,
		frontendImageSrc: null,
		diffImageSrc: null,
		caption: '',
		isComparison: false,
		currentMode: 'difference',
	};
}

// Close lightbox on background click or Escape key
document.addEventListener('click', function (e) {
	const lightbox = document.getElementById('lightbox');
	if (e.target === lightbox) {
		closeLightbox();
	}
});

document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape') {
		closeLightbox();
	}
});

// Function to re-evaluate all comparisons with new threshold
async function reevaluateComparisons() {
	const thresholdInput = document.getElementById('threshold-input');
	if (!thresholdInput) {
		console.error('Threshold input not found');
		return;
	}

	comparisonThreshold = parseFloat(thresholdInput.value) / 100;

	console.log(
		'Re-evaluating comparisons with threshold:',
		comparisonThreshold
	);

	// Reset counters
	passingTests = 0;
	failingTests = 0;
	missingTests = 0;
	failingTestIds.length = 0;

	console.log('Stored comparison results:', comparisonResults.size);

	// Re-evaluate all stored comparison results
	for (const [, data] of comparisonResults.entries()) {
		const {
			result,
			test,
			type,
			diffContainer,
			diffLabel,
			diffDimensionsSpan,
			row,
			editorType,
			frontendType,
		} = data;

		// Update diff label with difference percentage
		if (diffLabel && result.diffPercentage !== undefined) {
			const percentageText = result.identical
				? '0.0%'
				: (result.diffPercentage * 100).toFixed(2) + '%';
			diffLabel.innerHTML = `Difference (${percentageText})<span class="dimensions"></span>`;
			const updatedDimensionsSpan =
				diffLabel.querySelector('.dimensions');
			if (updatedDimensionsSpan && diffDimensionsSpan) {
				updatedDimensionsSpan.textContent =
					diffDimensionsSpan.textContent;
			}
		}

		// Check if images exist
		const editorExists = test.images[editorType]?.exists;
		const frontendExists = test.images[frontendType]?.exists;

		if (result.error) {
			diffContainer.innerHTML = `<div class="diff-error">Error: ${result.error}</div>`;
			diffContainer.dataset.failed = 'true';
			row.dataset.failed = 'true';
			// Update diff label classes
			if (diffLabel) {
				diffLabel.classList.remove('passing');
				diffLabel.classList.add('failing');
			}
		} else if (
			result.identical ||
			(result.diffPercentage !== undefined &&
				result.diffPercentage < comparisonThreshold)
		) {
			// Show diff image with 70% opacity and checkmark overlay for passing tests
			const diffImg = document.createElement('img');
			diffImg.src = result.diffImage;
			diffImg.className = 'diff-image diff-image-passing';
			diffImg.alt = 'Difference';
			diffImg.addEventListener('click', function () {
				const editorImg = document.querySelector(
					`#test-${test.id} .image-container[data-image-type="${editorType}"] img`
				);
				const frontendImg = document.querySelector(
					`#test-${test.id} .image-container[data-image-type="${frontendType}"] img`
				);
				const editorSrc = editorImg ? editorImg.src : null;
				const frontendSrc = frontendImg ? frontendImg.src : null;
				openLightbox(
					result.diffImage,
					`Difference - ${type} - ${test.id}`,
					editorSrc,
					frontendSrc
				);
			});
			const checkmarkOverlay = document.createElement('div');
			checkmarkOverlay.className = 'checkmark checkmark-overlay';
			checkmarkOverlay.textContent = '✓';
			diffContainer.innerHTML = '';
			diffContainer.appendChild(diffImg);
			diffContainer.appendChild(checkmarkOverlay);
			diffContainer.dataset.failed = 'false';
			// Update diff label classes
			if (diffLabel) {
				diffLabel.classList.remove('failing');
				diffLabel.classList.add('passing');
			}
		} else {
			const diffImg = document.createElement('img');
			diffImg.src = result.diffImage;
			diffImg.className = 'diff-image';
			diffImg.alt = 'Difference';
			diffImg.addEventListener('click', function () {
				const editorImg = document.querySelector(
					`#test-${test.id} .image-container[data-image-type="${editorType}"] img`
				);
				const frontendImg = document.querySelector(
					`#test-${test.id} .image-container[data-image-type="${frontendType}"] img`
				);
				const editorSrc = editorImg ? editorImg.src : null;
				const frontendSrc = frontendImg ? frontendImg.src : null;
				openLightbox(
					result.diffImage,
					`Difference - ${type} - ${test.id}`,
					editorSrc,
					frontendSrc
				);
			});
			diffContainer.innerHTML = '';
			diffContainer.appendChild(diffImg);
			diffContainer.dataset.failed = 'true';
			row.dataset.failed = 'true';
			// Update diff label classes
			if (diffLabel) {
				diffLabel.classList.remove('passing');
				diffLabel.classList.add('failing');
			}
		}

		// Count passing/failing tests (only if images exist - missing images are not counted)
		if (editorExists && frontendExists) {
			if (diffContainer.dataset.failed === 'false') {
				passingTests++;
			} else {
				// Only count as failure if images exist (not missing)
				failingTests++;
			}
		}

		// Track test cases with failures for navigation (only actual failures, not missing)
		if (
			diffContainer.dataset.failed === 'true' &&
			editorExists &&
			frontendExists
		) {
			if (!failingTestIds.includes(test.id)) {
				failingTestIds.push(test.id);
			}
		} else {
			// Remove from failing list if it's now passing or missing
			const index = failingTestIds.indexOf(test.id);
			if (index > -1) {
				failingTestIds.splice(index, 1);
			}
		}

		// Update test section status after re-evaluation
		const section = document.getElementById(`test-${test.id}`);
		if (section) {
			const desktopContainer = section.querySelector(
				'.desktop-row .diff-container'
			);
			const mobileContainer = section.querySelector(
				'.mobile-row .diff-container'
			);
			const desktopFailed = desktopContainer?.dataset.failed === 'true';
			const mobileFailed = mobileContainer?.dataset.failed === 'true';
			const editorDesktopExists = test.images['editor-desktop']?.exists;
			const frontendDesktopExists =
				test.images['frontend-desktop']?.exists;
			const editorMobileExists = test.images['editor-mobile']?.exists;
			const frontendMobileExists = test.images['frontend-mobile']?.exists;
			updateTestSectionStatus(
				test.id,
				desktopFailed,
				mobileFailed,
				editorDesktopExists,
				frontendDesktopExists,
				editorMobileExists,
				frontendMobileExists
			);
		}
	}

	// Count missing tests (check all tests, not just stored comparisons)
	for (let testIndex = 0; testIndex < tests.length; testIndex++) {
		const test = tests[testIndex];
		const editorDesktopExists = test.images['editor-desktop']?.exists;
		const frontendDesktopExists = test.images['frontend-desktop']?.exists;
		const editorMobileExists = test.images['editor-mobile']?.exists;
		const frontendMobileExists = test.images['frontend-mobile']?.exists;

		// Count missing tests (when images don't exist)
		if (!editorDesktopExists || !frontendDesktopExists) {
			missingTests++; // 1 test is missing
		}
		if (!editorMobileExists || !frontendMobileExists) {
			missingTests++; // 1 test is missing
		}
	}

	// Update statistics
	document.getElementById('stat-passing').textContent = passingTests;
	document.getElementById('stat-failing').textContent = failingTests;
	document.getElementById('stat-missing').textContent = missingTests;
	updateNavigationButtons();

	// Apply current filter after re-evaluation
	applyFilter();
}

// Threshold input change handler
// Use a flag to prevent duplicate listeners
let thresholdHandlerAttached = false;

function attachThresholdHandler() {
	if (thresholdHandlerAttached) {
		return true;
	}

	const thresholdInput = document.getElementById('threshold-input');
	if (thresholdInput) {
		let thresholdTimeout;
		thresholdInput.addEventListener('input', function () {
			// Debounce the re-evaluation
			clearTimeout(thresholdTimeout);
			thresholdTimeout = setTimeout(() => {
				reevaluateComparisons();
			}, 500);
		});
		thresholdHandlerAttached = true;
		return true;
	}
	return false;
}

// Try to attach immediately
if (!attachThresholdHandler()) {
	// If element doesn't exist yet, wait for DOMContentLoaded
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', attachThresholdHandler);
	} else {
		// DOM already loaded, try again after a short delay
		setTimeout(() => {
			attachThresholdHandler();
		}, 100);
	}
}

// Attach filter handlers
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', attachFilterHandlers);
} else {
	attachFilterHandlers();
}

// Start processing when page loads
window.addEventListener('load', async () => {
	// Load Resemble.js first
	try {
		await loadResemble();
	} catch (error) {
		console.error('Failed to load Resemble.js:', error);
	}

	setTimeout(() => {
		processComparisons();
	}, 500); // Small delay to ensure images start loading
});
