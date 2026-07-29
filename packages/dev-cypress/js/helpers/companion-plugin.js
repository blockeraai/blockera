/**
 * Cypress helpers for blockera-one companion plugin identity in the theme.
 */

import { goTo } from './site-navigation';
// eslint-disable-next-line import/no-unresolved
import { assertBlockData } from './editor';

import { FEATURE_WRAPPER_TEST_ID } from '../../../controls/js/libs/feature-wrapper/constants/testIds';
export { FEATURE_WRAPPER_TEST_ID };

export const COMPANION_INSTALL_NOTICE = 'Install Companion Plugin to Unlock';

export const COMPANION_INSTALL_MODAL_SELECTOR =
	'.blockera-component-feature-wrapper-companion-modal';

export const COMPANION_NOTICE_TEXT_SELECTOR =
	'.blockera-component-feature-wrapper__notice__text';

export const COMPANION_EDITOR_WRAPPER_SELECTOR =
	'[data-test="feature-wrapper-companion"]';

const DEFAULT_COMPANION_PLUGIN_CONFIG = {
	slug: 'blockera',
	plugin: 'blockera/blockera.php',
	name: 'Blockera Site Builder',
	status: 'not-installed',
	canInstall: true,
	canActivate: true,
};

/**
 * Assert the blockera.products.isCompanionPlugin filter value.
 *
 * @param {boolean} expected Expected filter result.
 */
export function assertCompanionPluginFilter(expected = false) {
	cy.window().should((win) => {
		expect(win.wp?.hooks?.applyFilters, 'wp.hooks.applyFilters').to.be.a(
			'function'
		);

		expect(
			win.wp.hooks.applyFilters(
				'blockera.products.isCompanionPlugin',
				false
			),
			'blockera.products.isCompanionPlugin'
		).to.equal(expected);
	});
}

/**
 * Assert blockera-one registered its companion plugin filter callback.
 */
export function assertBlockeraOneCompanionFilterRegistered() {
	cy.window().should((win) => {
		expect(
			win.wp.hooks.hasFilter(
				'blockera.products.isCompanionPlugin',
				'blockera-one/products.isCompanionPlugin'
			),
			'blockera-one/products.isCompanionPlugin filter'
		).to.equal(true);
	});
}

/**
 * Open the block editor styles panel for a new default paragraph block.
 */
export function openParagraphBlockStylesView() {
	cy.getBlock('default').type('Blockera One e2e', { delay: 0 });
	cy.getByAriaControls('styles-view').click();
}

const COMPANION_CLEAN_BLOCK_PROPS_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const COMPANION_CLEAN_BLOCK_CLASS =
	'blockera-block blockera-block-companion-clean';

/**
 * @param {Object} data wp.data store registry.
 * @return {string} Default block name from core/blocks.
 */
function getDefaultBlockNameFromStore(data) {
	const blocksSelect = data.select('core/blocks');

	return typeof blocksSelect?.getDefaultBlockName === 'function'
		? blocksSelect.getDefaultBlockName()
		: 'core/paragraph';
}

/**
 * @param {Object} data wp.data store registry.
 * @return {Object|undefined} Default paragraph block with Blockera ids already set.
 */
function findHydratedDefaultParagraphBlock(data) {
	const blockEditorSelect = data.select('core/block-editor');
	const defaultBlockName = getDefaultBlockNameFromStore(data);

	return blockEditorSelect
		.getBlocks()
		.find(
			(block) =>
				block.name === defaultBlockName &&
				block.attributes?.blockeraPropsId &&
				block.attributes?.className
		);
}

/**
 * Ensure a saved default paragraph block with Blockera bootstrap attrs exists.
 *
 * Fresh post-new canvases are empty and Blockera's inspector bootstraps
 * `blockeraPropsId` / `className` when the Styles tab opens (see block-base.js
 * `primePresetHover`), which marks the post dirty. Pre-hydrate + save via store
 * APIs so opening styles does not apply new customizations.
 *
 * @see source-code-block-editor/packages/e2e-test-utils-playwright/src/editor/select-blocks.ts
 * @see packages/editor/js/extensions/components/block-base.js
 */
