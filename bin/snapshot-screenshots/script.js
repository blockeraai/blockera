// Fallback pixel comparison function (used if pixelmatch fails to load)
function fallbackPixelmatch(
	imgData1,
	imgData2,
	output,
	width,
	height,
	options = {}
) {
	const threshold = options.threshold || 0.1;
	let diffCount = 0;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const pos = (y * width + x) * 4;
			const r1 = imgData1[pos];
			const g1 = imgData1[pos + 1];
			const b1 = imgData1[pos + 2];
			const a1 = imgData1[pos + 3];
			const r2 = imgData2[pos];
			const g2 = imgData2[pos + 1];
			const b2 = imgData2[pos + 2];
			const a2 = imgData2[pos + 3];

			// Use Euclidean distance in RGB space for better color difference detection
			// This is more sensitive to color differences than sum of absolute differences
			const dr = r1 - r2;
			const dg = g1 - g2;
			const db = b1 - b2;
			const da = a1 - a2;

			// Calculate Euclidean distance
			const colorDistance = Math.sqrt(dr * dr + dg * dg + db * db);
			// Normalize to 0-1 range (max distance is sqrt(255^2 * 3) ≈ 441.67)
			const normalizedDiff = colorDistance / 441.67;

			// Also check alpha channel difference
			const alphaDiff = Math.abs(da) / 255;

			// Consider pixel different if color or alpha difference exceeds threshold
			if (normalizedDiff > threshold || alphaDiff > threshold) {
				diffCount++;
				const diffColor = options.diffColor || [255, 0, 0];
				const diffColorAlt = options.diffColorAlt || [0, 0, 255];
				// Alternate between diffColor and diffColorAlt for visual variety
				const useAlt = (x + y) % 2 === 0;
				output[pos] = useAlt ? diffColorAlt[0] : diffColor[0]; // R
				output[pos + 1] = useAlt ? diffColorAlt[1] : diffColor[1]; // G
				output[pos + 2] = useAlt ? diffColorAlt[2] : diffColor[2]; // B
				output[pos + 3] = 255; // A
			} else {
				output[pos] = imgData1[pos];
				output[pos + 1] = imgData1[pos + 1];
				output[pos + 2] = imgData1[pos + 2];
				output[pos + 3] = Math.floor(
					imgData1[pos + 3] * (options.alpha || 0.3)
				);
			}
		}
	}

	return diffCount;
}

// Use our fallback implementation (reliable and no external dependencies)
let pixelmatchLoaded = true;
let pixelmatchFn = fallbackPixelmatch;

const loadPixelmatch = () => {
	return Promise.resolve(); // Already loaded
};

// State
let currentFailingIndex = -1;
const failingTestIds = [];
// Each test case has 2 comparisons: desktop and mobile
// Each comparison involves both editor and frontend files
const totalTests = tests.length * 2;
let passingTests = 0;
let failingTests = 0;
// Threshold for comparison (default 3% = 0.03)
let comparisonThreshold = 0.03;
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
        <div class="test-header">${test.id}</div>
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
			img.src = imageData.url;
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

