/**
 * External dependencies
 */
const path = require('path');
const { test, expect } = require('@wordpress/e2e-test-utils-playwright');

/**
 * Internal dependencies
 */
const { getIframeBody } = require('../utils/editor');
const { loginToSite, goTo } = require('../utils/site-navigation');

test.beforeEach(async ({ page }) => {
	// Run these tests as if in a desktop browser with a 720p monitor
	await page.setViewportSize({ width: 1280, height: 720 });

	// Login if not already logged in
	// Note: In Playwright, authentication is typically handled via storageState
	// But we can also manually login if needed
	if (!process.env.isLogin) {
		await loginToSite(page);
	}
});

/**
 * Blockera delay expected time constant.
 */
const BLOCKERA_DELAY_EXPECTED_TIME = 1000;

/**
 * Wait for assert value (helper function).
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {number} time - Time to wait in milliseconds (default: 300).
 * @return {Promise<void>}
 */
async function waitForAssertValue(page, time = BLOCKERA_DELAY_EXPECTED_TIME) {
	await page.waitForTimeout(time);
}

/**
 * Logout from WordPress site.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function logout(page) {
	await goTo(page, '/wp-login.php?loggedout=true&wp_lang=en_US', true);
	// Note: Playwright doesn't have Cypress.session.clearAllSavedSessions()
	// Session management is handled differently in Playwright
}

/**
 * Add a new user to WordPress.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} user - Username.
 * @param {string} pass - Password.
 * @param {string} role - User role.
 * @return {Promise<void>}
 */
async function addNewUser(page, user, pass, role) {
	await goTo(page, '/wp-admin/users.php', true);
	await page.waitForTimeout(1000);

	// Click "Add New User" button
	const addUserButton = page
		.locator('a')
		.filter({ hasText: /Add( New)? User/ })
		.first();
	await addUserButton.click();
	await page.waitForTimeout(1000);

	// Fill in user details
	await page.locator('input[name="user_login"]').clear();
	await page.locator('input[name="user_login"]').fill(user);
	await page.locator('input[name="email"]').clear();
	await page.locator('input[name="email"]').fill(`${user}@${user}.com`);
	await page
		.locator('input[aria-describedby="pass-strength-result"]')
		.clear();
	await page
		.locator('input[aria-describedby="pass-strength-result"]')
		.fill(pass);
	await page
		.locator('label')
		.filter({ hasText: 'Confirm use of weak password' })
		.click();
	await page
		.locator('label')
		.filter({ hasText: 'Send the new user an email about their account' })
		.click();
	await page.locator('select[name="role"]').selectOption(role);

	// Submit the form
	await page
		.locator('input[value="Add New User"], input[value="Add User"]')
		.click();
}

/**
 * Get element by data-cy attribute.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} selector - Data-cy selector value.
 * @param {Object} options - Locator options.
 * @return {import('@playwright/test').Locator} Locator.
 */
function getByDataCy(page, selector, options = {}) {
	return page.locator(`[data-cy="${selector}"]`, options);
}

/**
 * Get element by data-test attribute.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} selector - Data-test selector value.
 * @param {Object} options - Locator options.
 * @return {import('@playwright/test').Locator} Locator.
 */
function getByDataTest(page, selector, options = {}) {
	return page.locator(`[data-test="${selector}"]`, options);
}

/**
 * Get element by data-testid attribute.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} selector - Data-testid selector value.
 * @param {Object} options - Locator options.
 * @return {import('@playwright/test').Locator} Locator.
 */
function getByDataTestId(page, selector, options = {}) {
	return page.locator(`[data-testid="${selector}"]`, options);
}

/**
 * Get element by data-id attribute.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} selector - Data-id selector value.
 * @param {Object} options - Locator options.
 * @return {import('@playwright/test').Locator} Locator.
 */
function getByDataId(page, selector, options = {}) {
	return page.locator(`[data-id="${selector}"]`, options);
}

/**
 * Get element by aria-label attribute.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} selector - Aria-label value.
 * @param {string} fallbackLabel - Optional fallback label.
 * @param {Object} options - Locator options.
 * @return {import('@playwright/test').Locator} Locator.
 */