export function ensureSavedHydratedDefaultParagraphBlock() {
	cy.window({ timeout: 20000 }).then((win) => {
		const data = win.wp.data;
		const blockEditorSelect = data.select('core/block-editor');
		const editorSelect = data.select('core/editor');

		expect(blockEditorSelect, 'core/block-editor store').to.not.equal(
			undefined
		);

		if (!findHydratedDefaultParagraphBlock(data)) {
			const block = win.wp.blocks.createBlock('core/paragraph', {
				blockeraPropsId: COMPANION_CLEAN_BLOCK_PROPS_ID,
				className: COMPANION_CLEAN_BLOCK_CLASS,
			});

			data.dispatch('core/block-editor').resetBlocks([block]);
		}

		if (editorSelect.isEditedPostDirty()) {
			const editorDispatch = data.dispatch('core/editor');

			if (!editorSelect.getEditedPostAttribute('title')) {
				editorDispatch.editPost({ title: 'Companion e2e clean' });
			}

			void editorDispatch.savePost();
		}
	});

	assertBlockData(
		(data) => {
			expect(
				data.select('core/editor').isEditedPostDirty(),
				'edited post dirty after save'
			).to.equal(false);
		},
		{ timeout: 60000 }
	);
}

/**
 * Select the first existing default block via the block editor store only.
 *
 * Uses `initialPosition: -1` so Gutenberg does not focus the content area.
 *
 * @see source-code-block-editor/packages/block-editor/src/store/actions.js selectBlock
 * @see source-code-block-editor/packages/e2e-test-utils-playwright/src/editor/select-blocks.ts
 */
export function selectDefaultParagraphBlockInEditor() {
	assertBlockData((data) => {
		const blockEditorSelect = data.select('core/block-editor');
		const paragraphBlock =
			findHydratedDefaultParagraphBlock(data) ||
			blockEditorSelect
				.getBlocks()
				.find(
					(block) => block.name === getDefaultBlockNameFromStore(data)
				) ||
			blockEditorSelect
				.getBlocks()
				.find((block) => block.name === 'core/paragraph');

		expect(paragraphBlock, 'default paragraph block').to.not.equal(
			undefined
		);

		data.dispatch('core/block-editor').selectBlock(
			paragraphBlock.clientId,
			-1
		);

		expect(
			blockEditorSelect.getSelectedBlock()?.clientId,
			'selected block client id'
		).to.equal(paragraphBlock.clientId);
	});
}

/**
 * Open the Blockera styles tab only when it is not already expanded.
 */
export function ensureBlockeraStylesViewOpen() {
	cy.getByAriaControls('styles-view', { timeout: 20000 }).then(($btn) => {
		if ($btn.attr('aria-expanded') !== 'true') {
			cy.wrap($btn).click();
		}
	});
}

/**
 * Open the block editor styles panel without modifying block content.
 *
 * Seeds a saved, Blockera-hydrated default block, selects it via store APIs
 * (no canvas clicks / typing), and opens Styles without enabling save/publish.
 *
 * Use this when post-install behavior depends on a clean editor state.
 */
export function openCleanParagraphBlockStylesView() {
	ensureSavedHydratedDefaultParagraphBlock();
	selectDefaultParagraphBlockInEditor();
	ensureBlockeraStylesViewOpen();
	assertEditorHasNoUnsavedChanges();
}

/**
 * Assert the current editor post has no unsaved changes.
 */
export function assertEditorHasNoUnsavedChanges() {
	assertBlockData((data) => {
		const editor = data.select('core/editor');
		expect(editor.isEditedPostDirty(), 'edited post dirty').to.equal(false);
	});
}

/**
 * Scroll the Background → Clipping control into view in the styles panel.
 */
export function openBackgroundClippingSection() {
	cy.getParentContainer('Clipping').scrollIntoView({
		offset: { top: -300 },
		duration: 0,
	});
}

/**
 * Open the Block Manager tab on Blockera settings.
 */
