/**
 * WordPress core block editor helpers for performance specs.
 *
 * UI patterns adapted from Gutenberg e2e tests (buttons.spec.js,
 * user-global-styles-revisions.spec.js, block-style-variations.spec.js).
 */

const path = require('node:path');
const { expect } = require('@wordpress/e2e-test-utils-playwright');

const BACKGROUND_IMAGE_FIXTURE = path.join(
	process.cwd(),
	'packages/dev-cypress/js/fixtures/bg-extension-test.png'
);

const CORE_GS_PARAGRAPH_VARIATION = {
	slug: 'text-display',
	label: 'Display',
};

const CORE_GS_GROUP_VARIATION = {
	slug: 'section-1',
	label: 'Style 1',
};

class CoreEditorPerfUtils {
	/**
	 * @param {{ page: import('@playwright/test').Page, editor?: import('@wordpress/e2e-test-utils-playwright').Editor }} args
	 */
	constructor({ page, editor }) {
		this.page = page;
		this.editor = editor;
	}

	get editorSettings() {
		return this.page.getByRole('region', { name: 'Editor settings' });
	}

	/**
	 * Opens the post editor block settings sidebar when needed.
	 */
	async openDocumentSettingsSidebar() {
		if (this.editor?.openDocumentSettingsSidebar) {
			await this.editor.openDocumentSettingsSidebar();
			return;
		}

		const settingsToggle = this.page.getByRole('button', {
			name: 'Settings',
			exact: true,
		});
		if (await settingsToggle.isVisible().catch(() => false)) {
			await settingsToggle.click();
		}
	}

	/**
	 * Inserts and selects a core/group block for background image scenarios.
	 */
	async insertGroupBlock() {
		await this.page.waitForFunction(
			() => window?.wp?.blocks && window?.wp?.data
		);

		await this.page.evaluate(() => {
			const { createBlock } = window.wp.blocks;
			const { dispatch } = window.wp.data;
			const block = createBlock('core/group', {}, [
				createBlock('core/paragraph', {
					content: 'This is test paragraph',
				}),
			]);
			dispatch('core/block-editor').resetBlocks([block]);
			dispatch('core/block-editor').selectBlock(block.clientId);
		});
	}

	/**
	 * Sets block-level background color via core Color → Background controls.
	 *
	 * @param {string} hexWithoutHash Hex color without `#`.
	 */
	async setBlockBackgroundColor(hexWithoutHash) {
		await this.openDocumentSettingsSidebar();
		await this.editorSettings
			.getByRole('button', { name: 'Background', exact: true })
			.click();
		await this.page
			.getByRole('button', { name: 'Custom color picker' })
			.click();
		await this.page
			.getByRole('textbox', { name: 'Hex color' })
			.fill(hexWithoutHash);
	}

	/**
	 * Opens core Global Styles from the site editor top bar.
	 */
	async openGlobalStylesPanel() {
		await this.page
			.getByRole('region', { name: 'Editor top bar' })
			.getByRole('button', { name: 'Styles' })
			.click();
	}

	/**
	 * Navigates Global Styles → Blocks → block type screen.
	 *
	 * @param {'Paragraph'|'Group'} blockLabel Visible block title in the list.
	 */
	async openGlobalStylesBlock(blockLabel) {
		await this.openGlobalStylesPanel();
		await this.page.getByRole('button', { name: 'Blocks' }).click();
		await this.page
			.getByRole('button', { name: blockLabel, exact: true })
			.click();
	}

	/**
	 * Opens a registered block style variation inside Global Styles.
	 *
	 * @param {string} variationLabel Human-readable variation label.
	 */
	async selectGlobalStylesVariation(variationLabel) {
		await this.page
			.getByRole('button', { name: variationLabel, exact: true })
			.click();
	}

