/**
 * Minimal editor helpers for Blockera editor performance specs.
 *
 * Adapted from Gutenberg test/performance/fixtures/perf-utils.ts
 */

const { expect } = require('@wordpress/e2e-test-utils-playwright');

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

module.exports = { EditorPerfUtils };
