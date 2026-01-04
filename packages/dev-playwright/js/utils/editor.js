/**
 * Editor helper utilities for Playwright e2e tests.
 */

const { expect } = require('@playwright/test');

/**
 * Get iframe body element from editor canvas.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} containerClass - Container class selector.
 * @return {import('@playwright/test').FrameLocator} The iframe body locator.
 */
function getIframeBody(page, containerClass = '') {
	if (!page) {
		throw new Error('getIframeBody: page parameter is required');
	}

	if (containerClass) {
		// Use frameLocator directly on page with the full selector
		const iframe = page.frameLocator(`${containerClass} iframe`);
		return iframe.locator('body');
	}
	const iframe = page.frameLocator('iframe[name="editor-canvas"]');
	return iframe.locator('body');
}

/**
 * Safely obtain the window object property.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} path - Property path (e.g., 'wp.data').
 * @return {Promise<any>} The property value.
 */
async function getWindowProperty(page, path) {
	return await page.evaluate((propPath) => {
		const parts = propPath.split('.');
		let value = window;
		for (const part of parts) {
			value = value?.[part];
		}
		return value;
	}, path);
}

/**
 * Safely obtain the WordPress data object.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<any>} The WordPress data object.
 */
async function getWPDataObject(page) {
	await page.waitForTimeout(300);
	return await getWindowProperty(page, 'wp.data');
}

/**
 * Get block type registered object.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} blockType - Block type name.
 * @return {Promise<any>} The block type object.
 */
async function getBlockType(page, blockType) {
	const data = await getWPDataObject(page);
	return await page.evaluate(
		({ dataObj, blockTypeName }) => {
			return dataObj.select('core/blocks').getBlockType(blockTypeName);
		},
		{ dataObj: data, blockTypeName: blockType }
	);
}

/**
 * Get selected block data.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} field - Optional field name to get from block attributes.
 * @return {Promise<any>} The selected block or field value.
 */
async function getSelectedBlock(page, field = '') {
	const data = await getWPDataObject(page);
	return await page.evaluate(
		({ dataObj, fieldName }) => {
			const selectedBlock = dataObj
				.select('core/block-editor')
				.getSelectedBlock();
			if (!fieldName) {
				return selectedBlock;
			}
			if (selectedBlock?.attributes?.[fieldName]?.value !== undefined) {
				return selectedBlock.attributes[fieldName].value;
			}
			return selectedBlock.attributes[fieldName];
		},
		{ dataObj: data, fieldName: field }
	);
}

/**
 * Get the style of the selected block.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} name - Block name.
 * @param {string} variation - Block variation (default: 'default').
 * @return {Promise<any>} The block styles.
 */
async function getSelectedBlockStyle(page, name, variation = 'default') {
	const data = await getWPDataObject(page);
	return await page.evaluate(
		({ dataObj, blockName, blockVariation }) => {
			const { getBlockStyles } = dataObj.select('blockera/editor');
			return getBlockStyles(blockName, blockVariation);
		},
		{ dataObj: data, blockName: name, blockVariation: variation }
	);
}

/**
 * Get the WordPress globalStyles entity record.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} prop - Property name (e.g., 'style', 'settings').
 * @param {string} innerField - Inner property name.
 * @return {Promise<any>} The global styles record or property.
 */
async function getEditedGlobalStylesRecord(page, prop, innerField) {
	const data = await getWPDataObject(page);
	return await page.evaluate(
		({ dataObj, propName, innerFieldName }) => {
			const { __experimentalGetCurrentGlobalStylesId } =
				dataObj.select('core');
			const { getEditedEntityRecord } = dataObj.select('core');

			const record = getEditedEntityRecord(
				'root',
				'globalStyles',
				__experimentalGetCurrentGlobalStylesId()
			);

			if (propName) {
				if (innerFieldName) {
					return record?.[propName]?.[innerFieldName];
				}
				return record?.[propName];
			}

			return record;
		},
		{ dataObj: data, propName: prop, innerFieldName: innerField }
	);
}

/**
 * Get editor content.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<string>} The editor content.
 */