	/**
	 * Resets Global Styles entity edits (core store only).
	 */
	async resetGlobalStylesEntityRecord() {
		await this.page.waitForFunction(() => window?.wp?.data);

		await this.page.evaluate(() => {
			const registry = window.wp?.data;
			const store = window.wp?.coreData?.store;

			if (!registry || !store) {
				throw new Error(
					'wp.data / wp.coreData.store is not available; open the Site Editor first.'
				);
			}

			const select = registry.select(store);
			const dispatch = registry.dispatch(store);

			let recordId;
			if (
				typeof select.__experimentalGetCurrentGlobalStylesId ===
				'function'
			) {
				recordId = select.__experimentalGetCurrentGlobalStylesId();
			} else if (typeof select.getCurrentGlobalStylesId === 'function') {
				recordId = select.getCurrentGlobalStylesId();
			}

			if (
				recordId === undefined ||
				recordId === null ||
				recordId === ''
			) {
				throw new Error(
					'No global styles entity id: open the Site Editor and wait until global styles resolve.'
				);
			}

			dispatch.editEntityRecord('root', 'globalStyles', recordId, {
				styles: {},
				settings: {},
			});
		});
	}

	/**
	 * Opens Paragraph default styles in Global Styles (no variation card).
	 */
	async setupGlobalStylesDefaultParagraphStyles() {
		await this.resetGlobalStylesEntityRecord();
		await this.openGlobalStylesBlock('Paragraph');
	}

	/**
	 * Sets Global Styles background color via core Color → Background controls.
	 *
	 * @param {string} hexWithoutHash Hex color without `#`.
	 */
	async setGlobalStylesBackgroundColor(hexWithoutHash) {
		await this.page
			.getByRole('button', { name: 'Background', exact: true })
			.click();
		await this.page
			.getByRole('button', { name: 'Custom color picker' })
			.click();
		await this.page
			.getByRole('textbox', { name: 'Hex color' })
			.fill(hexWithoutHash);
	}

	/**
	 * Sets Global Styles background color from a theme preset swatch.
	 *
	 * @param {string} presetLabel Theme palette label (e.g. Accent 4).
	 */
	async setGlobalStylesBackgroundPreset(presetLabel) {
		await this.page
			.getByRole('button', { name: 'Background', exact: true })
			.click();
		await this.page
			.getByRole('option', { name: presetLabel })
			.click({ force: true });
	}

	/**
	 * Uploads a background image through core Background image / Image controls.
	 *
	 * @param {string} [filePath] Absolute path to the upload fixture.
	 */
	async setupBackgroundImage(filePath = BACKGROUND_IMAGE_FIXTURE) {
		await this.uploadBackgroundImage(filePath);
	}

	/**
	 * Uploads a background image in the block inspector Background image panel.
	 *
	 * @param {string} filePath Absolute path to the upload fixture.
	 */
	async setupBlockBackgroundImage(filePath = BACKGROUND_IMAGE_FIXTURE) {
		await this.openDocumentSettingsSidebar();
		await this.uploadBackgroundImage(filePath, this.editorSettings);
	}

	/**
	 * Uploads a background image in the Global Styles Background panel.
	 *
	 * @param {string} filePath Absolute path to the upload fixture.
	 */
	async setupGlobalStylesBackgroundImage(
		filePath = BACKGROUND_IMAGE_FIXTURE
	) {
		await this.uploadBackgroundImage(filePath);
	}

	/**
	 * @param {string} filePath
	 * @param {import('@playwright/test').Locator} [scope]
	 */
	async uploadBackgroundImage(filePath, scope = this.page) {
		const imageButton = scope
			.getByRole('button', { name: 'Image' })
			.first();
		if (await imageButton.isVisible().catch(() => false)) {
			await imageButton.click();
		} else {
			const openLibrary = scope.getByRole('button', {
				name: /Open Media Library|Select/i,
			});
			if (
				await openLibrary
					.first()
					.isVisible()
					.catch(() => false)
			) {
				await openLibrary.first().click();
			}
		}

		await this.page.locator('#menu-item-upload').click();
		await this.page.locator('input[type="file"]').setInputFiles(filePath);
		await this.page.locator('.media-toolbar-primary > .button').click();
	}