// Comparison function using pixelmatch
async function compareImages(img1, img2, width, height, options = {}) {
	return new Promise((resolve) => {
		try {
			// Use the loaded pixelmatch function (or fallback)
			if (!pixelmatchLoaded) {
				// Wait a bit for it to load
				setTimeout(() => {
					if (!pixelmatchLoaded) {
						pixelmatchFn = fallbackPixelmatch;
						pixelmatchLoaded = true;
					}
				}, 100);
			}

			const canvas1 = document.createElement('canvas');
			const canvas2 = document.createElement('canvas');
			const canvasDiff = document.createElement('canvas');

			canvas1.width = width;
			canvas1.height = height;
			canvas2.width = width;
			canvas2.height = height;
			canvasDiff.width = width;
			canvasDiff.height = height;

			const ctx1 = canvas1.getContext('2d');
			const ctx2 = canvas2.getContext('2d');
			const ctxDiff = canvasDiff.getContext('2d');

			// Clear canvas and ensure images are positioned at top-left (0,0)
			ctx1.clearRect(0, 0, width, height);
			ctx2.clearRect(0, 0, width, height);

			// Draw images at top-left corner (0,0) - no centering
			ctx1.drawImage(img1, 0, 0, img1.naturalWidth, img1.naturalHeight);
			ctx2.drawImage(img2, 0, 0, img2.naturalWidth, img2.naturalHeight);

			const imgData1 = ctx1.getImageData(0, 0, width, height);
			const imgData2 = ctx2.getImageData(0, 0, width, height);
			const diffData = ctxDiff.createImageData(width, height);

			const defaultOptions = {
				threshold: 0.01, // Lower threshold for more sensitive color detection (1% instead of 10%)
				alpha: 0.3,
				diffColor: [255, 0, 0],
				diffColorAlt: [0, 0, 255],
			};

			const mergedOptions = { ...defaultOptions, ...options };

			const diff = pixelmatchFn(
				imgData1.data,
				imgData2.data,
				diffData.data,
				width,
				height,
				mergedOptions
			);

			ctxDiff.putImageData(diffData, 0, 0);

			// Calculate difference percentage
			const totalPixels = width * height;
			const diffPercentage = totalPixels > 0 ? diff / totalPixels : 0;

			resolve({
				identical: diff === 0,
				diffCount: diff,
				diffPercentage,
				diffImage: canvasDiff.toDataURL(),
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

		// Count failing tests
		// Each failed comparison is 1 failing test
		if (desktopFailed) {
			failingTests++; // 1 test fails
		}
		if (mobileFailed) {
			failingTests++; // 1 test fails
		}

		// Track test cases with failures for navigation
		if (desktopFailed || mobileFailed) {
			failingTestIds.push(test.id);
		}

		// Update statistics
		document.getElementById('stat-passing').textContent = passingTests;
		document.getElementById('stat-failing').textContent = failingTests;

		// Yield to browser
		await new Promise((resolve) => setTimeout(resolve, 0));
	}

	progressIndicator.classList.remove('active');
	updateNavigationButtons();
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

	// Load images
	const editorImg = new Image();
	const frontendImg = new Image();

	const imagesLoaded = Promise.all([
		new Promise((resolve, reject) => {
			editorImg.onload = resolve;
			editorImg.onerror = () =>
				reject(new Error('Editor image failed to load'));
			editorImg.src = editorData.url;
		}),
		new Promise((resolve, reject) => {
			frontendImg.onload = resolve;
			frontendImg.onerror = () =>
				reject(new Error('Frontend image failed to load'));
			frontendImg.src = frontendData.url;
		}),
	]);

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
		img.src = imageSrc;
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
	editorImg.src = lightboxState.editorImageSrc;
	editorImg.alt = 'Editor';
	const frontendImg = document.createElement('img');
	frontendImg.src = lightboxState.frontendImageSrc;
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
	baseImg.src = lightboxState.editorImageSrc;
	baseImg.alt = 'Editor';

	const overlayImg = document.createElement('img');
	overlayImg.className = 'overlay-image';
	overlayImg.src = lightboxState.frontendImageSrc;
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

	// Generate additional difference images with different configurations
	const diffEditorImg = new Image();
	const diffFrontendImg = new Image();

	// Store reference to first difference section for insertion
	const firstDiffSection = differenceSection;

	// Track if we've already generated the additional differences
	let differencesGenerated = false;

	const generateAdditionalDifferences = async function () {
		if (differencesGenerated) return;
		if (!diffEditorImg.complete || !diffFrontendImg.complete) return;

		differencesGenerated = true;

		const width = Math.max(
			diffEditorImg.naturalWidth,
			diffFrontendImg.naturalWidth
		);
		const height = Math.max(
			diffEditorImg.naturalHeight,
			diffFrontendImg.naturalHeight
		);

		// Difference mode 2: More sensitive (lower threshold, higher alpha)
		const diffResult2 = await compareImages(
			diffEditorImg,
			diffFrontendImg,
			width,
			height,
			{
				threshold: 0.05,
				alpha: 0.5,
				diffColor: [255, 255, 0],
				diffColorAlt: [255, 0, 255],
			}
		);

		if (diffResult2.diffImage) {
			const differenceSection2 = document.createElement('div');
			differenceSection2.className = 'comparison-mode-section';
			const differenceTitle2 = document.createElement('div');
			differenceTitle2.className = 'comparison-mode-title';
			differenceTitle2.textContent =
				'Difference (Sensitive - Threshold: 0.05, Alpha: 0.5)';
			const differenceContainer2 = document.createElement('div');
			differenceContainer2.className = 'comparison-difference';
			const diffImg2 = document.createElement('img');
			diffImg2.className = 'lightbox-image';
			diffImg2.src = diffResult2.diffImage;
			diffImg2.alt = 'Difference (Sensitive)';
			differenceContainer2.appendChild(diffImg2);
			differenceSection2.appendChild(differenceTitle2);
			differenceSection2.appendChild(differenceContainer2);
			// Insert after first difference section
			firstDiffSection.insertAdjacentElement(
				'afterend',
				differenceSection2
			);
		}

		// Difference mode 3: Less sensitive (higher threshold, lower alpha)
		const diffResult3 = await compareImages(
			diffEditorImg,
			diffFrontendImg,
			width,
			height,
			{
				threshold: 0.2,
				alpha: 0.2,
				diffColor: [0, 255, 0],
				diffColorAlt: [0, 255, 255],
			}
		);

		if (diffResult3.diffImage) {
			const differenceSection3 = document.createElement('div');
			differenceSection3.className = 'comparison-mode-section';
			const differenceTitle3 = document.createElement('div');
			differenceTitle3.className = 'comparison-mode-title';
			differenceTitle3.textContent =
				'Difference (Strict - Threshold: 0.2, Alpha: 0.2)';
			const differenceContainer3 = document.createElement('div');
			differenceContainer3.className = 'comparison-difference';
			const diffImg3 = document.createElement('img');
			diffImg3.className = 'lightbox-image';
			diffImg3.src = diffResult3.diffImage;
			diffImg3.alt = 'Difference (Strict)';
			differenceContainer3.appendChild(diffImg3);
			differenceSection3.appendChild(differenceTitle3);
			differenceSection3.appendChild(differenceContainer3);
			// Insert after second difference section (or first if second doesn't exist)
			const secondDiffSection = firstDiffSection.nextElementSibling;
			if (secondDiffSection) {
				secondDiffSection.insertAdjacentElement(
					'afterend',
					differenceSection3
				);
			} else {
				firstDiffSection.insertAdjacentElement(
					'afterend',
					differenceSection3
				);
			}
		}
	};

	diffEditorImg.onload = generateAdditionalDifferences;
	diffFrontendImg.onload = generateAdditionalDifferences;

	diffEditorImg.src = lightboxState.editorImageSrc;
	diffFrontendImg.src = lightboxState.frontendImageSrc;

	// Blink/Toggle mode
	const blinkSection = document.createElement('div');
	blinkSection.className = 'comparison-mode-section';
	const blinkTitle = document.createElement('div');
	blinkTitle.className = 'comparison-mode-title';
	blinkTitle.textContent = 'Blink Comparison (click to toggle)';
	const blinkContainer = document.createElement('div');
	blinkContainer.className = 'comparison-blink';

	const blinkBaseImg = document.createElement('img');
	blinkBaseImg.src = lightboxState.editorImageSrc;
	blinkBaseImg.alt = 'Editor';

	const blinkOverlayImg = document.createElement('img');
	blinkOverlayImg.className = 'blink-image';
	blinkOverlayImg.src = lightboxState.frontendImageSrc;
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
	comparisonThreshold =
		parseFloat(document.getElementById('threshold-input').value) / 100;

	// Reset counters
	passingTests = 0;
	failingTests = 0;
	failingTestIds.length = 0;

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

		if (result.error) {
			diffContainer.innerHTML = `<div class="diff-error">Error: ${result.error}</div>`;
			diffContainer.dataset.failed = 'true';
			row.dataset.failed = 'true';
			failingTests++;
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
	}

	// Recalculate statistics
	for (let testIndex = 0; testIndex < tests.length; testIndex++) {
		const test = tests[testIndex];
		const section = document.getElementById(`test-${test.id}`);
		const desktopFailed =
			section.querySelector('.desktop-row .diff-container').dataset
				.failed === 'true';
		const mobileFailed =
			section.querySelector('.mobile-row .diff-container').dataset
				.failed === 'true';

		const editorDesktopExists = test.images['editor-desktop']?.exists;
		const editorMobileExists = test.images['editor-mobile']?.exists;
		const frontendDesktopExists = test.images['frontend-desktop']?.exists;
		const frontendMobileExists = test.images['frontend-mobile']?.exists;

		// Count passing tests
		if (!desktopFailed && editorDesktopExists && frontendDesktopExists) {
			passingTests++;
		}
		if (!mobileFailed && editorMobileExists && frontendMobileExists) {
			passingTests++;
		}

		// Count failing tests
		if (desktopFailed) {
			failingTests++;
		}
		if (mobileFailed) {
			failingTests++;
		}

		// Track test cases with failures for navigation
		if (desktopFailed || mobileFailed) {
			if (!failingTestIds.includes(test.id)) {
				failingTestIds.push(test.id);
			}
		}
	}

	// Update statistics
	document.getElementById('stat-passing').textContent = passingTests;
	document.getElementById('stat-failing').textContent = failingTests;
	updateNavigationButtons();
}

// Threshold input change handler
document.addEventListener('DOMContentLoaded', function () {
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
	}
});

// Start processing when page loads
window.addEventListener('load', async () => {
	// Load pixelmatch first
	try {
		await loadPixelmatch();
	} catch (error) {
		console.error('Failed to load pixelmatch:', error);
	}

	setTimeout(() => {
		processComparisons();
	}, 500); // Small delay to ensure images start loading
});