async function getEditorContent(page) {
	const data = await getWPDataObject(page);
	return await page.evaluate((dataObj) => {
		const { getEditedEntityRecord } = dataObj.select('core');
		const { getCurrentPostType, getCurrentPostId } =
			dataObj.select('core/editor');
		const _type = getCurrentPostType();
		const _id = getCurrentPostId();
		const editedRecord = getEditedEntityRecord('postType', _type, _id);

		if (typeof editedRecord?.content === 'function') {
			return editedRecord.content({ blocks: editedRecord?.blocks });
		}

		return editedRecord?.content;
	}, data);
}

/**
 * Get Blockera entity data.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} field - Field name.
 * @return {Promise<any>} The entity field value.
 */
async function getBlockeraEntity(page, field) {
	const data = await getWPDataObject(page);
	return await page.evaluate(
		({ dataObj, fieldName }) => {
			return dataObj.select('blockera/data').getEntity('blockera')[
				fieldName
			];
		},
		{ dataObj: data, fieldName: field }
	);
}

/**
 * Get block client ID.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<string>} The block client ID.
 */
async function getBlockClientId(page) {
	const data = await getWPDataObject(page);
	return await page.evaluate((dataObj) => {
		return dataObj.select('core/block-editor').getSelectedBlock().clientId;
	}, data);
}

/**
 * Disable Gutenberg features.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function disableGutenbergFeatures(page) {
	// Access wp.data directly inside evaluate to avoid serialization issues
	await page.evaluate(() => {
		if (window.wp && window.wp.data) {
			window.wp.data.dispatch('core/editor').disablePublishSidebar();
		}
	});
}

/**
 * Open block inserter button.
 * If a custom selector is provided, clicks on that selector in the iframe.
 * Otherwise, checks if the secondary sidebar toggle exists and clicks it if present.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string|boolean} selector - Optional selector for inserter in iframe.
 * @return {Promise<void>}
 */
async function openBlockInserter(page, selector = false) {
	if (selector) {
		const iframeBody = getIframeBody(page);
		const inserter = iframeBody.locator(selector);
		const count = await inserter.count();
		if (count > 0) {
			await inserter.click();
		}
		return;
	}

	// Check if secondary sidebar toggle exists and click it if present
	const sidebarToggle = page.locator(
		'.edit-post-header [aria-label="Show secondary sidebar"]'
	);
	const count = await sidebarToggle.count();
	if (count > 0) {
		await sidebarToggle.click();
	}
}

/**
 * Add a block to the post editor.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} blockName - Block name (e.g., 'core/image', 'core/group/group').
 * @param {Object} options - Options.
 * @param {boolean} options.clearEditor - Clear editor first.
 * @param {string} options.className - CSS class name to add.
 * @param {string|boolean} options.blockInserterSelector - Custom inserter selector.
 * @return {Promise<void>}
 */
async function addBlockToPost(page, blockName, options = {}) {
	const {
		clearEditor = false,
		className = '',
		blockInserterSelector = false,
	} = options;

	const blockNameArray = blockName.split('/');

	let blockCategory = false;
	let blockType = false;
	let blockID = false;
	let blockSearchName = false;

	if (blockNameArray.length === 4) {
		blockCategory = blockNameArray[0];
		blockType = blockNameArray[1];
		blockID = blockNameArray[2] + '/' + blockNameArray[3];
		blockSearchName = blockNameArray[3];
	} else if (blockNameArray.length === 3) {
		blockCategory = blockNameArray[0];
		blockType = blockNameArray[1];
		blockID = blockNameArray[2];
		blockSearchName = blockNameArray[2];
	} else {
		blockCategory = blockNameArray[0];
		blockID = blockNameArray[1];
		blockSearchName = blockNameArray[1];
	}

	if (!blockCategory || !blockID) {
		return;
	}

	if (clearEditor) {
		await clearBlocks(page);
	}

	await openBlockInserter(page, blockInserterSelector);

	const searchInput = page.locator(
		'.block-editor-inserter__search-input, input.block-editor-inserter__search, .components-search-control__input, input[placeholder="Search"]'
	);
	await searchInput.fill(blockSearchName);

	if (!blockInserterSelector) {
		await page.waitForSelector(
			'div.block-editor-inserter__main-area:not(.show-as-tabs)'
		);
	}

	let targetClassName = '';
	if (blockType) {
		targetClassName = `.editor-block-list-item-${CSS.escape(
			`${blockType}/${blockID}`
		)}`;
	} else {
		targetClassName = `.editor-block-list-item-${CSS.escape(blockID)}`;
	}

	await page.locator(targetClassName).first().click({ force: true });

	await page.waitForSelector('[class*="-visual-editor"]', {
		timeout: 5000,
	});

	const isInserterOpen = await page
		.locator('button[class*="__inserter-toggle"].is-pressed')
		.count();
	if (isInserterOpen > 0) {
		await page
			.locator('button[class*="__inserter-toggle"].is-pressed')
			.click();
	}

	await openDocumentSettingsSidebar(page, 'Block');

	if (blockType) {
		await page
			.locator(`[data-type="${blockCategory}/${blockType}"]`)
			.last()
			.click();
	} else {
		await page
			.locator(`[data-type="${blockCategory}/${blockID}"]`)
			.last()
			.click();
	}

	if (className) {
		await page.evaluate(
			({ blockNameValue, classNameValue }) => {
				if (window.wp?.hooks) {
					window.wp.hooks.addFilter(
						'blocks.getSaveContent.extraProps',
						blockNameValue,
						(extraProps) => {
							return { ...extraProps, class: classNameValue };
						}
					);
				}
			},
			{ blockNameValue: blockName, classNameValue: className }
		);
	}
}