function getByAriaLabel(page, selector, fallbackLabel = null, options = {}) {
	if (fallbackLabel) {
		return page.locator(
			`[aria-label="${selector}"], [aria-label="${fallbackLabel}"]`,
			options
		);
	}

	// Handle "Select X" pattern
	const regexp = /\bSelect\b\s\w+/i;
	if (regexp.exec(selector)) {
		const parsedSelector = selector.split(' ');
		const parsedLabel = selector.split(':');

		if (parsedLabel?.length > 1) {
			return page.locator(
				`[aria-label="${parsedSelector[0].trim()} parent block: ${parsedSelector[1].trim()}"], [aria-label="${parsedLabel[1].trim()}"]`,
				options
			);
		}

		return page.locator(
			`[aria-label="${parsedSelector[0].trim()} parent block: ${parsedSelector[1].trim()}"]`,
			options
		);
	}

	return page.locator(`[aria-label="${selector}"]`, options);
}

/**
 * Get CSS variable value.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} cssVarName - CSS variable name.
 * @param {string} selector - Optional selector.
 * @return {Promise<string>} CSS variable value.
 */
async function cssVar(page, cssVarName, selector = null) {
	if (selector) {
		return await page.evaluate(
			({ varName, sel }) => {
				const element = document.body.querySelector(sel);
				return window
					.getComputedStyle(element)
					.getPropertyValue(varName)
					.trim();
			},
			{ varName: cssVarName, sel: selector }
		);
	}

	return await page.evaluate((varName) => {
		return window
			.getComputedStyle(document.body)
			.getPropertyValue(varName)
			.trim();
	}, cssVarName);
}

/**
 * Get parent container element.
 * Returns the first [data-cy] container that has a descendant with the given aria-label.
 * Tries :last-child selector first; falls back to base selector when no match.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} ariaLabel - Aria label.
 * @param {string} parentsDataCy - Parent data-cy value (default: 'base-control').
 * @param {Object} options - Optional options.
 * @param {boolean} options.useLastChild - When true, try :last-child first, fallback to base selector. Default: true. Pass false to skip and use base selector only.
 * @return {Promise<import('@playwright/test').Locator>} Parent container locator (first match).
 */
async function getParentContainer(
	page,
	ariaLabel,
	parentsDataCy = 'base-control',
	options = {}
) {
	const baseSelector = `[data-cy="${parentsDataCy}"]:has([aria-label="${ariaLabel}"])`;

	if (options.useLastChild === false) {
		return page.locator(baseSelector).first();
	}

	const lastChildLocator = page.locator(`${baseSelector}:last-child`);
	if ((await lastChildLocator.count()) > 0) {
		return lastChildLocator.first();
	}

	return page.locator(baseSelector).first();
}

/**
 * Get block by name.
 *
 * In the WordPress block editor (Gutenberg), block elements use [data-type] in the site editor/canvas (iframe).
 * This function reliably selects a block by its name, supporting both post editor and site/canvas (iframe),
 * and returns a Locator for the nth matching block (by index).
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} blockName - Block name (e.g., 'core/paragraph', 'core/group').
 * @param {string} blockTag - Optional block tag (e.g., 'div', '[role="presentation"]'), default is ''.
 * @param {number} index - Zero-based index of the block when multiple blocks of same type exist (default: 0).
 * @return {Promise<import('@playwright/test').Locator>} Block locator for the nth matching block.
 */