export function openBlockManagerSettingsPanel() {
	goTo('/wp-admin/admin.php?page=blockera-settings-block-manager');
	cy.get('.blockera-settings-active-panel').should('be.visible');
}

/**
 * Locate the companion FeatureWrapper for a block manager category section.
 *
 * @param {string} categorySlug Block category slug (e.g. text, media).
 */
export function getBlockManagerCategoryCompanionWrapper(categorySlug) {
	return cy
		.getByDataTest(`${categorySlug}-category=disable`)
		.parents('[data-test="feature-wrapper-companion"]')
		.first();
}

/**
 * Assert the companion install notice is visible within the current subject.
 */
export function assertCompanionInstallNoticeVisible() {
	cy.get(COMPANION_NOTICE_TEXT_SELECTOR)
		.should('be.visible')
		.and('contain.text', COMPANION_INSTALL_NOTICE);
}

/**
 * Click the companion install notice within the current subject.
 */
export function clickCompanionInstallNotice() {
	cy.get(COMPANION_NOTICE_TEXT_SELECTOR).click();
}

/**
 * Assert the companion install modal is open.
 */
export function assertCompanionInstallModalVisible() {
	cy.get(COMPANION_INSTALL_MODAL_SELECTOR)
		.should('be.visible')
		.and('contain.text', 'Blockera Site Builder');
}

/**
 * Close the companion install modal from the default install view.
 */
export function closeCompanionInstallModal() {
	cy.get(COMPANION_INSTALL_MODAL_SELECTOR)
		.find('button[aria-label="Close"]')
		.click();

	cy.get(COMPANION_INSTALL_MODAL_SELECTOR).should('not.exist');
}

/**
 * Locate the companion FeatureWrapper on the editor Background → Clipping control.
 */
export function getClippingCompanionWrapper() {
	return cy
		.getParentContainer('Clipping')
		.parents(COMPANION_EDITOR_WRAPPER_SELECTOR)
		.first();
}

/**
 * Prepare a clean editor session for companion countdown reload tests.
 */
export function prepareCleanEditorForCompanionInstall() {
	openCleanParagraphBlockStylesView();
}

/**
 * Prepare a dirty editor session for companion confirm reload tests.
 *
 * @param {string} [text=' unsaved companion e2e'] Text appended to the default block.
 */
export function prepareDirtyEditorForCompanionInstall(
	text = ' unsaved companion e2e'
) {
	openCleanParagraphBlockStylesView();
	makeEditorPostDirty(text);
}

/**
 * Open clipping gate and complete install until the expected post-install view.
 *
 * @param {'countdown'|'confirm'} expectedView Expected post-install view.
 */
export function completeCompanionInstallFromClippingGate(
	expectedView = 'countdown'
) {
	openCompanionInstallModalFromClippingGate();
	completeCompanionPluginInstall(expectedView);
}

/**
 * Assert the companion install modal is closed.
 */
export function assertCompanionInstallModalClosed() {
	cy.get(COMPANION_INSTALL_MODAL_SELECTOR).should('not.exist');
}

/**
 * Assert the stubbed companion page reload was called once.
 */
export function assertCompanionPageReloadCalled() {
	cy.window().then((win) => {
		expect(
			win.__blockeraCompanionReloadCalls,
			'companion reload calls'
		).to.equal(1);
	});
}

/**
 * Assert the stubbed companion page reload was not called.
 */
export function assertCompanionPageReloadNotCalled() {
	cy.window().then((win) => {
		expect(
			win.__blockeraCompanionReloadCalls || 0,
			'companion reload calls'
		).to.equal(0);
	});
}

/**
 * Assert companion install error message is visible.
 *
 * @param {string} message Expected error message.
 */
export function assertCompanionInstallErrorVisible(message) {
	cy.getByDataTest(FEATURE_WRAPPER_TEST_ID.companionInstallError, {
		timeout: 10000,
	})
		.should('be.visible')
		.and('contain.text', message);
}

/**
 * Click a companion install modal action by test id.
 *
 * @param {string} testId Companion modal button test id.
 */
