/**
 * Minimal editor helpers for Blockera editor performance specs.
 *
 * Adapted from Gutenberg test/performance/fixtures/perf-utils.ts
 */

const path = require('node:path');
const { expect } = require('@wordpress/e2e-test-utils-playwright');
const {
	getParentContainer,
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
}

module.exports = {
	EditorPerfUtils,
	BLOCK_LEVEL_BACKGROUND_IMAGE_FIXTURE,
};
