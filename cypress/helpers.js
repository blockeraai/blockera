/**
 * Login to our test WordPress site
 */
export function loginToSite() {
	return goTo('/wp-login.php', true).then(() => {
		// eslint-disable-next-line
		cy.wait(250);

		cy.get('#user_login').type(Cypress.env('wpUsername'));
		cy.get('#user_pass').type(Cypress.env('wpPassword'));
		cy.get('#wp-submit').click();
	});
}

/**
 * Go to a specific URI.
 *
 * @param {string}  path  The URI path to go to.
 * @param {boolean} login If this is a login page.
 */
export function goTo(path = '/wp-admin', login = false) {
	const testURL = Cypress.env('testURL');

	if (
		(testURL.endsWith('/') && !path.startsWith('/')) ||
		(!testURL.endsWith('/') && path.startsWith('/'))
	) {
		path = `${testURL}${path}`;
	} else if (!testURL.endsWith('/') && !path.startsWith('/')) {
		path = `${testURL}/${path}`;
	} else if (testURL.endsWith('/') && path.startsWith('/')) {
		path = `${testURL.slice(0, -1)}${path}`;
	}

	return cy.visit(path).then(() => {
		return login
			? cy.window().then((win) => {
					return win;
			  })
			: getWPDataObject();
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
 *
 * @param {Object} data the WordPress data.
 * @param {string} field the field of attributes of selectedBlock.
 * @return {*} retrieved th field value of selected block attributes.
 */
export function getSelectedBlock(data, field) {
	return data.select('core/block-editor').getSelectedBlock().attributes[
		field
	];
}

/**
 * Disable Gutenberg Tips
 */
export function disableGutenbergFeatures() {
	return getWPDataObject().then((data) => {
		// Enable "Top Toolbar"
		if (!data.select('core/edit-post').isFeatureActive('fixedToolbar')) {
			data.dispatch('core/edit-post').toggleFeature('fixedToolbar');
		}

		if (data.select('core/edit-post').isFeatureActive('welcomeGuide')) {
			data.dispatch('core/edit-post').toggleFeature('welcomeGuide');
		}

		data.dispatch('core/editor').disablePublishSidebar();
	});
}

/**
 * From inside the WordPress editor open the publisher-core Gutenberg editor panel
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

	if (
		Cypress.$(
			'.edit-post-header-toolbar__inserter-toggle[aria-pressed="false"]'
		)
	) {
		cy.get(
			'.edit-post-header [aria-label="Add block"], .edit-site-header [aria-label="Add block"], .edit-post-header-toolbar__inserter-toggle[aria-pressed="false"]'
		).click();
	}

	// eslint-disable-next-line
	cy.get(
		'.block-editor-inserter__search-input,input.block-editor-inserter__search, .components-search-control__input'
	)
		.click()
		.type(blockName);

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

	cy.get('.interface-pinned-items [aria-label="Settings"]').click();

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
 * From inside the WordPress editor open the publisher-core Gutenberg editor panel
 */
export function savePage() {
	cy.get('.edit-post-header__settings button.is-primary').click();

	cy.get('.components-editor-notices__snackbar', { timeout: 120000 }).should(
		'not.be.empty'
	);

	// Reload the page to ensure that we're not hitting any block errors
	// cy.reload();
}

export function appendBlocks(blocksCode) {
	cy.get('[aria-label="Options"]').click();
	cy.get('span').contains('Code editor').click();

	cy.get('.editor-post-text-editor')
		.invoke('val', blocksCode)
		.trigger('change');

	// type a space to make sure the value is updated in the editor
	cy.get('.editor-post-text-editor').type(' ', {
		parseSpecialCharSequences: false,
		keystrokeDelay: 0,
	});

	cy.get('button').contains('Exit code editor').click();
}

/**
 * Redirect to front end page from current published post.
 */
export function redirectToFrontPage() {
	cy.get('[aria-label="View Post"]')
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
		'.block-editor-block-navigation,.edit-post-header-toolbar__list-view-toggle,.edit-post-header-toolbar__document-overview-toggle'
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
 * Set a value within the input box
 *
 * @param {string}  panelName   Name of the panel to open
 * @param {string}  settingName The name of the setting to search for
 * @param {string}  value       The value to type
 * @param {boolean} ignoreCase  Optional case sensitivity. Default will ignore case.
 */
export function setInputValue(
	panelName,
	settingName,
	value,
	ignoreCase = true
) {
	openSettingsPanel(ignoreCase ? RegExp(panelName, 'i') : panelName);
	// eslint-disable-next-line
	cy.get('.edit-post-sidebar')
		.contains(ignoreCase ? RegExp(settingName, 'i') : settingName)
		.not('.block-editor-block-card__description')
		.then(($settingSection) => {
			// eslint-disable-next-line
			cy.get(Cypress.$($settingSection).parent())
				.find('input[type="number"]')
				.focus()
				.type(`{selectall}${value}`);
		});
}

/**
 * Set a Color Setting value to a custom hex color
 *
 * @param {string} settingName The setting to update. background|text
 * @param {string} hexColor
 */
export function setColorSettingsFoldableSetting(settingName, hexColor) {
	const formattedHex = hexColor.split('#')[1];

	cy.get('.block-editor-panel-color-gradient-settings__dropdown')
		.contains(settingName, { matchCase: false })
		.click();
	cy.get('.components-color-palette__custom-color').click();
	// eslint-disable-next-line
	cy.get('.components-color-picker')
		.find('.components-input-control__input')
		.click()
		.clear()
		.type(formattedHex);

	cy.get('.block-editor-panel-color-gradient-settings__dropdown')
		.contains(settingName, { matchCase: false })
		.click({ force: true });
}

export function setColorPanelSetting(settingName, hexColor) {
	const formattedHex = hexColor.split('#')[1];

	cy.get('.block-editor-panel-color-gradient-settings__dropdown')
		.contains(settingName, { matchCase: false })
		.click();
	cy.get('.components-color-palette__custom-color').click();
	// eslint-disable-next-line
	cy.get('.components-color-picker')
		.find('.components-input-control__input')
		.click()
		.clear()
		.type(formattedHex);

	cy.get('.block-editor-panel-color-gradient-settings__dropdown')
		.contains(settingName, { matchCase: false })
		.click();
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

/**
 * Toggle an checkbox in the settings panel of the block editor
 *
 * @param {string} checkboxLabelText The checkbox label text. eg: Drop Cap
 */
export function toggleSettingCheckbox(checkboxLabelText) {
	cy.get('.components-toggle-control__label')
		.contains(checkboxLabelText)
		.closest('.components-base-control__field')
		.find('.components-form-toggle__input')
		.click();
}

/**
 * Helper method to convert a hex value to an RGB value
 *
 * @param {string} hex Hex string. eg: #55e7ff
 * @return {string} RGB string.
 */
export function hexToRGB(hex) {
	let r = 0;
	let g = 0;
	let b = 0;

	// 3 digits
	if (hex.length === 4) {
		r = '0x' + hex[1] + hex[1];
		g = '0x' + hex[2] + hex[2];
		b = '0x' + hex[3] + hex[3];
		// 6 digits
	} else if (hex.length === 7) {
		r = '0x' + hex[1] + hex[2];
		g = '0x' + hex[3] + hex[4];
		b = '0x' + hex[5] + hex[6];
	}

	return 'rgb(' + +r + ', ' + +g + ', ' + +b + ')';
}

export function isNotWPLocalEnv() {
	return Cypress.env('testURL') !== 'http://localhost:8889';
}

// A condition to determine if we are testing on WordPress 6.2+
// This function should be removed in the process of the work for WP 6.3 compatibility
export function isWP62AtLeast() {
	return (
		Cypress.$("[class*='branch-6-2']").length > 0 ||
		Cypress.$("[class*='branch-6-3']").length > 0
	);
}

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

export function hexStringToByte(str) {
	if (!str) {
		return new Uint8Array();
	}

	const a = [];
	for (let i = 0, len = str.length; i < len; i += 2) {
		a.push(parseInt(str.substr(i, 2), 16));
	}

	return new Uint8Array(a);
}

export function setBlockType(blockType, suffix = ' Customize') {
	// Alias
	cy.get('h2').contains('Inner Blocks').as('inners');

	cy.get('@inners').click();

	// Open "link" inner block panel.
	cy.get('@inners').parent().parent().as('innersBox');
	cy.get('@innersBox').within(() => {
		cy.get(`[aria-label="${blockType}${suffix}"]`).click();
	});
}

export function setDeviceType(deviceType) {
	cy.getByAriaLabel('Breakpoints').within(() => {
		cy.getByAriaLabel(deviceType).click();
	});
}