export function clickCompanionModalAction(testId) {
	cy.getByTestId(testId).click();
}

/**
 * Open the companion install modal from the editor clipping gate only.
 */
export function openCompanionInstallModalFromClippingGate() {
	openBackgroundClippingSection();

	getClippingCompanionWrapper().within(() => {
		clickCompanionInstallNotice();
	});

	assertCompanionInstallModalVisible();
}

/**
 * Open the companion install modal from the editor background clipping gate.
 */
export function openCompanionInstallModalInEditor() {
	openParagraphBlockStylesView();
	openCompanionInstallModalFromClippingGate();
}

/**
 * Open the companion install modal with a clean editor (no unsaved changes).
 */
export function openCompanionInstallModalInCleanEditor() {
	openCleanParagraphBlockStylesView();
	openCompanionInstallModalFromClippingGate();
}

/**
 * Override companion plugin config exposed to the install modal.
 *
 * @param {Object} overrides Partial config overrides.
 */
export function setCompanionPluginConfig(overrides = {}) {
	cy.window().then((win) => {
		win.blockeraCompanionPlugin = {
			...DEFAULT_COMPANION_PLUGIN_CONFIG,
			...overrides,
		};
	});
}

/**
 * Stub wp.updates install/activate handlers for companion plugin e2e flows.
 *
 * @param {Object}  options
 * @param {number}  [options.installDelay=0]
 * @param {number}  [options.activateDelay=0]
 * @param {Object|null} [options.installError=null]
 * @param {Object|null} [options.activateError=null]
 */
export function stubCompanionPluginWpUpdates({
	installDelay = 0,
	activateDelay = 0,
	installError = null,
	activateError = null,
} = {}) {
	cy.window().then((win) => {
		win.wp = win.wp || {};
		win.wp.updates = win.wp.updates || {};

		win.wp.updates.installPlugin = (args = {}) => {
			const run = () => {
				if (installError) {
					args.error?.(installError);
					return;
				}

				args.success?.({
					slug: 'blockera',
					pluginName: 'Blockera Site Builder',
					activateUrl: '#',
				});
			};

			if (installDelay > 0) {
				win.setTimeout(run, installDelay);
			} else {
				run();
			}

			return { abort: () => {} };
		};

		win.wp.updates.activatePlugin = (args = {}) => {
			const run = () => {
				if (activateError) {
					args.error?.(activateError);
					return;
				}

				args.success?.({
					slug: 'blockera',
					plugin: 'blockera/blockera.php',
					pluginName: 'Blockera Site Builder',
				});
			};

			if (activateDelay > 0) {
				win.setTimeout(run, activateDelay);
			} else {
				run();
			}

			return { abort: () => {} };
		};
	});
}

/**
 * Stub page reload for post-install reload assertions.
 *
 * Electron/Cypress cannot stub `window.location.reload`, so the modal checks
 * `window.__blockeraCompanionTestReload` when present (e2e only).
 */
export function stubCompanionPageReload() {
	cy.window({ log: false }).then((win) => {
		win.__blockeraCompanionReloadCalls = 0;
		win.__blockeraCompanionTestReload = () => {
			win.__blockeraCompanionReloadCalls += 1;
		};
		delete win.__blockeraCompanionTestCountdownSeconds;
	});
}

/**
 * Shorten the post-install reload countdown for e2e timing.
 *
 * @param {number} seconds Countdown duration in seconds.
 */
export function setCompanionReloadCountdownSeconds(seconds) {
	cy.window({ log: false }).then((win) => {
		win.__blockeraCompanionTestCountdownSeconds = seconds;
	});
}

/**
 * Run callback within the visible companion install modal root.
 *
 * @param {Function} callback Cypress chain callback.
 */
export function withinCompanionInstallModal(callback) {
	cy.get(COMPANION_INSTALL_MODAL_SELECTOR)
		.should('be.visible')
		.within(callback);
}

/**
 * Click the companion install/activate button in the modal.
 */