/**
 * Add a new group block to the post.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function addNewGroupToPost(page) {
	await clearBlocks(page);

	const inserterButton = page.locator(
		'.edit-post-header [aria-label="Add block"], .edit-site-header [aria-label="Add block"], .edit-post-header-toolbar__inserter-toggle'
	);
	await inserterButton.click();

	const searchInput = page.locator(
		'.block-editor-inserter__search-input, input.block-editor-inserter__search, .components-search-control__input'
	);
	await searchInput.fill('group');

	const isWP62AtLeast = await page
		.locator("[class*='branch-6-2'], [class*='branch-6-3']")
		.count()
		.then((count) => count > 0);

	if (isWP62AtLeast) {
		await page.waitForTimeout(1000);
		await page
			.locator('.block-editor-block-types-list__list-item')
			.filter({ hasText: 'Group' })
			.click();
	} else {
		await page
			.locator('.block-editor-block-types-list__item')
			.first()
			.click();
	}

	await page.waitForSelector(
		'[class*="-visual-editor"] [data-type="core/group"]',
		{ timeout: 5000 }
	);

	const isInserterOpen = await page
		.locator('button[class*="__inserter-toggle"].is-pressed')
		.count();
	if (isInserterOpen > 0) {
		await page
			.locator('button[class*="__inserter-toggle"].is-pressed')
			.click();
	}
}

/**
 * Save the post/page.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function savePage(page) {
	const publishButton = page.locator(
		'.editor-header__settings .editor-post-publish-button'
	);
	const isDisabled = await publishButton.isDisabled();
	if (isDisabled) {
		// Post is already saved, no need to do anything
		return;
	}

	await publishButton.click();

	const snackbarSaveButton = page.locator(
		'.entities-saved-states__panel .editor-entities-saved-states__save-button'
	);
	if ((await snackbarSaveButton.count()) > 0) {
		await snackbarSaveButton.click();
	}

	await page.waitForSelector(
		'.components-snackbar, .components-notice.is-success',
		{ timeout: 10000 }
	);
}

/**
 * Append blocks using code editor.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} blocksCode - Block code to append.
 * @return {Promise<void>}
 */
async function appendBlocks(page, blocksCode) {
	await page.locator('[aria-label="Options"]').first().click();
	await page.locator('span:has-text("Code editor")').click();

	const textEditor = page.locator('.editor-post-text-editor');
	await textEditor.fill(blocksCode);
	await textEditor.press('Space');

	await page.locator('button:has-text("Exit code editor")').click();

	await openDocumentSettingsSidebar(page, 'Block');
}

/**
 * Redirect to front end page from current published post.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function redirectToFrontPage(page) {
	const previewLink = page.locator('.blockera-preview-button-wrapper a');
	const href = await previewLink.getAttribute('href');
	if (href) {
		await page.goto(href);
	}
}

/**
 * Check the page for block errors.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} blockName - Block name to check.
 * @return {Promise<void>}
 */
async function checkForBlockErrors(page, blockName) {
	await disableGutenbergFeatures(page);

	await expect(page.locator('.block-editor-warning')).not.toBeVisible();
	await expect(page.locator('body.php-error')).not.toBeVisible();
	await expect(page.locator(`[data-type="${blockName}"]`)).toBeVisible();
}

