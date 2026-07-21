/**
 * Minimal editor helpers for Blockera editor performance specs.
 *
 * Adapted from Gutenberg test/performance/fixtures/perf-utils.ts
 */

const path = require('node:path');
const { expect } = require('@wordpress/e2e-test-utils-playwright');
const {
	getParentContainer,
	setColorControlValue,
	openGlobalStylesPanel,
} = require('@blockera/dev-playwright/js/support/commands');

const BLOCK_LEVEL_BACKGROUND_IMAGE_FIXTURE = path.join(
	process.cwd(),
	'packages/dev-cypress/js/fixtures/bg-extension-test.png'
);

class EditorPerfUtils {
	/**
	 * @param {{ page: import('@playwright/test').Page }} args
	 */
	constructor({ page }) {
		this.page = page;
	}

	/**
	 * Ensures the post editor is in visual (not code/text) mode.
	 * Performance env preferences may leave the editor in `is-mode-text`.
	 */
	async switchToVisualEditor() {
		await this.page.waitForFunction(() => window?.wp?.data);

		const mode = await this.page.evaluate(() => {
			const select = window.wp.data.select('core/edit-post');
			if (select?.getEditorMode) {
				return select.getEditorMode();
			}
			const editor = window.wp.data.select('core/editor');
			return editor?.getEditorMode?.() || null;
		});

		if (mode && mode !== 'visual') {
			await this.page.evaluate(() => {
				const dispatch = window.wp.data.dispatch;
				if (dispatch('core/edit-post')?.switchEditorMode) {
					dispatch('core/edit-post').switchEditorMode('visual');
					return;
				}
				dispatch('core/editor')?.switchEditorMode?.('visual');
			});
		}

		// Fallback UI control when store APIs differ across WP versions.
		const stillText = await this.page
			.locator(
				'.editor-editor-interface.is-mode-text, .editor-text-editor'
			)
			.first()
			.isVisible()
			.catch(() => false);
		if (stillText) {
			const visualButton = this.page.getByRole('button', {
				name: /Visual editor|Exit code editor/i,
			});
			if (await visualButton.isVisible().catch(() => false)) {
				await visualButton.click();
			}
		}
	}

	/**
	 * Waits until the visual editor shell is ready.
	 */
	async waitForEditor() {
		await this.switchToVisualEditor();
		await this.page
			.locator(
				'.editor-visual-editor, .edit-post-visual-editor, iframe[name=editor-canvas]'
			)
			.first()
			.waitFor({ state: 'visible', timeout: 60000 });
	}

	/**
	 * Returns the locator for the editor canvas (legacy or iframed).
	 *
	 * @param {import('@playwright/test').Locator} [canvasLocator]
	 * @return {Promise<import('@playwright/test').Locator|import('@playwright/test').FrameLocator>} Canvas locator.
	 */
	async getCanvas(
		canvasLocator = this.page.locator(
			'.wp-block-post-content, iframe[name=editor-canvas]'
		)
	) {
		await this.waitForEditor();
		const target = canvasLocator.first();
		await target.waitFor({ state: 'attached', timeout: 60000 });

		const isFramed = await target.evaluate(
			(node) => node.tagName === 'IFRAME'
		);

		if (isFramed) {
			return target.frameLocator(':scope');
		}

		return target;
	}

	/**
	 * Saves the post as a draft and returns its ID.
	 *
	 * @return {Promise<string|null>} Draft post ID.
	 */
	async saveDraft() {
		const saveButton = this.page.getByRole('button', {
			name: 'Save draft',
		});
		if (await saveButton.isVisible().catch(() => false)) {
			await saveButton.click();
			await expect(
				this.page.getByRole('button', { name: 'Saved' })
			).toBeDisabled({ timeout: 60000 });
		}

		return new URL(this.page.url()).searchParams.get('post');
	}