	/**
	 * Sets background image size via core Cover / Contain toggle group.
	 *
	 * @param {'contain'|'cover'} sizeValue Background size preset.
	 */
	async setBackgroundImageSize(sizeValue) {
		const sizeLabel = sizeValue === 'cover' ? 'Cover' : 'Contain';

		await this.page
			.getByRole('button', {
				name: 'Background size, position and repeat options.',
			})
			.click();
		await this.page
			.getByRole('button', { name: sizeLabel, exact: true })
			.click();
	}

	/**
	 * Waits until the selected block has the expected background color in store.
	 *
	 * @param {string} expectedHex Expected `#rrggbb` value.
	 */
	async expectSelectedBlockBackgroundColor(expectedHex) {
		await this.page.waitForFunction(
			(hex) => {
				const select = window.wp?.data?.select('core/block-editor');
				const clientId = select?.getSelectedBlockClientId?.();
				if (!clientId) {
					return false;
				}

				const attributes = select.getBlockAttributes(clientId);
				const background =
					attributes?.style?.color?.background ||
					attributes?.backgroundColor;

				if (typeof background !== 'string') {
					return false;
				}

				if (background.startsWith('#')) {
					return background.toLowerCase() === hex.toLowerCase();
				}

				return false;
			},
			expectedHex,
			{ timeout: 30000 }
		);
	}

	/**
	 * Waits until Global Styles default block styles store the expected background.
	 *
	 * @param {string} blockType Block name.
	 * @param {string} expectedHex Expected `#rrggbb` or preset ref.
	 */
	async expectGlobalStylesBlockBackgroundColor(blockType, expectedHex) {
		await this.page.waitForFunction(
			({ blockName, hex }) => {
				const coreSelect = window.wp?.data?.select('core');
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
				const background =
					edited?.styles?.blocks?.[blockName]?.color?.background;

				return background === hex;
			},
			{ blockName: blockType, hex: expectedHex },
			{ timeout: 30000 }
		);
	}

	/**
	 * Waits until a Global Styles block style variation stores the expected background.
	 *
	 * @param {string} blockType Block name.
	 * @param {string} variationSlug Variation slug.
	 * @param {string} expectedHex Expected `#rrggbb` value.
	 */
	async expectGlobalStylesVariationBackgroundColor(
		blockType,
		variationSlug,
		expectedHex
	) {
		await this.page.waitForFunction(
			({ blockName, slug, hex }) => {
				const coreSelect = window.wp?.data?.select('core');
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
				const background =
					edited?.styles?.blocks?.[blockName]?.variations?.[slug]
						?.color?.background;

				return background === hex;
			},
			{ blockName: blockType, slug: variationSlug, hex: expectedHex },
			{ timeout: 30000 }
		);
	}

	/**
	 * Waits until Global Styles block styles store the expected preset background.
	 *
	 * @param {string} blockType Block name.
	 * @param {string} presetSlug Theme color slug (e.g. accent-4).
	 * @param {string|null} [variationSlug] Optional variation slug.
	 */
	async expectGlobalStylesBackgroundPreset(
		blockType,
		presetSlug,
		variationSlug = null
	) {
		const expected = `var:preset|color|${presetSlug}`;

		await this.page.waitForFunction(
			({ blockName, slug, value }) => {
				const coreSelect = window.wp?.data?.select('core');
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
				const styles = edited?.styles?.blocks?.[blockName];
				const background = slug
					? styles?.variations?.[slug]?.color?.background
					: styles?.color?.background;

				return background === value;
			},
			{
				blockName: blockType,
				slug: variationSlug,
				value: expected,
			},
			{ timeout: 30000 }
		);
	}