/**
 * View the currently edited page on the front of site.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function viewPage(page) {
	const settingsButton = page.locator('button[aria-label="Settings"]');
	const isPressed = await settingsButton.getAttribute('aria-pressed');
	if (isPressed !== 'true') {
		await settingsButton.click();
	}

	await page.locator('button[data-label="Post"]').waitFor();

	await page.locator('.edit-post-post-url__dropdown button').click();

	const pageLink = page.locator('.editor-post-url__link');
	const linkAddress = await pageLink.getAttribute('href');
	if (linkAddress) {
		await page.goto(linkAddress);
	}
}

/**
 * Edit the currently viewed page.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function editPage(page) {
	await page.locator('#wp-admin-bar-edit').click();
}

/**
 * Clear all blocks from the editor.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function clearBlocks(page) {
	// Access wp.data directly inside evaluate to avoid serialization issues
	await page.evaluate(() => {
		if (window.wp && window.wp.data) {
			const dataObj = window.wp.data;
			const blocks = dataObj.select('core/block-editor').getBlocks();
			const clientIds = blocks.map((block) => block.clientId);
			dataObj.dispatch('core/block-editor').removeBlocks(clientIds);
		}
	});
}

/**
 * Get block slug from current test file.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<string>} The block slug.
 */
async function getBlockSlug(page) {
	// In Playwright, we can't directly access the test file name like Cypress
	// This would need to be passed as a parameter or determined another way
	return 'unknown';
}

/**
 * Open the block navigator.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function openBlockNavigator(page) {
	const navigator = page.locator(
		'.block-editor-block-navigation, .edit-post-header-toolbar__list-view-toggle, .edit-post-header-toolbar__document-overview-toggle, [aria-label="Document Overview"]'
	);
	const isPressed = await navigator.getAttribute('aria-pressed');
	if (isPressed !== 'true') {
		await navigator.click();
	}
}

/**
 * Close the block navigator.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function closeBlockNavigator(page) {
	const inserterButton = page.locator(
		'.edit-post-header__toolbar button.edit-post-header-toolbar__list-view-toggle.is-pressed'
	);
	if ((await inserterButton.count()) > 0) {
		await inserterButton.click();
	}
}

/**
 * Set block style.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} style - Style name to apply.
 * @return {Promise<void>}
 */
async function setBlockStyle(page, style) {
	await openSettingsPanel(page, /styles/i);

	await page
		.locator('.edit-post-sidebar [class*="editor-block-styles"]')
		.filter({ hasText: new RegExp(style, 'i') })
		.click();
}

/**
 * Select block using block navigator.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} name - Block name to select.
 * @param {boolean} isChildBlock - Whether it's a child block.
 * @return {Promise<void>}
 */
async function selectBlock(page, name, isChildBlock = false) {
	await openBlockNavigator(page);

	if (isChildBlock) {
		await page
			.locator('.block-editor-list-view__expander svg')
			.first()
			.click();
	}

	await page.waitForTimeout(250);

	const blockSelector = isChildBlock
		? new RegExp(`${name}$`, 'i')
		: new RegExp(name, 'i');

	await page
		.locator(
			'.block-editor-block-navigation-leaf, .block-editor-list-view-leaf'
		)
		.filter({ hasText: blockSelector })
		.click();

	await closeBlockNavigator(page);
}

/**
 * Open settings panel in sidebar.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string|RegExp} panelText - Panel label text.
 * @return {Promise<void>}
 */
async function openSettingsPanel(page, panelText) {
	const panel = page.locator('.components-panel__body').filter({
		hasText: panelText,
	});

	const isOpened = await panel.getAttribute('class');
	if (!isOpened?.includes('is-opened')) {
		await panel.locator('button').first().click();
	}
}

/**
 * Open heading toolbar and select heading level.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {number} headingLevel - Heading level to select.
 * @return {Promise<void>}
 */
async function openHeadingToolbarAndSelect(page, headingLevel) {
	const toolbarButtons = page.locator(
		'.block-editor-block-toolbar .block-editor-block-toolbar__slot button'
	);
	const buttonCount = await toolbarButtons.count();
	if (buttonCount > 1) {
		await toolbarButtons.nth(1).click({ force: true });
	}

	await page
		.locator('.components-popover__content div[role="menu"] button')
		.filter({ hasText: headingLevel.toString() })
		.click();
}

