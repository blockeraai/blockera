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

export function getBlockInserter() {
	return cy.get(
		'.edit-post-header [aria-label="Toggle block inserter"], .edit-site-header [aria-label="Toggle block inserter"], .edit-post-header-toolbar__inserter-toggle[aria-pressed="false"], .editor-document-tools__inserter-toggle is-primary[aria-pressed="false"]'
	);
}

/**
 * From inside the WordPress editor open the blockera Gutenberg editor panel
 *
 * @param {string}  blockName   The name to find in the block inserter
 *                              e.g 'core/image'.
 * @param {boolean} clearEditor Should clear editor of all blocks
 * @param {string} className The block css class name
 */
export function addBlockToPost(blockName, clearEditor = false, className = '') {
	const blockCategory = blockName.split('/')[0] || false;
	const blockID = blockName.split('/')[1] || false;

	if (!blockCategory || !blockID) {
		return;
	}

	if (clearEditor) {
		clearBlocks();
	}

	getBlockInserter().click();

	// eslint-disable-next-line
	cy.get(
		'.block-editor-inserter__search-input,input.block-editor-inserter__search, .components-search-control__input, input[placeholder="Search"]'
	)
		.click()
		.type(blockName, { delay: 0 });

	/**
	 * The network request to block-directory may be cached and is not consistently fired with each test.
	 * Instead of intercepting we can await known dom elements that appear only when search results are present.
	 * This should correct a race condition in CI.
	 */
	cy.get('div.block-editor-inserter__main-area:not(.show-as-tabs)');

	const targetClassName =
		(blockCategory === 'core' ? '' : `-${blockCategory}`) + `-${blockID}`;
	cy.get('.editor-block-list-item' + targetClassName)
		.first()
		.click({ force: true });

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

	// Click on added new block item.
	cy.getBlock(blockName).click();

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

	cy.get('.blockera-control-canvas-editor-preview-link a')
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

export const reSelectBlock = (blockType = 'core/paragraph') => {
	// unfocus block
	cy.getIframeBody().find('h1').click();

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
	cy.get('body').then(($body) => {
		if (
			$body.find(
				'.components-modal__screen-overlay button[aria-label="Close"]'
			).length > 0
		) {
			cy.get('.components-modal__screen-overlay [aria-label="Close"]')
				.last()
				.click();
		}

		// Check for either button and click the first one found
		if (
			$body.find(
				'.components-modal__screen-overlay button.components-guide__finish-button'
			).length > 0
		) {
			cy.get(
				'.components-modal__screen-overlay button.components-guide__finish-button'
			).click();
		}
	});

	cy.wait(10);

	cy.get('body').then(($body) => {
		// Check and remove screen overlay if it exists
		if ($body.find('.components-modal__screen-overlay').length > 0) {
			cy.get('.components-modal__screen-overlay').invoke('remove', {
				force: true,
			});
		}
	});
}
