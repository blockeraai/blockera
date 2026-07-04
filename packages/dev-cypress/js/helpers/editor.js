/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';

function getIframeDocument(containerClass) {
	return cy
		.get(containerClass + ' iframe')
		.its('0.contentDocument')
		.should('exist');
}

export function getIframeBody(containerClass) {
	return (
		getIframeDocument(containerClass)
			.its('body')
			.should('not.be.undefined')
			// wraps "body" DOM element to allow
			// chaining more Cypress commands, like ".find(...)"
			.then(cy.wrap)
	);
}

/**
 * Safely obtain the window object or error
 * when the window object is not available.
 */
export function getWindowProperty(path) {
	return cy
		.window()
		.its(path)
		.then((data) => {
			return data;
		});
}

/**
 * Safely obtain the window object or error
 * when the window object is not available.
 */
export function getWPDataObject() {
	cy.waitForAssertValue();

	return cy
		.window()
		.its('wp.data')
		.then((data) => {
			return data;
		});
}

/**
 * Get block type registered object.
 *
 * @param {Object} data the WordPress data.
 * @param {string} blockType the block type name.
 *
 * @return {*} retrieved the block type.
 */
export function getBlockType(data, blockType) {
	return data.select('core/blocks').getBlockType(blockType);
}

/**
 *
 * @param {Object} data the WordPress data.
 * @param {string} field the field of attributes of selectedBlock.
 * @return {*} retrieved th field value of selected block attributes.
 */
export function getSelectedBlock(data, field = '') {
	const selectedBlock = data.select('core/block-editor').getSelectedBlock();

	if (!field) {
		return selectedBlock;
	}

	if (undefined !== selectedBlock.attributes[field]?.value) {
		return selectedBlock.attributes[field].value;
	}

	return selectedBlock.attributes[field];
}

/**
 * Get the style of the selected block.
 *
 * @param {Object} data the WordPress data.
 * @param {string} name the name of the block.
 * @param {string} variation the variation of the block. Default is 'default'.
 *
 * @return {*} retrieved the style of the selected block.
 */
export function getSelectedBlockStyle(data, name, variation = 'default') {
	const { getBlockStyles } = data.select('blockera/editor');

	return getBlockStyles(name, variation);
}

/**
 * Get the WordPress globalStyles entity record.
 *
 * For `styles`, the default `merged` mode layers Blockera's merged theme + user
 * styles when available, otherwise merges WordPress theme base global styles
 * (parity with Playwright / registration.js).
 *
 * @param {*} data the @wordpress/data package object.
 * @param {*} prop the property of record. like style, settings, etc.
 * @param {*} innerField the inner property name in record[prop] object.
 * @param {'merged'|'original'} [type='merged'] Use `original` for the raw edited entity only.
 *
 * @return anythings.
 */
export function getEditedGlobalStylesRecord(
	data,
	prop,
	innerField,
	type = 'merged'
) {
	const { __experimentalGetCurrentGlobalStylesId } = data.select('core');
	const { getEditedEntityRecord } = data.select('core');

	let record = getEditedEntityRecord(
		'root',
		'globalStyles',
		__experimentalGetCurrentGlobalStylesId()
	);

	if ('styles' === prop && 'merged' === type) {
		const coreSelect = data.select('core');
		const blockeraMergedStyles = data
			.select('blockera/editor')
			?.getGlobalStyles?.()?.userStyles?.styles;

		if (
			blockeraMergedStyles &&
			'object' === typeof blockeraMergedStyles &&
			Object.keys(blockeraMergedStyles).length
		) {
			record = mergeObject(record, {
				styles: blockeraMergedStyles,
			});
		} else {
			const baseConfig =
				coreSelect.__experimentalGetCurrentThemeBaseGlobalStyles?.();

			if (baseConfig && 'object' === typeof baseConfig) {
				record = mergeObject(mergeObject({}, baseConfig), record);
			}
		}
	}

	if (prop) {
		if (innerField) {
			return record?.[prop]?.[innerField];
		}

		return record?.[prop];
	}

	return record;
}