	/**
	 * Disables editor autosave for stable interaction timings.
	 */
	async disableAutosave() {
		await this.page.waitForFunction(() => window?.wp?.data);

		await this.page.evaluate(() => {
			return window.wp.data.dispatch('core/editor').updateEditorSettings({
				autosaveInterval: 100000000000,
				localAutosaveInterval: 100000000000,
			});
		});
	}

	/**
	 * Inserts a single paragraph block and selects it for block-level styling.
	 *
	 * @param {string} [content] Paragraph text.
	 */
	async insertParagraph(content = 'This is test paragraph') {
		await this.page.waitForFunction(
			() => window?.wp?.blocks && window?.wp?.data
		);

		await this.page.evaluate((text) => {
			const { createBlock } = window.wp.blocks;
			const { dispatch } = window.wp.data;
			const block = createBlock('core/paragraph', { content: text });
			dispatch('core/block-editor').resetBlocks([block]);
			dispatch('core/block-editor').selectBlock(block.clientId);
		}, content);
	}

	/**
	 * Adds a block-level background image layer via Image & Gradient repeater
	 * (see background-image.general-4.e2e.cy.js).
	 *
	 * @param {string} [filePath] Absolute path to the upload fixture.
	 */
	async setupBlockLevelBackgroundImage(
		filePath = BLOCK_LEVEL_BACKGROUND_IMAGE_FIXTURE
	) {
		const imageAndGradientContainer = await getParentContainer(
			this.page,
			'Image & Gradient'
		);
		await imageAndGradientContainer
			.getByRole('button', { name: 'Add New Background' })
			.click();

		const popoverHeader = this.page
			.locator('[data-test="popover-header"]')
			.locator('..');
		await popoverHeader
			.getByRole('button', { name: /media library/i })
			.click();
		await this.page.locator('#menu-item-upload').click();
		await this.page.locator('input[type="file"]').setInputFiles(filePath);
		await this.page.locator('.media-toolbar-primary > .button').click();

		const canvas = await this.getCanvas();
		const paragraph = canvas.locator('.wp-block-paragraph').first();
		await expect(paragraph).toHaveCSS(
			'background-image',
			/bg-extension-test/,
			{ timeout: 60000 }
		);
	}

	/**
	 * Opens the block-level background image popover when it is not visible.
	 */
	async ensureBlockLevelBackgroundImagePopoverOpen() {
		const popover = this.page.locator('.blockera-component-popover').last();
		if (await popover.isVisible().catch(() => false)) {
			return;
		}

		const imageAndGradientContainer = await getParentContainer(
			this.page,
			'Image & Gradient'
		);
		await imageAndGradientContainer
			.locator('[data-cy="repeater-item"]')
			.first()
			.click();
		await popover.waitFor({ state: 'visible', timeout: 30000 });
	}

	/**
	 * Sets block-level background image size in the open background popover.
	 *
	 * @param {'contain'|'cover'|'custom'} sizeValue Background size preset.
	 */
	async setBlockLevelBackgroundImageSize(sizeValue) {
		await this.ensureBlockLevelBackgroundImagePopoverOpen();

		const popover = this.page.locator('.blockera-component-popover').last();
		await popover
			.locator('[data-cy="base-control"]:has([aria-label="Size"])')
			.locator(`button[data-value="${sizeValue}"]`)
			.click();
	}

	/**
	 * Opens Block Style Variations for a block type in Global Styles
	 * (see shared-style-variation.global-styles.e2e.cy.js).
	 *
	 * @param {string} [blockType] Block name, e.g. core/paragraph.
	 */
	async openGlobalStylesBlockStyleVariations(blockType = 'core/paragraph') {
		await openGlobalStylesPanel(this.page);
		await this.page.locator('[data-test="block-style-variations"]').click();
		const blockButtonId = `/blocks/${encodeURIComponent(blockType)}`;
		await this.page
			.locator(`button[id="${blockButtonId}"]`)
			.first()
			.click();
	}