/**
 * Open more features control.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} label - Control label.
 * @return {Promise<void>}
 */
async function openMoreFeaturesControl(page, label) {
	const control = page.locator(
		`.blockera-component-more-features > button[aria-label="${label}"]`
	);
	const parent = control.locator('..');
	const isOpen = await parent.getAttribute('class');
	if (!isOpen?.includes('is-open')) {
		await control.click();
	}
}

/**
 * Deselect block.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function deSelectBlock(page) {
	const iframeBody = getIframeBody(page);
	await iframeBody.locator('h1').click();
}

/**
 * Reselect block.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} blockType - Block type to select.
 * @return {Promise<void>}
 */
async function reSelectBlock(page, blockType = 'core/paragraph') {
	await deSelectBlock(page);

	const iframeBody = getIframeBody(page);
	await iframeBody
		.locator(`[data-type="${blockType}"]`)
		.first()
		.click({ force: true });
}

/**
 * Close welcome guide if it exists.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function closeWelcomeGuide(page) {
	const closeButton = page.locator(
		'.components-modal__screen-overlay button[aria-label="Close"]'
	);
	if ((await closeButton.count()) > 0) {
		await closeButton.last().click();
	}

	const finishButton = page.locator(
		'.components-modal__screen-overlay button.components-guide__finish-button'
	);
	if ((await finishButton.count()) > 0) {
		await finishButton.click();
	}

	await page.waitForTimeout(10);

	const overlay = page.locator('.components-modal__screen-overlay');
	if ((await overlay.count()) > 0) {
		await overlay.evaluate((el) => el.remove());
	}
}

/**
 * Open document settings sidebar.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} tab - Tab name ('Block' or 'Post').
 * @return {Promise<void>}
 */
async function openDocumentSettingsSidebar(page, tab = 'Block') {
	const settingsButton = page.locator(
		'.editor-header__settings button[aria-label="Settings"]'
	);

	// Use getByRole for more specific tab selection
	const tabButton = page.getByRole('tab', { name: tab, exact: true });

	const isPressed = await settingsButton.getAttribute('aria-pressed');
	if (isPressed === 'true') {
		// Check if the current tab element exists before trying to read it
		const currentTab = page.locator(
			`.editor-header__settings [role="tab"][aria-selected="true"]`
		);
		const tabCount = await currentTab.count();

		if (tabCount > 0) {
			const currentTabText = await currentTab.textContent();
			if (currentTabText?.trim() !== tab) {
				await tabButton.click();
			}
			// If no tab is selected, just click the desired tab
			await tabButton.click();
			return;
		}
		return;
	}

	await settingsButton.click();
	await tabButton.click();
}

/**
 * Get Blockera styles wrapper element.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<import('@playwright/test').Locator>} The styles wrapper locator.
 */
async function getBlockeraStylesWrapper(page) {
	const hasIframe =
		(await page.locator('iframe[name="editor-canvas"]').count()) > 0;

	if (hasIframe) {
		const iframe = page.frameLocator('iframe[name="editor-canvas"]');
		return iframe.locator('#blockera-styles-wrapper');
	}

	return page.locator('#blockera-styles-wrapper');
}

/**
 * Wait for assertion value.
 *
 * @param {number} time - Time to wait in milliseconds.
 * @return {Promise<void>}
 */
async function waitForAssertValue(time = 300) {
	return new Promise((resolve) => setTimeout(resolve, time));
}
/**
 * Activate mu-plugin by copying it to wp-content/mu-plugins/ directory.
 * This function accepts a full path to the mu-plugin.php file and copies it to the mu-plugins directory.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} muPluginPath - Full path to the mu-plugin.php file (relative to plugin root).
 * @param {string} [targetName] - Optional target filename. If not provided, generates from path.
 * @param {string} [pluginName='blockera'] - Plugin name to use in paths. Defaults to 'blockera'.
 * @return {Promise<void>}
 */