export function clickCompanionInstallButton() {
	cy.getByTestId(FEATURE_WRAPPER_TEST_ID.companionInstall).click();
}

/**
 * Assert install progress UI is visible.
 */
export function assertCompanionInstallProgressVisible() {
	cy.getByDataTest(FEATURE_WRAPPER_TEST_ID.companionInstallProgress).should(
		'be.visible'
	);
	cy.getByDataTest(FEATURE_WRAPPER_TEST_ID.companionInstallProgress).within(
		() => {
			cy.get('[role="progressbar"]').should('be.visible');
		}
	);
}

/**
 * Assert post-install countdown reload UI is visible.
 *
 * @param {number} [seconds=10] Expected countdown value.
 */
export function assertCompanionReloadCountdownVisible(seconds = 10) {
	cy.getByDataTest(FEATURE_WRAPPER_TEST_ID.companionReloadCountdown)
		.should('be.visible')
		.and('contain.text', String(seconds));

	withinCompanionInstallModal(() => {
		cy.contains('Blockera Site Builder was installed successfully.').should(
			'be.visible'
		);
		cy.contains(
			`Reloading in ${seconds} seconds to unlock all features…`
		).should('be.visible');
	});
}

/**
 * Assert post-install unsaved-changes confirm view is visible.
 */
export function assertCompanionReloadConfirmVisible() {
	cy.contains('Reload editor to unlock features?').should('be.visible');
	cy.contains('you have unsaved editor changes').should('be.visible');
	cy.getByTestId(FEATURE_WRAPPER_TEST_ID.companionReloadCancel).should(
		'be.visible'
	);
	cy.getByTestId(FEATURE_WRAPPER_TEST_ID.companionReloadDiscard).should(
		'be.visible'
	);
	cy.getByTestId(FEATURE_WRAPPER_TEST_ID.companionReloadSave).should(
		'be.visible'
	);
}

/**
 * Complete install flow until post-install UI is shown.
 *
 * @param {'countdown'|'confirm'} expectedView Expected post-install view.
 */
export function completeCompanionPluginInstall(expectedView = 'countdown') {
	if ('confirm' === expectedView) {
		// Apply unsaved edits immediately before install so autosave cannot
		// persist them while the modal progress UI is shown.
		makeEditorPostDirty();
	}

	clickCompanionInstallButton();
	assertCompanionInstallProgressVisible();
	waitForCompanionInstallToFinish();

	if ('confirm' === expectedView) {
		assertCompanionReloadConfirmVisible();
		return;
	}

	assertCompanionReloadCountdownVisible();
}

/**
 * Make the current editor post dirty without saving.
 *
 * Uses block editor store APIs so the post stays dirty even when a modal
 * overlay blocks canvas interactions.
 *
 * @param {string} text Text appended to the default block.
 */
export function makeEditorPostDirty(text = ' unsaved companion e2e') {
	cy.window().then((win) => {
		const data = win.wp.data;
		const blockEditorSelect = data.select('core/block-editor');
		const paragraphBlock =
			findHydratedDefaultParagraphBlock(data) ||
			blockEditorSelect
				.getBlocks()
				.find(
					(block) => block.name === getDefaultBlockNameFromStore(data)
				) ||
			blockEditorSelect
				.getBlocks()
				.find((block) => block.name === 'core/paragraph');

		expect(paragraphBlock, 'default paragraph block').to.not.equal(
			undefined
		);

		data.dispatch('core/block-editor').updateBlockAttributes(
			paragraphBlock.clientId,
			{
				content: `${paragraphBlock.attributes.content || ''}${text}`,
			}
		);
	});

	assertBlockData((data) => {
		const editor = data.select('core/editor');
		expect(editor.isEditedPostDirty(), 'edited post dirty').to.equal(true);
	});
}

/**
 * Wait until companion install finishes (progress hidden).
 */
export function waitForCompanionInstallToFinish() {
	cy.getByDataTest(FEATURE_WRAPPER_TEST_ID.companionInstallProgress, {
		timeout: 20000,
	}).should('not.exist');
}