	/**
	 * Creates a shared style variation in Global Styles (not block-level).
	 *
	 * @param {string} styleSlug Variation slug / id.
	 */
	async createGlobalStylesSharedStyleVariation(styleSlug) {
		await this.page
			.locator('[data-test="add-new-block-style-variation"]')
			.first()
			.click();

		const dialog = this.page
			.getByRole('dialog', { name: /Add new style variation/i })
			.last();
		await dialog
			.locator('[aria-label="Name"]')
			.locator('..')
			.locator('..')
			.locator('input')
			.fill(`E2E Shared ${styleSlug}`);
		await dialog
			.locator('[aria-label="ID"]')
			.locator('..')
			.locator('..')
			.locator('input')
			.fill(styleSlug);

		await this.page.locator('[data-test="add-style-button"]').click();
		await expect(
			this.page.getByRole('dialog', {
				name: /Add new style variation/i,
			})
		).toHaveCount(0, { timeout: 20000 });

		await this.page.waitForFunction(
			(slug) =>
				window.wp?.data
					?.select('blockera/editor')
					?.getSelectedBlockStyleVariation()?.name === slug,
			styleSlug,
			{ timeout: 20000 }
		);
	}

	/**
	 * Shares a Global Styles style variation with additional block types.
	 *
	 * @param {string}   styleSlug         Variation slug.
	 * @param {string[]} additionalBlocks  Block types to include.
	 */
	async shareGlobalStylesStyleVariationWithOtherBlocks(
		styleSlug,
		additionalBlocks = ['core/heading']
	) {
		await this.page
			.locator(`[data-test="open-${styleSlug}-block-card-contextmenu"]`)
			.filter({ visible: true })
			.first()
			.click({ force: true });

		const popover = this.page
			.locator('.variations-settings-popover')
			.filter({ visible: true })
			.last();
		await popover
			.getByRole('button', { name: 'Share with other blocks' })
			.click({ force: true });

		await expect(
			this.page
				.locator('[data-test="save-usage-for-multiple-blocks-button"]')
				.first()
		).toBeVisible({ timeout: 20000 });

		for (const blockType of additionalBlocks) {
			const blockToggle = this.page
				.locator(`[data-test="${blockType}"]`)
				.first();
			await blockToggle.scrollIntoViewIfNeeded();
			await blockToggle.click({ force: true });
		}

		await this.page
			.locator('[data-test="save-usage-for-multiple-blocks-button"]')
			.first()
			.click();
		await expect(
			this.page.locator(
				'[data-test="save-usage-for-multiple-blocks-button"]'
			)
		).toHaveCount(0, { timeout: 20000 });
	}

	/**
	 * Waits until a Global Styles shared style variation BG color is synced
	 * across block types (global styles entity, not block-level attributes).
	 *
	 * @param {string}   styleSlug   Variation slug.
	 * @param {string}   expectedHex Expected `#rrggbb` value.
	 * @param {string[]} blockTypes  Block types that must share the value.
	 */
	async expectGlobalStylesSharedStyleVariationBackgroundColor(
		styleSlug,
		expectedHex,
		blockTypes = ['core/paragraph', 'core/heading']
	) {
		await this.page.waitForFunction(
			({ slug, hex, blocks }) => {
				const data = window.wp?.data;
				if (!data) {
					return false;
				}

				const blockeraSelect = data.select('blockera/editor');
				const registered = blockeraSelect.getStyleVariationBlocks(slug);

				for (const blockType of blocks) {
					if (!registered.includes(blockType)) {
						return false;
					}

					const blockStyle = blockeraSelect.getBlockStyles(
						blockType,
						slug
					);
					if (blockStyle?.blockeraBackgroundColor?.value !== hex) {
						return false;
					}
				}

				const coreSelect = data.select('core');
				let gsId;
				if (
					typeof coreSelect.__experimentalGetCurrentGlobalStylesId ===
					'function'
				) {
					gsId = coreSelect.__experimentalGetCurrentGlobalStylesId();
				} else if (
					typeof coreSelect.getCurrentGlobalStylesId === 'function'
				) {
					gsId = coreSelect.getCurrentGlobalStylesId();
				}

				if (!gsId) {
					return false;
				}

				const edited = coreSelect.getEditedEntityRecord(
					'root',
					'globalStyles',
					gsId
				);

				for (const blockType of blocks) {
					const variation =
						edited?.styles?.blocks?.[blockType]?.variations?.[slug];
					if (variation?.blockeraBackgroundColor?.value !== hex) {
						return false;
					}
				}

				return true;
			},
			{ slug: styleSlug, hex: expectedHex, blocks: blockTypes },
			{ timeout: 30000 }
		);
	}