async function getBlock(page, blockName, blockTag = '', index = 0) {
	const iframeSelector = 'iframe[name="editor-canvas"]';
	const hasIframe = (await page.locator(iframeSelector).count()) > 0;

	const isDefault = blockName === 'default';

	// Utility to wait for and click 'add default block', as before.
	async function addDefaultBlock(ctx) {
		const addDefaultSelector = '[aria-label="Add default block"]';
		await ctx
			.locator(addDefaultSelector)
			.first()
			.waitFor({ state: 'visible', timeout: 2500 });
		await ctx.locator(addDefaultSelector).first().click();
	}

	// Site/Template editor: canvas iframe (block editor uses [data-type] on block wrapper elements)
	if (hasIframe) {
		const frameLoc = page.frameLocator(iframeSelector);
		if (isDefault) {
			await addDefaultBlock(frameLoc);
			blockName = 'core/paragraph';
		}
		// Exclude blocks inside template parts (Header, Footer) - they intercept clicks and are not the main content
		const frame = page.frame({ name: 'editor-canvas' });
		if (frame) {
			const blockHandle = await frame.evaluateHandle(
				({ name, idx }) => {
					const all = document.querySelectorAll(
						`[data-type="${name}"]`
					);
					const filtered = Array.from(all).filter((el) => {
						let parent = el.parentElement;
						while (parent && parent !== document.body) {
							if (parent.dataset?.type === 'core/template-part') {
								return false;
							}
							parent = parent.parentElement;
						}
						return true;
					});
					return filtered[idx] || null;
				},
				{ name: blockName, idx: index }
			);
			if (blockHandle.asElement()) {
				const element = blockHandle.asElement();
				const selector = await element.evaluate((el) => {
					if (el.id) {
						return `#${el.id}`;
					}
					if (el.dataset.block) {
						return `[data-block="${el.dataset.block}"]`;
					}
					return null;
				});
				blockHandle.dispose();
				if (selector) {
					const locator = frameLoc.locator(selector);
					await locator.waitFor({ state: 'visible', timeout: 5000 });
					return locator;
				}
			} else {
				blockHandle.dispose();
			}
		}
		// Fallback: use selector without template-part exclusion
		const selectorFallback = blockTag
			? `${blockTag}[data-type="${blockName}"]`
			: `[data-type="${blockName}"]`;
		const blocksLocator = frameLoc.locator(selectorFallback);
		const blockLocator = blocksLocator.nth(index);
		await blockLocator.waitFor({ state: 'visible', timeout: 5000 });
		return blockLocator;
	}

	// Block/Post editor (no iframe): try [data-type] in main document, then fallbacks
	if (isDefault) {
		await addDefaultBlock(page);
		blockName = 'core/paragraph';
	}

	// 1. Try [data-type] in main document (some post editor setups use it)
	const dataTypeLocators = page.locator(`[data-type="${blockName}"]`);
	if ((await dataTypeLocators.count()) > 0) {
		const block = dataTypeLocators.nth(index);
		await block.waitFor({ state: 'visible', timeout: 5000 });
		return block;
	}

	// 2. Try locate block by aria-label (common in block editors for recognizable blocks)
	const ariaSelector = `[aria-label*="${blockName.replace(/^core\//, '').replace(/-/g, ' ')}"]`;
	const ariaLocators = page.locator(ariaSelector);
	if ((await ariaLocators.count()) > 0) {
		const block = ariaLocators.nth(index);
		await block.waitFor({ state: 'visible', timeout: 5000 });
		return block;
	}

	// 3. Try Gutenberg-specific: data-block and data-type via evaluate (post editor without iframe)
	const blockIndex = index;
	const maybeBlock = await page.evaluateHandle(
		({ blockName: name, blockIndex: idx }) => {
			const blockEls = Array.from(
				document.querySelectorAll('[data-block],[data-type]')
			).filter((el) => el.dataset.type === name);
			return blockEls.length > idx ? blockEls[idx] : null;
		},
		{ blockName, blockIndex }
	);

	if (maybeBlock && maybeBlock.asElement()) {
		const blockHandle = maybeBlock.asElement();
		const selector = await blockHandle.evaluate((el) => {
			if (el.id) {
				return `#${el.id}`;
			}
			if (el.dataset.block) {
				return `[data-block="${el.dataset.block}"]`;
			}
			return null;
		});
		if (selector) {
			const block = page.locator(selector);
			await block.waitFor({ state: 'visible', timeout: 5000 });
			return block;
		}
		return page.locator('body').filter({ has: maybeBlock });
	}

	// 4. Fallback: try finding block by text content (label matching)
	const blockLabel = blockName.replace(/^core\//, '').replace(/-/g, ' ');
	const guessLocators = page.locator(`text=/^${blockLabel}$/i`);
	if ((await guessLocators.count()) > 0) {
		const block = guessLocators.nth(index);
		await block.waitFor({ state: 'visible', timeout: 5000 });
		return block;
	}

	throw new Error(
		`Block "${blockName}" (index ${index}) could not be located in this editor context.`
	);
}

/**
 * Get selected block.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<import('@playwright/test').Locator>} Selected block locator.
 */
async function getSelectedBlock(page) {
	const iframe = page.frameLocator('iframe[name="editor-canvas"]');
	return iframe.locator('.wp-block.is-selected');
}

/**
 * Upload file.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} fileName - File name from fixtures.
 * @param {string} fileType - File MIME type.
 * @param {string} selector - Input selector.
 * @return {Promise<void>}
 */
async function uploadFile(page, fileName, fileType, selector) {
	const filePath = require('path').join(__dirname, '../fixtures', fileName);

	await page.locator(selector).setInputFiles(filePath);
}

/**
 * Multi-click an element.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} selector - Element selector.
 * @param {number} count - Number of clicks.
 * @return {Promise<void>}
 */
async function multiClick(page, selector, count) {
	const element = page.locator(selector);
	for (let i = 0; i < count; i++) {
		await element.click({ force: true });
	}
}

/**
 * Click outside (on body).
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function clickOutside(page) {
	await page.locator('body').click({ position: { x: 0, y: 0 } });
}

/**
 * Set slider value.
 *
 * @param {import('@playwright/test').Locator} element - Slider element.
 * @param {number} value - Value to set.
 * @return {Promise<void>}
 */
async function setSliderValue(element, value) {
	await element.evaluate((el, val) => {
		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
			window.HTMLInputElement.prototype,
			'value'
		)?.set;

		nativeInputValueSetter?.call(el, val);
		el.dispatchEvent(new Event('input', { bubbles: true }));
	}, value);
}