	/**
	 * Waits until Global Styles stores the expected background image size.
	 *
	 * @param {string} blockType Block name.
	 * @param {string} expectedSize Expected size preset.
	 * @param {string|null} [variationSlug] Optional variation slug.
	 */
	async expectGlobalStylesBackgroundImageSize(
		blockType,
		expectedSize,
		variationSlug = null
	) {
		await this.page.waitForFunction(
			({ blockName, slug, size }) => {
				const coreSelect = window.wp?.data?.select('core');
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
				const styles = edited?.styles?.blocks?.[blockName];
				const backgroundStyles = slug
					? styles?.variations?.[slug]
					: styles;
				const imageSize = backgroundStyles?.background?.backgroundSize;

				return imageSize === size;
			},
			{
				blockName: blockType,
				slug: variationSlug,
				size: expectedSize,
			},
			{ timeout: 30000 }
		);
	}

	/**
	 * Waits until the selected block stores the expected background image size.
	 *
	 * @param {'contain'|'cover'} expectedSize Expected size preset.
	 */
	async expectSelectedBlockBackgroundImageSize(expectedSize) {
		await this.page.waitForFunction(
			(size) => {
				const select = window.wp?.data?.select('core/block-editor');
				const clientId = select?.getSelectedBlockClientId?.();
				if (!clientId) {
					return false;
				}

				const attributes = select.getBlockAttributes(clientId);
				return attributes?.style?.background?.backgroundSize === size;
			},
			expectedSize,
			{ timeout: 30000 }
		);
	}

	/**
	 * Persists dirty global styles entity records (core baseline, no Blockera compatibility).
	 */
	async saveGlobalStylesEntity() {
		await this.page.evaluate(() => {
			const select = window.wp.data.select('core');
			const getDirty = select.__experimentalGetDirtyEntityRecords;

			if (typeof getDirty !== 'function') {
				throw new Error(
					'wp.data.select("core").__experimentalGetDirtyEntityRecords is not available'
				);
			}

			const dirtyRecords = getDirty() || [];
			const entitiesToSave = dirtyRecords.filter(
				(record) => !(record.kind === 'root' && record.name === 'site')
			);

			if (!entitiesToSave.length) {
				return null;
			}

			const dispatch = window.wp.data.dispatch('core');

			return Promise.all(
				entitiesToSave.map((record) =>
					dispatch.saveEditedEntityRecord(
						record.kind,
						record.name,
						record.key
					)
				)
			);
		});

		await this.page.waitForFunction(
			() => {
				const dirtyRecords =
					window.wp?.data
						?.select('core')
						?.__experimentalGetDirtyEntityRecords?.() || [];

				return !dirtyRecords.filter(
					(record) =>
						!(record.kind === 'root' && record.name === 'site')
				).length;
			},
			undefined,
			{ timeout: 20000 }
		);
	}

	/**
	 * Waits until global styles entity edits are dirty (before save).
	 */
	async waitForGlobalStylesEntityDirty() {
		await this.page.waitForFunction(
			() => {
				const dirtyRecords =
					window.wp?.data
						?.select('core')
						?.__experimentalGetDirtyEntityRecords?.() || [];

				return dirtyRecords.some(
					(record) =>
						record.kind === 'root' && record.name === 'globalStyles'
				);
			},
			undefined,
			{ timeout: 20000 }
		);
	}

	/**
	 * Global Styles → Colors → Edit palette (core custom color preset screen).
	 */
	async openGlobalStylesColorPaletteScreen() {
		await this.resetGlobalStylesEntityRecord();
		await this.openGlobalStylesPanel();
		await this.page.getByRole('button', { name: 'Colors' }).click();
		await this.page.getByRole('button', { name: 'Edit palette' }).click();

		await expect(
			this.page.locator('.global-styles-ui-color-palette-panel')
		).toBeVisible({ timeout: 20000 });
	}