/**
 * Get editor content.
 *
 * @param {Object} data the WordPress data.
 * @return {*} retrieved th field value of selected block attributes.
 */
export function getEditorContent(data) {
	const { getEditedEntityRecord } = data.select('core');
	const { getCurrentPostType, getCurrentPostId } = data.select('core/editor');
	const _type = getCurrentPostType();
	const _id = getCurrentPostId();
	const editedRecord = getEditedEntityRecord('postType', _type, _id);

	if ('function' === typeof editedRecord?.content) {
		return editedRecord?.content({ blocks: editedRecord?.blocks });
	}

	return editedRecord?.content;
}

/**
 *
 * @param {Object} data the Blockera data.
 * @param {string} field the field of attributes of blockera entity.
 * @return {*} retrieved th field value of blockera entity.
 */
export function getBlockeraEntity(data, field) {
	return data.select('blockera/data').getEntity('blockera')[field];
}

/**
 * Persist all dirty entity records (e.g. global styles) from the site or post editor.
 * Mirrors the multi-entity save flow used when clicking Save in the editor UI.
 *
 * @return {Cypress.Chainable} Resolves when WordPress `saveEditedEntityRecord` calls complete.
 */
export function saveSiteEditorDirtyEntities() {
	return cy.window().then((win) => {
		const select = win.wp.data.select('core');
		const dispatch = win.wp.data.dispatch('core');
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
}

export function getBlockClientId(data) {
	return data.select('core/block-editor').getSelectedBlock().clientId;
}

/**
 * Disable Gutenberg Tips
 */
export function disableGutenbergFeatures() {
	return getWPDataObject().then((data) => {
		data.dispatch('core/editor').disablePublishSidebar();
	});
}

export function openBlockInserter(selector = false) {
	if (selector) {
		return cy.getIframeBody().find(selector).click();
	}
	return cy.get('body').then(($body) => {
		const secondarySidebar = $body.find(
			'[data-test="blockera-secondary-sidebar-toggle"]:not(.is-pressed)'
		);

		if (secondarySidebar.length > 0) {
			return cy
				.get('[data-test="blockera-secondary-sidebar-toggle"]')
				.click();
		}
		return cy;
	});
}

export function closeBlockInserter() {
	return cy.get('body').then(($body) => {
		const secondarySidebar = $body.find(
			'[aria-label="Hide secondary sidebar"]'
		);
		if (secondarySidebar.length > 0) {
			return cy.get('[aria-label="Hide secondary sidebar"]').click();
		}
		return cy;
	});
}

/**
 * From inside the WordPress editor open the blockera Gutenberg editor panel
 *
 * for simple blocks you can use the blockName as 'core/image'
 * for blocks with variations you can use the blockName as {category}/{blockType}/{variation}
 * examples:
 * - 'core/group/group'
 * - 'core/image/blockera/icon'
 *
 * @param {string}  blockName   The name to find in the block inserter
 *                              e.g 'core/image'.
 * @param {boolean} clearEditor Should clear editor of all blocks
 * @param {string} className The block css class name
 */
export function addBlockToPost(
	blockName,
	clearEditor = false,
	className = '',
	blockInserterSelector = false
) {
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
		clearBlocks();
	}

	openBlockInserter(blockInserterSelector);

	// eslint-disable-next-line
	cy.get(
		'.block-editor-inserter__search-input,input.block-editor-inserter__search, .components-search-control__input, input[placeholder="Search"]'
	)
		.click()
		.type(blockSearchName, { delay: 0 });

	/**
	 * The network request to block-directory may be cached and is not consistently fired with each test.
	 * Instead of intercepting we can await known dom elements that appear only when search results are present.
	 * This should correct a race condition in CI.
	 */
	if (!blockInserterSelector) {
		cy.get('div.block-editor-inserter__main-area:not(.show-as-tabs)');
	}

	let targetClassName = '';

	if (blockType) {
		targetClassName = `.editor-block-list-item-${CSS.escape(
			`${blockType}/${blockID}`
		)}`;
	} else {
		targetClassName = `.editor-block-list-item-${CSS.escape(blockID)}`;
	}

	cy.get(targetClassName).first().click({ force: true });

	// Make sure the block was added to our page
	cy.get(`[class*="-visual-editor"]`)
		.should('exist')
		.then(() => {
			// Then close the block inserter if still open.
			const inserterButton = Cypress.$(
				'button[class*="__inserter-toggle"].is-pressed'
			);
			if (!!inserterButton.length) {
				cy.get('button[class*="__inserter-toggle"].is-pressed').click();
			}
		});

	cy.openDocumentSettingsSidebar('Block');

	if (blockType) {
		cy.getBlock(`${blockCategory}/${blockType}`).last().click();
	} else {
		cy.getBlock(`${blockCategory}/${blockID}`).last().click();
	}

	cy.window()
		.its('wp.hooks')
		.then((hooks) => {
			function addBlockClassName(_className) {
				return Object.assign(_className, { class: className });
			}

			hooks.addFilter(
				'blocks.getSaveContent.extraProps',
				blockName,
				addBlockClassName
			);
		});
}

export function addNewGroupToPost() {
	clearBlocks();
	// eslint-disable-next-line
	cy.get(
		'.edit-post-header [aria-label="Add block"], .edit-site-header [aria-label="Add block"], .edit-post-header-toolbar__inserter-toggle'
	).click();
	// eslint-disable-next-line
	cy.get(
		'.block-editor-inserter__search-input,input.block-editor-inserter__search, .components-search-control__input'
	)
		.click()
		.type('group');
	// eslint-disable-next-line
	if (isWP62AtLeast()) {
		// eslint-disable-next-line
		cy.wait(1000);

		cy.get('.block-editor-block-types-list__list-item')
			.contains('Group')
			.click();
	} else {
		cy.get('.block-editor-block-types-list__item').first().click();
	}

	// Make sure the block was added to our page
	cy.get(`[class*="-visual-editor"] [data-type='core/group']`)
		.should('exist')
		.then(() => {
			// Then close the block inserter if still open.
			const inserterButton = Cypress.$(
				'button[class*="__inserter-toggle"].is-pressed'
			);
			if (!!inserterButton.length) {
				cy.get('button[class*="__inserter-toggle"].is-pressed').click();
			}
		});
}

/**
 * From inside the WordPress editor open the blockera Gutenberg editor panel
 */
export function savePage() {
	cy.get('.editor-post-publish-button').click();

	// Check for snackbar and click primary button if it exists
	cy.get('body').then(($body) => {
		if (
			$body.find(
				'.entities-saved-states__panel .editor-entities-saved-states__save-button'
			).length
		) {
			cy.get(
				'.entities-saved-states__panel .editor-entities-saved-states__save-button'
			).click();
		}
	});

	// Check for success notification
	cy.get('.components-snackbar, .components-notice.is-success').should(
		'be.visible'
	);
}

export function appendBlocks(blocksCode) {
	cy.get('[aria-label="Options"]').first().click();
	cy.get('span').contains('Code editor').click();

	cy.get('.editor-post-text-editor')
		.focus()
		.invoke('val', blocksCode)
		.trigger('change', { force: true })
		.then(() => {
			// type a space to make sure the value is updated in the editor
			cy.get('.editor-post-text-editor').type(' ', { force: true });
		});

	cy.get('button').contains('Exit code editor').click();

	cy.openDocumentSettingsSidebar('Block');
}

/**
 * Redirect to front end page from current published post.
 */
export function redirectToFrontPage() {
	// Abort any pending requests before navigation
	cy.window().then((win) => {
		win.stop();
	});

	cy.get('.blockera-preview-button-wrapper a')
		.invoke('attr', 'href')
		.then((href) => {
			cy.visit(href);
		});
}

/**
 * Check the page for block errors
 *
 * @param {string} blockName blockName the block to check for
 *                           e.g 'core/image'.
 */

export function checkForBlockErrors(blockName) {
	disableGutenbergFeatures();

	cy.get('.block-editor-warning').should('not.exist');

	cy.get('body.php-error').should('not.exist');

	cy.get(`[data-type="${blockName}"]`).should('exist');
}

/**
 * View the currently edited page on the front of site
 */
export function viewPage() {
	cy.get('button[aria-label="Settings"]').then((settingsButton) => {
		if (
			!Cypress.$(settingsButton).hasClass('is-pressed') &&
			!Cypress.$(settingsButton).hasClass('is-toggled')
		) {
			cy.get(settingsButton).click();
		}
	});

	cy.get('button[data-label="Post"]');

	cy.get('.edit-post-post-url__dropdown button').click();

	cy.get('.editor-post-url__link').then((pageLink) => {
		const linkAddress = Cypress.$(pageLink).attr('href');
		cy.visit(linkAddress);
	});
}

/**
 * Edit the currently viewed page
 */
export function editPage() {
	cy.get('#wp-admin-bar-edit').click();
}

/**
 * Clear all blocks from the editor
 */
export function clearBlocks() {
	getWPDataObject().then((data) => {
		data.dispatch('core/block-editor').removeBlocks(
			data
				.select('core/block-editor')
				.getBlocks()
				.map((block) => block.clientId)
		);
	});
}

/**
 * Attempts to retrieve the block slug from the current spec file being run
 * eg: accordion.js => accordion
 */
export function getBlockSlug() {
	const specFile = Cypress.spec.name;

	return specFile.split('/').pop().replace('.cypress.js', '');
}

/**
 * Open the block navigator.
 */
export function openBlockNavigator() {
	cy.get(
		'.block-editor-block-navigation,.edit-post-header-toolbar__list-view-toggle,.edit-post-header-toolbar__document-overview-toggle,[aria-label="Document Overview"]'
	).then((element) => {
		if (!element.hasClass('is-pressed')) {
			element.click();
		}
	});
}

/**
 * Close the block navigator.
 */
export function closeBlockNavigator() {
	const inserterButton = Cypress.$(
		'.edit-post-header__toolbar button.edit-post-header-toolbar__list-view-toggle.is-pressed'
	);
	if (inserterButton.length > 0) {
		cy.get(
			'.edit-post-header__toolbar button.edit-post-header-toolbar__list-view-toggle.is-pressed'
		).click();
	}
}

/**
 * Click on a style button within the style panel
 *
 * @param {string} style Name of the style to apply
 */
export function setBlockStyle(style) {
	openSettingsPanel(RegExp('styles', 'i'));

	cy.get('.edit-post-sidebar [class*="editor-block-styles"]')
		.contains(RegExp(style, 'i'))
		.click();
}

/**
 * Select the block using the Block navigation component.
 * Input parameter is the name of the block to select.
 * Allows chaining.
 *
 * @param {string}  name         The name of the block to select eg: highlight or click-to-tweet
 * @param {boolean} isChildBlock Optional selector for children blocks. Default will be top level blocks.
 */
export function selectBlock(name, isChildBlock = false) {
	openBlockNavigator();

	if (isChildBlock) {
		cy.get('.block-editor-list-view__expander svg').first().click();
	}

	// A small wait seems needed to make sure that the list of blocks on the left is complete
	// eslint-disable-next-line
	cy.wait(250);

	// Returning the cy.get function allows to chain off of selectBlock
	// eslint-disable-next-line
	return cy
		.get('.block-editor-block-navigation-leaf,.block-editor-list-view-leaf')
		.contains(isChildBlock ? RegExp(`${name}$`, 'i') : RegExp(name, 'i'))
		.click()
		.then(() => {
			// Then close the block navigator if still open.
			closeBlockNavigator();
		});
}

/**
 * Open a certain settings panel in the right hand sidebar of the editor
 *
 * @param {RegExp} panelText The panel label text to open. eg: Color Settings
 */
export function openSettingsPanel(panelText) {
	cy.get('.components-panel__body')
		.contains(panelText)
		.then(($panelTop) => {
			const $parentPanel = Cypress.$($panelTop).closest(
				'div.components-panel__body'
			);
			if (!$parentPanel.hasClass('is-opened')) {
				$panelTop.trigger('click');
			}
		});
}

/**
 * Open a block heading controls located in block toolbar.
 *
 * @param {number} headingLevel The button that should be located and clicked
 */
export function openHeadingToolbarAndSelect(headingLevel) {
	cy.get(
		'.block-editor-block-toolbar .block-editor-block-toolbar__slot button'
	).each((button, index) => {
		if (index === 1) {
			// represents the second position in the toolbar
			cy.get(button).click({ force: true });
		}
	});
	// eslint-disable-next-line
	cy.get('.components-popover__content div[role="menu"] button')
		.contains(headingLevel)
		.focus()
		.click();
}

// Open More Settings Panel and Activate Item
export function openMoreFeaturesControl(label) {
	cy.get(`.blockera-component-more-features > button[aria-label="${label}"]`)
		.parent()
		.then((element) => {
			if (!element.hasClass('is-open')) {
				cy.get(
					`.blockera-component-more-features > button[aria-label="${label}"]`
				).click();
			}
		});
}

// unfocus block
export const deSelectBlock = () => {
	cy.getIframeBody().find('h1').click();
};

export const reSelectBlock = (blockType = 'core/paragraph') => {
	deSelectBlock();

	// reselect block
	cy.getIframeBody()
		.find(`[data-type="${blockType}"]`)
		.first()
		.click({ force: true });
};

/**
 * Close welcome guide if it exists
 */
export function closeWelcomeGuide() {
	// Return inner cy chains from `.then` so Cypress runs clicks *before* the overlay
	// assertion below (nested cy.* without return can enqueue after the sibling).
	cy.get('body').then(($body) => {
		const hasClose =
			$body.find(
				'.components-modal__screen-overlay button[aria-label="Close"]'
			).length > 0;
		const hasFinish =
			$body.find(
				'.components-modal__screen-overlay button.components-guide__finish-button'
			).length > 0;

		if (hasClose) {
			return cy
				.get('.components-modal__screen-overlay [aria-label="Close"]')
				.last()
				.click();
		}

		if (hasFinish) {
			return cy
				.get(
					'.components-modal__screen-overlay button.components-guide__finish-button'
				)
				.click();
		}
	});

	// Wait until no modal overlay remains (dismiss animation after Close/Finish).
	// Do not use `invoke('remove', { force: true })` — Cypress passes the second
	// argument to jQuery `.remove(selector)`, so the overlay may never detach.
	// Avoid native `el.remove()` here: that can desync React on post-new.
	cy.get('body', { timeout: 20000 }).should(($b) => {
		expect($b.find('.components-modal__screen-overlay')).to.have.length(0);
		// Overlay can unmount before modal chrome; :visible avoids counting hidden shells.
		expect(
			$b.find('.components-modal__header-heading-container:visible')
		).to.have.length(0);
	});
}

/**
 * Resolve mu-plugin target filename under wp-content/mu-plugins/.
 *
 * @param {string} muPluginPath Full path to the mu-plugin.php file (relative to plugin root).
 * @param {string|null} targetName Optional target filename.
 * @return {string} Target filename under wp-content/mu-plugins/.
 */
function getMuPluginTargetName(muPluginPath, targetName = null) {
	if (targetName) {
		return targetName;
	}
	// e.g. "block-query-title" from "tests/fixtures/block-query-title/mu-plugin.php"
	const pathParts = muPluginPath.split('/');
	const folderName = pathParts[pathParts.length - 2] || 'mu-plugin';
	return `blockera-test-${folderName}.php`;
}

/**
 * Run mu-plugin activate/deactivate via Node cy.task (host filesystem).
 * Avoids `cy.exec` + Docker, which can hang for 60s inside Cypress/Electron.
 *
 * @param {string} action Short label (e.g. activateMuPlugin).
 * @param {string} label Human-readable context for the log line.
 * @param {string} taskName Cypress task name.
 * @param {object} taskArgs Task payload.
 * @return {Cypress.Chainable} Wrapped task result with stdout logged.
 */
function runMuPluginTask(action, label, taskName, taskArgs) {
	const startedAt = Date.now();

	return cy.task(taskName, taskArgs).then((result) => {
		const elapsedMs = Date.now() - startedAt;
		cy.log(
			`[${action}] ${label} | ${result?.message || ''} (${elapsedMs}ms)`
		);
		return cy.wrap(result);
	});
}

/**
 * Activate mu-plugin by copying it to wp-content/mu-plugins/ directory.
 * This function accepts a full path to the mu-plugin.php file and copies it to the mu-plugins directory.
 *
 * On CI, retries up to `Cypress.env('muPluginActivateMaxAttempts')` times (default 1) with
 * filesystem verification after each copy. Retry attempts force-delete the target before re-copying.
 *
 * @param {string} muPluginPath Full path to the mu-plugin.php file (relative to plugin root).
 * @param {string} [targetName] Optional target filename. If not provided, generates from path.
 * @return {Cypress.Chainable} Cypress chainable.
 */
export function activateMuPlugin(muPluginPath, targetName = null) {
	targetName = getMuPluginTargetName(muPluginPath, targetName);

	const maxAttempts = Cypress.env('muPluginActivateMaxAttempts') ?? 1;
	const label = `${muPluginPath} -> ${targetName}`;

	function activateWithRetry(attempt = 1) {
		const force = attempt > 1;
		const startedAt = Date.now();

		return cy
			.task('muPluginActivate', { muPluginPath, targetName, force })
			.then((activateResult) => {
				const activateMs = Date.now() - startedAt;
				cy.log(
					`[activateMuPlugin] ${label} | ${activateResult?.message || ''} (${activateMs}ms)`
				);
			})
			.task('muPluginVerify', { muPluginPath, targetName })
			.then((verifyResult) => {
				const verifyMs = Date.now() - startedAt;
				cy.log(
					`[activateMuPlugin] verify ${label} | ${verifyResult?.message || ''} (${verifyMs}ms)`
				);

				if (verifyResult?.ok) {
					return cy.wrap(verifyResult);
				}

				if (attempt >= maxAttempts) {
					throw new Error(
						`Mu-plugin activation failed after ${maxAttempts} attempt(s): ${verifyResult?.message || 'unknown verify error'}`
					);
				}

				cy.log(
					`[activateMuPlugin] verify failed (attempt ${attempt}/${maxAttempts}), retrying…`
				);

				return cy.wait(500).then(() => activateWithRetry(attempt + 1));
			});
	}

	return activateWithRetry();
}

/**
 * Deactivate mu-plugin by removing it from wp-content/mu-plugins/ directory.
 * This function removes the mu-plugin file that was previously activated.
 *
 * @param {string} muPluginPath Full path to the mu-plugin.php file (relative to plugin root).
 * @param {string} [targetName] Optional target filename. If not provided, generates from path (must match activateMuPlugin).
 * @return {Cypress.Chainable} Cypress chainable.
 */
export function deactivateMuPlugin(muPluginPath, targetName = null) {
	targetName = getMuPluginTargetName(muPluginPath, targetName);

	return runMuPluginTask(
		'deactivateMuPlugin',
		targetName,
		'muPluginDeactivate',
		{ muPluginPath, targetName }
	);
}