/**
 * Paste text into element.
 *
 * @param {import('@playwright/test').Locator} element - Element to paste into.
 * @param {string} text - Text to paste.
 * @return {Promise<void>}
 */
async function pasteText(element, text) {
	await element.fill(text);
	await element.press('Control+v');
}

/**
 * Custom select item from dropdown.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} item - Item text to select.
 * @return {Promise<void>}
 */
async function customSelect(page, item) {
	await page
		.locator('button[aria-haspopup="listbox"]')
		.click({ force: true });

	await page.locator('[role="listbox"]').locator(`text=${item}`).click({
		force: true,
	});
}

/**
 * Open accordion by heading.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} accordionHeading - Accordion heading text.
 * @return {Promise<void>}
 */
async function openAccordion(page, accordionHeading) {
	await page
		.locator('h2')
		.filter({ hasText: accordionHeading })
		.locator('..')
		.locator('..')
		.click({ force: true });
}

/**
 * Add repeater item.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} ariaLabel - Aria label of add button.
 * @param {number} clickCount - Number of times to click.
 * @return {Promise<void>}
 */
async function addRepeaterItem(page, ariaLabel, clickCount) {
	await multiClick(page, `[aria-label="${ariaLabel}"]`, clickCount);
}

/**
 * Set input field value.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} fieldLabel - Field label.
 * @param {string} groupLabel - Group label.
 * @param {string} value - Value to set.
 * @param {boolean} force - Force click.
 * @return {Promise<void>}
 */
async function setInputFieldValue(
	page,
	fieldLabel,
	groupLabel,
	value,
	force = false
) {
	const group = page
		.locator('h2')
		.filter({ hasText: groupLabel })
		.locator('..')
		.locator('..');

	await group
		.locator(`[aria-label="${fieldLabel}"]`)
		.locator('..')
		.locator('..')
		.locator('input')
		.fill(force ? `{selectall}${value}` : value, { force });
}

/**
 * Check input field value.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} fieldLabel - Field label.
 * @param {string} groupLabel - Group label.
 * @param {string} value - Expected value.
 * @return {Promise<void>}
 */
async function checkInputFieldValue(page, fieldLabel, groupLabel, value) {
	const group = page
		.locator('h2')
		.filter({ hasText: groupLabel })
		.locator('..')
		.locator('..');

	const input = group
		.locator(`[aria-label="${fieldLabel}"]`)
		.locator('..')
		.locator('..')
		.locator('input');

	await expect(input).toHaveValue(value);
}

/**
 * Set color control value.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} label - Control label.
 * @param {string} value - Color value.
 * @return {Promise<void>}
 */
async function setColorControlValue(page, label, value) {
	const container = await getParentContainer(page, label);
	await container.locator('[data-cy="color-btn"]').click();

	const popover = page.locator('[data-wp-component="Popover"]').last();
	await popover.locator('[data-cy="color-picker-css-value"]').clear();
	await popover
		.locator('[data-cy="color-picker-css-value"]')
		.fill(value + ' ');

	const closeButton = popover.locator('[aria-label="Close"]');
	if ((await closeButton.count()) > 0) {
		await closeButton.click({ force: true });
	}
}

/**
 * Clear color control value.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} label - Control label.
 * @return {Promise<void>}
 */
async function clearColorControlValue(page, label) {
	const container = await getParentContainer(page, label);
	await container.locator('[data-cy="color-btn"]').click();

	const popover = page.locator('[data-wp-component="Popover"]').last();
	await popover.locator('[aria-label="Reset Color (Clear)"]').click();

	// After clearing the color, wait for 50ms to ensure the color is cleared.
	await page.waitForTimeout(50);
}

/**
 * Click value addon button to open popover.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {import('@playwright/test').Locator} container - Container locator (optional).
 * @return {Promise<void>}
 */