async function activateMuPlugin(
	page,
	muPluginPath,
	targetName = null,
	pluginName = 'blockera'
) {
	// Import wpCli here to avoid circular dependency with commands.js
	const { wpCli } = require('../support/commands');

	// Generate target filename if not provided
	// Extract a unique name from the path (e.g., "block-query-title" from "tests/fixtures/block-query-title/mu-plugin.php")
	const pathParts = muPluginPath.split('/');
	if (!targetName) {
		const folderName = pathParts[pathParts.length - 2] || 'mu-plugin';
		targetName = `${pluginName}-test-${folderName}.php`;
	}

	// Build PHP code to copy mu-plugin to mu-plugins directory
	// Use wp eval to execute PHP code directly without creating temp files
	const phpCode = `if (!file_exists(WPMU_PLUGIN_DIR)) { wp_mkdir_p(WPMU_PLUGIN_DIR); } $sourceFile = ABSPATH . 'wp-content/plugins/${pluginName}/${muPluginPath}'; $targetFile = WPMU_PLUGIN_DIR . '/${targetName}'; if (file_exists($sourceFile)) { $content = file_get_contents($sourceFile); file_put_contents($targetFile, $content); }`;

	// Escape single quotes for shell: ' becomes '\''
	// Use single quotes in shell command to preserve $ signs in PHP
	const escapedPhpCode = phpCode.replace(/'/g, "'\\''");

	// Execute PHP code directly using wp eval
	// Use ignoreFailures=true to prevent test failure if file doesn't exist
	await wpCli(
		page,
		`wp eval '${escapedPhpCode}'`,
		true, // ignoreFailures = true - don't fail if file doesn't exist
		true // skipEscaping = true - we've already escaped
	);
}

/**
 * Deactivate mu-plugin by removing it from wp-content/mu-plugins/ directory.
 * This function removes the mu-plugin file that was previously activated.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} muPluginPath - Full path to the mu-plugin.php file (relative to plugin root).
 * @param {string} [targetName] - Optional target filename. If not provided, generates from path (must match activateMuPlugin).
 * @param {string} [pluginName='blockera'] - Plugin name to use in paths. Defaults to 'blockera'. Must match the value used in activateMuPlugin.
 * @return {Promise<void>}
 */
async function deactivateMuPlugin(
	page,
	muPluginPath,
	targetName = null,
	pluginName = 'blockera'
) {
	// Import wpCli here to avoid circular dependency with commands.js
	const { wpCli } = require('../support/commands');

	// Generate target filename if not provided (must match activateMuPlugin logic)
	const pathParts = muPluginPath.split('/');
	if (!targetName) {
		const folderName = pathParts[pathParts.length - 2] || 'mu-plugin';
		targetName = `${pluginName}-test-${folderName}.php`;
	}

	// Build PHP code to remove mu-plugin from mu-plugins directory
	const phpCode = `$targetFile = WPMU_PLUGIN_DIR . '/${targetName}'; if (file_exists($targetFile)) { unlink($targetFile); }`;

	// Escape single quotes for shell: ' becomes '\''
	const escapedPhpCode = phpCode.replace(/'/g, "'\\''");

	// Execute PHP code directly using wp eval
	// Use ignoreFailures=true to prevent test failure if file doesn't exist
	await wpCli(
		page,
		`wp eval '${escapedPhpCode}'`,
		true, // ignoreFailures = true - don't fail if file doesn't exist
		true // skipEscaping = true - we've already escaped
	);
}

module.exports = {
	getIframeBody,
	getWindowProperty,
	getWPDataObject,
	getBlockType,
	getSelectedBlock,
	getSelectedBlockStyle,
	getEditedGlobalStylesRecord,
	getEditorContent,
	getBlockeraEntity,
	getBlockClientId,
	disableGutenbergFeatures,
	openBlockInserter,
	addBlockToPost,
	addNewGroupToPost,
	savePage,
	appendBlocks,
	redirectToFrontPage,
	checkForBlockErrors,
	viewPage,
	editPage,
	clearBlocks,
	getBlockSlug,
	openBlockNavigator,
	closeBlockNavigator,
	setBlockStyle,
	selectBlock,
	openSettingsPanel,
	openHeadingToolbarAndSelect,
	openMoreFeaturesControl,
	deSelectBlock,
	reSelectBlock,
	closeWelcomeGuide,
	openDocumentSettingsSidebar,
	getBlockeraStylesWrapper,
	activateMuPlugin,
	deactivateMuPlugin,
	waitForAssertValue,
};