	/**
	 * Seeds a custom color in the core Global Styles palette (closest native analog
	 * to Blockera border preset seeding — both add a custom design token preset).
	 *
	 * @param {{ presetName: string, hexWithoutHash: string }} options
	 */
	async seedGlobalStylesCustomColorPreset({ presetName, hexWithoutHash }) {
		await this.openGlobalStylesColorPaletteScreen();

		await this.page
			.getByRole('button', { name: 'Add color' })
			.last()
			.click();

		const nameInput = this.page
			.getByRole('textbox', { name: 'Color name' })
			.last();

		await nameInput.click();
		await this.page.keyboard.press('ControlOrMeta+A');
		await nameInput.pressSequentially(presetName, { delay: 0 });

		await this.page
			.getByRole('button', { name: /^Edit:/i })
			.last()
			.click();

		const hexInput = this.page.getByRole('textbox', { name: 'Hex color' });
		await hexInput.waitFor({ state: 'visible', timeout: 20000 });
		await hexInput.click();
		await this.page.keyboard.press('ControlOrMeta+A');
		await hexInput.pressSequentially(hexWithoutHash, { delay: 0 });

		await this.page.keyboard.press('Escape');
		await this.waitForGlobalStylesCustomColorPresetInStore({
			presetName,
			expectedHex: `#${hexWithoutHash}`,
		});
		try {
			await this.waitForGlobalStylesEntityDirty();
		} catch {
			// PaletteEdit may persist synchronously before dirty resolution updates.
		}
		await this.saveGlobalStylesEntity();
	}

	/**
	 * Waits until a custom color preset exists in edited global styles settings.
	 *
	 * @param {{ presetName: string, expectedHex: string }} options
	 */
	async waitForGlobalStylesCustomColorPresetInStore({
		presetName,
		expectedHex,
	}) {
		await this.page.waitForFunction(
			({ name, hex }) => {
				const normalizeHex = (value) => {
					if (typeof value !== 'string') {
						return '';
					}

					const lower = value.toLowerCase();

					if (lower.startsWith('#') && lower.length >= 7) {
						return lower.slice(0, 7);
					}

					return lower;
				};

				const select = window.wp?.data?.select('core');
				let gsId;

				if (
					typeof select?.__experimentalGetCurrentGlobalStylesId ===
					'function'
				) {
					gsId = select.__experimentalGetCurrentGlobalStylesId();
				} else if (
					typeof select?.getCurrentGlobalStylesId === 'function'
				) {
					gsId = select.getCurrentGlobalStylesId();
				}

				if (!gsId) {
					return false;
				}

				const customs = select.getEditedEntityRecord(
					'root',
					'globalStyles',
					gsId
				)?.settings?.color?.palette?.custom;

				if (!Array.isArray(customs)) {
					return false;
				}

				const targetHex = normalizeHex(hex);

				return customs.some(
					(preset) =>
						preset?.name === name &&
						normalizeHex(preset?.color) === targetHex
				);
			},
			{ name: presetName, hex: expectedHex },
			{ timeout: 30000 }
		);
	}

	/**
	 * Waits until a custom color preset exists in the global styles entity.
	 *
	 * @param {{ presetName: string, expectedHex: string }} options
	 */
	async expectGlobalStylesCustomColorPresetSeeded({
		presetName,
		expectedHex,
	}) {
		await this.waitForGlobalStylesCustomColorPresetInStore({
			presetName,
			expectedHex,
		});
	}

	/**
	 * Asserts uploaded background image is visible on a canvas block wrapper.
	 *
	 * @param {import('@playwright/test').Locator} blockLocator Canvas block locator.
	 */
	async expectCanvasBackgroundImage(blockLocator) {
		await expect(blockLocator).toHaveCSS(
			'background-image',
			/bg-extension-test|blob:|url\(/,
			{ timeout: 60000 }
		);
	}
}

module.exports = {
	CoreEditorPerfUtils,
	CORE_GS_PARAGRAPH_VARIATION,
	CORE_GS_GROUP_VARIATION,
	BACKGROUND_IMAGE_FIXTURE,
};