async function clickValueAddonButton(page, container = null) {
	const targetContainer = container || page;
	const button = targetContainer.locator('[data-cy="value-addon-btn"]');
	await button.dispatchEvent('click');
}

/**
 * Select value addon item from popover.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} itemID - Item ID to select.
 * @return {Promise<void>}
 */
async function selectValueAddonItem(page, itemID) {
	// Click on value addon with item ID.
	await page.locator(`[data-cy="va-item-${itemID}"]`).dispatchEvent('click');
}

/**
 * Remove value addon.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {import('@playwright/test').Locator} container - Container locator (optional).
 * @return {Promise<void>}
 */
async function removeValueAddon(page, container = null) {
	const targetContainer = container || page;
	await targetContainer
		.locator('[data-cy="value-addon-btn-remove"]')
		.dispatchEvent('click');
}

/**
 * Set block variation.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} variation - Variation value.
 * @return {Promise<void>}
 */
async function setBlockVariation(page, variation) {
	const wrapper = page.locator('.blockera-block-card-wrapper');
	await wrapper
		.locator('.blockera-block-variation-transforms')
		.locator(`button[data-value="${variation}"]`)
		.click();
}

/**
 * Check active block variation.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} variation - Variation value.
 * @return {Promise<void>}
 */
async function checkActiveBlockVariation(page, variation) {
	const wrapper = page.locator('.blockera-block-card-wrapper');
	await expect(
		wrapper
			.locator('.blockera-block-variation-transforms')
			.locator(`button[data-value="${variation}"][aria-checked="true"]`)
	).toBeVisible();
}

/**
 * Open repeater item.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} parentContainer - Parent container aria label.
 * @param {string} contains - Text to find.
 * @return {Promise<void>}
 */
async function openRepeaterItem(page, parentContainer, contains) {
	const container = await getParentContainer(page, parentContainer);
	await container
		.locator('[data-cy="group-control-header"]')
		.filter({ hasText: contains })
		.click();
}

/**
 * Close spotlight popover.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function closeSpotlightPopover(page) {
	await page.locator('.blockera-spotlighter-svg').click({ force: true });
}

/**
 * Normalize CSS content.
 *
 * @param {string} cssContent - CSS content to normalize.
 * @return {string} Normalized CSS content.
 */
function normalizeCSSContent(cssContent) {
	return (
		cssContent
			.replace(/\/\*[\s\S]*?\*\//g, '') // Remove CSS comments
			.replace(/[\t\n\r]+/g, ' ') // Replace tabs and newlines with space
			.replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
			.replace(/\s*{\s*/g, '{') // Remove spaces around opening braces
			.replace(/\s*}\s*/g, '}') // Remove spaces around closing braces
			.replace(/\s*:\s*/g, ':') // Remove spaces around colons
			.replace(/\s*;\s*/g, ';') // Remove spaces around semicolons

			// Normalize attribute selectors to use double quotes
			.replace(
				/\[([^\]\s~|^$*!=]+)\s*([~|^$*]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]\s]+))\]/g,
				(_, attr, operator, v1, v2, v3) => {
					const value = v1 ?? v2 ?? v3 ?? '';
					return `[${attr}${operator}"${value}"]`;
				}
			)

			.trim()
	); // Remove leading/trailing whitespace
}

/**
 * Execute WP CLI command.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object (not used, but kept for API consistency).
 * @param {string} command - WP CLI command (without 'wp ' prefix).
 * @param {boolean} ignoreFailures - Don't fail on error.
 * @param {boolean} skipEscaping - Skip escaping quotes.
 * @return {Promise<Object>} Command result.
 */
async function wpCli(
	page,
	command,
	ignoreFailures = false,
	skipEscaping = false
) {
	const { exec } = require('child_process');
	const { promisify } = require('util');
	const execAsync = promisify(exec);

	const escapedCommand = skipEscaping
		? command
		: command.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

	// Use plugin root as cwd so wp-env finds .wp-env.json (critical for CI)
	const pluginRoot = path.resolve(__dirname, '../../../../');

	try {
		const result = await execAsync(
			`npm --silent run env run cli -- ${escapedCommand}`,
			{ cwd: pluginRoot }
		);
		return { stdout: result.stdout, stderr: result.stderr, code: 0 };
	} catch (error) {
		if (ignoreFailures) {
			return {
				stdout: error.stdout || '',
				stderr: error.stderr || '',
				code: error.code || 1,
			};
		}
		throw error;
	}
}