	/**
	 * Sets Global Styles shared style variation background color in the
	 * Global Styles inspector (not block-level BG Color).
	 *
	 * @param {string} value Hex color without leading `#`.
	 */
	async setGlobalStylesSharedStyleVariationBackgroundColor(value) {
		await setColorControlValue(this.page, 'BG Color', value);
	}

	/**
	 * Selects an existing Global Styles block style variation by slug.
	 *
	 * @param {string} styleSlug Variation slug (e.g. text-display).
	 */
	async selectGlobalStylesStyleVariation(styleSlug) {
		await this.page
			.locator(`[data-test="style-${styleSlug}"]`)
			.first()
			.click({ force: true });
	}

	/**
	 * Duplicates a Global Styles shared style variation via block card menu
	 * (see shared-style-variation.global-styles.e2e.cy.js duplicate test).
	 *
	 * @param {string} styleSlug Source variation slug to duplicate.
	 */
	async duplicateGlobalStylesSharedStyleVariation(styleSlug) {
		const contextMenu = this.page
			.locator(`[data-test="open-${styleSlug}-block-card-contextmenu"]`)
			.filter({ visible: true })
			.first();
		await contextMenu.scrollIntoViewIfNeeded();
		await contextMenu.click({ force: true });

		const popover = this.page
			.locator('.variations-settings-popover')
			.filter({ visible: true })
			.last();
		await popover
			.getByRole('button', { name: 'Duplicate' })
			.click({ force: true });

		const saveButton = this.page.locator(
			'[data-test="save-duplicate-button"]'
		);
		await expect(saveButton).toBeVisible({ timeout: 20000 });
		await expect(saveButton).toBeEnabled({ timeout: 20000 });
		await saveButton.click();
	}