/**
 * Check block card items.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {Array<string>} expectedStates - Expected state IDs.
 * @param {boolean} isInnerBlock - Whether checking inner block.
 * @return {Promise<void>}
 */
async function checkBlockCardItems(page, expectedStates, isInnerBlock = false) {
	const container = isInnerBlock
		? '.block-card--inner-block'
		: '.blockera-extension-block-card';

	const card = page.locator(container);

	// Check all expected items exist and are visible
	for (const state of expectedStates) {
		const item = card.locator(
			`[data-cy="repeater-item"][data-id="${state}"]`
		);
		await expect(item).toBeVisible();
	}

	// Check no unexpected items exist
	const allItems = card.locator('[data-cy="repeater-item"]');
	const count = await allItems.count();

	for (let i = 0; i < count; i++) {
		const item = allItems.nth(i);
		const dataId = await item.getAttribute('data-id');
		if (!expectedStates.includes(dataId)) {
			throw new Error(`Unexpected repeater item found: ${dataId}`);
		}
	}
}

/**
 * Check block states picker items.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {Array<string>} expectedItems - Expected item test IDs.
 * @param {boolean} checkExtraItems - Whether to check for extra items.
 * @return {Promise<void>}
 */
async function checkBlockStatesPickerItems(
	page,
	expectedItems,
	checkExtraItems = false
) {
	await page
		.locator(
			'[data-test="blockera-block-state-container"] [data-test="add-new-block-state"]'
		)
		.click();

	const popover = page.locator(
		'.blockera-component-popover.blockera-states-picker-popover'
	);

	for (const state of expectedItems) {
		await expect(popover.locator(`[data-test="${state}"]`)).toBeVisible();
	}

	if (checkExtraItems) {
		const allItems = popover.locator('.blockera-feature-type');
		const count = await allItems.count();

		for (let i = 0; i < count; i++) {
			const item = allItems.nth(i);
			const dataTest = await item.getAttribute('data-test');
			if (!expectedItems.includes(dataTest)) {
				throw new Error(`Unexpected item found: ${dataTest}`);
			}
		}
	}
}

/**
 * Check block sections.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {Array<string>} expectedSections - Expected section names.
 * @param {string} check - Check type ('exist' or 'not.exist').
 * @return {Promise<void>}
 */
async function checkBlockSections(page, expectedSections, check = 'exist') {
	for (const section of expectedSections) {
		const sectionElement = page.locator(
			`.blockera-extension.blockera-extension-${section}`
		);

		if (check === 'exist') {
			await expect(sectionElement).toBeVisible();
		} else {
			await expect(sectionElement).not.toBeVisible();
		}
	}
}

/**
 * Open global styles panel.
 *
 * Waits for the editor to be ready and the button to be visible before clicking.
 * Uses proper Playwright click (not dispatchEvent) for actionability checks.
 * Idempotent: skips click if panel is already open.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function openGlobalStylesPanel(page) {
	const button = page
		.locator(
			'.interface-interface-skeleton button[aria-controls="edit-site:global-styles"]'
		)
		.first();

	await button.waitFor({ state: 'visible', timeout: 10000 });

	const isPressed = await button.getAttribute('aria-pressed');
	if (isPressed === 'true') {
		return;
	}

	await button.click();

	await expect(button).toHaveAttribute('aria-pressed', 'true', {
		timeout: 5000,
	});
}

/**
 * Open settings panel.
 *
 * Waits for the editor to be ready and the button to be visible before clicking.
 * Uses proper Playwright click (not dispatchEvent) for actionability checks.
 * Idempotent: skips click if panel is already open.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function openSettingsPanel(page) {
	const button = page
		.locator(
			'.interface-interface-skeleton button[aria-controls="edit-post:document"]'
		)
		.first();

	await button.waitFor({ state: 'visible', timeout: 10000 });

	const isPressed = await button.getAttribute('aria-pressed');
	if (isPressed === 'true') {
		return;
	}

	await button.click();

	await expect(button).toHaveAttribute('aria-pressed', 'true', {
		timeout: 5000,
	});
}

/**
 * Add new transition.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function addNewTransition(page) {
	const container = await getParentContainer(page, 'Transitions');
	await container.locator('[aria-label="Add New Transition"]').click();
}
/**
 * Prepare editor for screenshot.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {boolean} reset - Whether to reset (show UI elements).
 * @return {Promise<void>}
 */
async function prepareEditorForScreenshot(page, reset = false) {
	if (!reset) {
		// Check if the close settings button exists before clicking
		const closeSettingsButton = page.locator(
			'.editor-sidebar [aria-label="Close Settings"]'
		);
		const closeSettingsButtonCount = await closeSettingsButton.count();
		if (closeSettingsButtonCount > 0) {
			await closeSettingsButton.click();
		}

		await page.evaluate(() => {
			const skeleton = document.querySelector(
				'body.is-fullscreen-mode .interface-interface-skeleton'
			);
			if (skeleton) {
				skeleton.style.top = '0';
			}

			const wpbody = document.querySelector('#wpbody');
			if (wpbody) {
				wpbody.style.paddingTop = '0';
			}

			const adminbar = document.querySelector('#wpadminbar');
			if (adminbar) {
				adminbar.style.display = 'none';
			}

			const footer = document.querySelector(
				'.admin-ui-navigable-region.interface-interface-skeleton__footer'
			);
			if (footer) {
				footer.style.display = 'none';
			}

			const iframe = document.querySelector(
				'iframe[name="editor-canvas"]'
			);
			if (iframe && iframe.contentDocument) {
				const titleWrapper = iframe.contentDocument.querySelector(
					'.edit-post-visual-editor__post-title-wrapper'
				);
				if (titleWrapper) {
					titleWrapper.style.display = 'none';
				}
			}

			const header = document.querySelector(
				'.admin-ui-navigable-region.interface-interface-skeleton__header'
			);
			if (header) {
				header.style.display = 'none';
			}
		});
	} else {
		await setScreenshotViewport(page, 'desktop');

		await page.evaluate(() => {
			const skeleton = document.querySelector(
				'body.is-fullscreen-mode .interface-interface-skeleton'
			);
			if (skeleton) {
				skeleton.style.top = '32px';
			}

			const adminbar = document.querySelector('#wpadminbar');
			if (adminbar) {
				adminbar.style.display = 'flex';
			}

			const footer = document.querySelector(
				'.admin-ui-navigable-region.interface-interface-skeleton__footer'
			);
			if (footer) {
				footer.style.display = 'flex';
			}

			const iframe = document.querySelector(
				'iframe[name="editor-canvas"]'
			);
			if (iframe && iframe.contentDocument) {
				const titleWrapper = iframe.contentDocument.querySelector(
					'.edit-post-visual-editor__post-title-wrapper'
				);
				if (titleWrapper) {
					titleWrapper.style.display = 'block';
				}
			}

			const header = document.querySelector(
				'.admin-ui-navigable-region.interface-interface-skeleton__header'
			);
			if (header) {
				header.style.display = 'block';
			}
		});
	}
}

/**
 * Prepare frontend for screenshot.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @return {Promise<void>}
 */
async function prepareFrontendForScreenshot(page) {
	await page.evaluate(() => {
		const adminbar = document.querySelector('#wpadminbar');
		if (adminbar) {
			adminbar.style.display = 'none';
		}
	});
}

/**
 * Set editor viewport for screenshot.
 * Calculates the viewport height based on the editor container height.
 * Sets the viewport size to the calculated height.
 * Waits for the viewport to be set.
 * By dong this so we can capture the full editor content in the screenshot.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {Object} config - Additional config.
 * @return {Promise<void>}
 */