	/**
	 * Waits until the newest duplicated Global Styles variation exists and
	 * copies background color + block registrations from the source variation.
	 *
	 * @param {string}   sourceSlug  Original variation slug (e.g. text-display).
	 * @param {string}   expectedHex Expected `#rrggbb` on the duplicate.
	 * @param {string[]} blockTypes  Block types the duplicate must register.
	 */
	async expectGlobalStylesSharedStyleVariationDuplicated(
		sourceSlug,
		expectedHex,
		blockTypes = ['core/paragraph', 'core/heading']
	) {
		await this.page.waitForFunction(
			({ source, hex, blocks }) => {
				const data = window.wp?.data;
				if (!data) {
					return false;
				}

				const coreSelect = data.select('core');

				let gsId;
				if (
					typeof coreSelect.__experimentalGetCurrentGlobalStylesId ===
					'function'
				) {
					gsId = coreSelect.__experimentalGetCurrentGlobalStylesId();
				} else if (
					typeof coreSelect.getCurrentGlobalStylesId === 'function'
				) {
					gsId = coreSelect.getCurrentGlobalStylesId();
				}

				if (!gsId) {
					return false;
				}

				const edited = coreSelect.getEditedEntityRecord(
					'root',
					'globalStyles',
					gsId
				);
				const paragraphVariations =
					edited?.styles?.blocks?.['core/paragraph']?.variations ??
					{};

				const blockeraSelect = data.select('blockera/editor');
				const origRegistered =
					blockeraSelect.getStyleVariationBlocks(source);
				for (const blockType of blocks) {
					if (!origRegistered.includes(blockType)) {
						return false;
					}
				}

				const copyKeys = Object.keys(paragraphVariations)
					.filter(
						(key) =>
							key !== source &&
							key.includes('copy') &&
							paragraphVariations[key] !== undefined &&
							paragraphVariations[key] !== null
					)
					.sort();
				const duplicateSlug = copyKeys[copyKeys.length - 1];

				if (typeof duplicateSlug !== 'string' || !duplicateSlug) {
					return false;
				}

				const copyRegistered =
					blockeraSelect.getStyleVariationBlocks(duplicateSlug);
				for (const blockType of blocks) {
					if (!copyRegistered.includes(blockType)) {
						return false;
					}
				}

				const paragraphCopyVariation =
					paragraphVariations[duplicateSlug];
				const headingCopyVariation =
					edited?.styles?.blocks?.['core/heading']?.variations?.[
						duplicateSlug
					];

				if (
					paragraphCopyVariation?.blockeraBackgroundColor?.value !==
					headingCopyVariation?.blockeraBackgroundColor?.value
				) {
					return false;
				}

				return (
					paragraphCopyVariation?.blockeraBackgroundColor?.value ===
					hex
				);
			},
			{ source: sourceSlug, hex: expectedHex, blocks: blockTypes },
			{ timeout: 30000 }
		);
	}

	/**
	 * Generates and loads 1000 paragraphs into the editor canvas.
	 */
	async load1000Paragraphs() {
		await this.page.waitForFunction(
			() => window?.wp?.blocks && window?.wp?.data
		);

		await this.page.evaluate(() => {
			const { createBlock } = window.wp.blocks;
			const { dispatch } = window.wp.data;
			const blocks = Array.from({ length: 1000 }).map(() =>
				createBlock('core/paragraph', { content: 'paragraph' })
			);
			dispatch('core/block-editor').resetBlocks(blocks);
		});
	}

	/**
	 * Locates paragraph blocks in the canvas (role first).
	 *
	 * @param {import('@playwright/test').Locator|import('@playwright/test').FrameLocator} canvas
	 * @return {import('@playwright/test').Locator} Paragraph block locators.
	 */
	paragraphs(canvas) {
		return canvas.getByRole('document', {
			name: /Block: Paragraph/i,
		});
	}

	/**
	 * Clears Blockera workspace tab localStorage so tab setup is deterministic.
	 */
	async resetWorkspaceTabsStorage() {
		await this.page.evaluate(() => {
			window.localStorage.removeItem('blockera-tabs-tabs');
			window.localStorage.removeItem('blockera-tabs-recently-closed');
			window.localStorage.removeItem(
				'blockera-tabs-recently-closed-persistence'
			);
		});
	}

	/**
	 * Opens a second draft post via the Blockera "Add tab" command palette.
	 */
	async addWorkspaceTabNewPost() {
		const addTab = this.page.locator(
			'[test-id="blockera-workspace-tabs-add"]'
		);
		await addTab.first().click({ force: true });

		const input = this.page.locator('.commands-command-menu [cmdk-input]');
		await input.waitFor({ state: 'visible', timeout: 20000 });
		await input.fill('');
		await input.type('Add new post', { delay: 40 });
		await this.page
			.locator('.commands-command-menu [cmdk-item]')
			.filter({ hasNot: this.page.locator('[aria-disabled="true"]') })
			.first()
			.waitFor({ state: 'visible', timeout: 20000 });
		await input.press('Enter');
	}
}

module.exports = {
	EditorPerfUtils,
	BLOCK_LEVEL_BACKGROUND_IMAGE_FIXTURE,
};