async function setEditorViewportForScreenshot(
	page,
	size = 'desktop',
	config = {}
) {
	let width = 1600;
	let height = 5000;
	let containerHeight = null;

	if (size === 'desktop') {
		width = 1600;
	} else if (size === 'mobile') {
		width = 450;
	}

	const iframeBody = getIframeBody(page);
	const editorContainer = iframeBody.locator('.is-root-container');

	// Get the element's scrollHeight to determine viewport height
	containerHeight = await editorContainer.evaluate((el) => {
		// Get the maximum height needed to show the full element
		const elementHeight = Math.max(
			el.scrollHeight,
			el.offsetHeight,
			el.getBoundingClientRect().height
		);
		// Also consider document height in case element extends beyond viewport
		const docHeight = Math.max(
			document.documentElement.scrollHeight,
			document.body.scrollHeight,
			document.documentElement.offsetHeight,
			document.body.offsetHeight
		);
		return Math.max(elementHeight, docHeight);
	});

	// Set viewport height based on container height + 500px
	height = containerHeight + 500;

	const finalWidth = config?.width || width;
	const finalHeight = config?.height || height;

	await page.setViewportSize({
		width: 1600,
		height: finalHeight,
	});

	// Set iframe width to the final width
	await iframeBody.evaluate((el, width) => {
		el.style.width = width + 'px';
	}, finalWidth);

	// Set editor container padding to 20px 0
	await editorContainer.evaluate((el, width) => {
		el.style.boxSizing = 'border-box';
	}, finalWidth);

	// Add style to iframe to ensure design is sync and spaces are static
	await iframeBody.evaluate(() => {
		const style = document.createElement('style');
		style.innerHTML = `
			.is-root-container.has-global-padding {
				font-size: 18px !important;
				line-height: 0;
				letter-spacing: 0 !important;
				padding: 30px !important;
				margin-top: 30px !important;
				margin-bottom: 30px !important;
				box-sizing: border-box !important;
			}

			.is-root-container.has-global-padding > * {
				line-height: normal !important;
			}
			
			:root :where(.is-layout-constrained) > * {
				margin-block-start: 20px;
				margin-block-end: 0;
			}
		`;
		document.head.appendChild(style);
	});

	// Close settings panel
	const settingsButton = await page.locator(
		'.editor-header__settings button[aria-label="Settings"]'
	);
	await settingsButton.click();

	// Close Secondary sidebar (if open)
	// Check for buttons that would close the secondary sidebar
	const hideSecondarySidebarButton = page.locator(
		'.editor-header__toolbar button[aria-label="Hide secondary sidebar"]'
	);
	const hideButtonCount = await hideSecondarySidebarButton.count();
	if (hideButtonCount > 0) {
		await hideSecondarySidebarButton.first().click();
	}

	if (config?.wait) {
		await page.waitForTimeout(config.wait);
	}
}

/**
 * Set screenshot viewport.
 *
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} size - Viewport size ('desktop' or 'mobile').
 * @param {Object} config - Additional config.
 * @param {import('@playwright/test').Locator} config.editorContainer - Optional editor container locator to adjust iframe height.
 * @return {Promise<void>}
 */
async function setFrontendViewportForScreenshot(
	page,
	size = 'desktop',
	config = {}
) {
	let width = 1600;
	const height = 5000;

	if (size === 'desktop') {
		width = 1600;
	} else if (size === 'mobile') {
		width = 450;
	}

	const finalWidth = config?.width || width;
	const finalHeight = config?.height || height;

	await page.setViewportSize({
		width: finalWidth,
		height: finalHeight,
	});

	const entryContent = page.locator('.entry-content').first();
	await entryContent.evaluate((el, width) => {
		el.style.width = width + 'px';
	}, finalWidth);

	// Add extra CSS to make sure spaces are always static to not affect the screenshot comparison.
	await page.evaluate(() => {
		const style = document.createElement('style');
		style.textContent = `
			.entry-content.has-global-padding {
				font-size: 18px !important;
				line-height: 0;
				letter-spacing: 0 !important;
				box-sizing: border-box !important;
				padding: 30px !important;
				margin: 30px -30px !important;
			}

			.entry-content.has-global-padding > * {
				line-height: normal;
			}

			:root :where(.is-layout-constrained) > * {
				margin-block-start: 20px;
				margin-block-end: 0;
			}
		`;
		document.head.appendChild(style);
	});

	if (config?.wait) {
		await page.waitForTimeout(config.wait);
	}
}

module.exports = {
	test,
	expect,
	addNewUser,
	logout,
	waitForAssertValue,
	getByDataCy,
	getByDataTest,
	getByDataTestId,
	getByDataId,
	getByAriaLabel,
	cssVar,
	getParentContainer,
	getBlock,
	getSelectedBlock,
	uploadFile,
	multiClick,
	clickOutside,
	setSliderValue,
	pasteText,
	customSelect,
	openAccordion,
	addRepeaterItem,
	setInputFieldValue,
	checkInputFieldValue,
	setColorControlValue,
	clearColorControlValue,
	clickValueAddonButton,
	selectValueAddonItem,
	removeValueAddon,
	setBlockVariation,
	checkActiveBlockVariation,
	openRepeaterItem,
	closeSpotlightPopover,
	normalizeCSSContent,
	wpCli,
	checkBlockCardItems,
	checkBlockStatesPickerItems,
	checkBlockSections,
	openGlobalStylesPanel,
	openSettingsPanel,
	addNewTransition,
	prepareEditorForScreenshot,
	prepareFrontendForScreenshot,
	setEditorViewportForScreenshot,
	setFrontendViewportForScreenshot,
};
