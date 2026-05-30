/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	getWPDataObject,
	getSelectedBlock,
	setDeviceType,
} from '@blockera/dev-cypress/js/helpers';

const TOOLBAR_SCOPE = '[data-test="data-blockera-layout-toolbar"]';

const CORE_LAYOUT_TOOLBAR_ARIA_PATTERNS = [
	'Justify',
	'Align top',
	'Align middle',
	'Align bottom',
	'Change vertical alignment',
	'Stretch to fill',
];

const FLEX_GROUP = `<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;

const FLEX_COLUMNS = `<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:paragraph -->
<p>Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->`;

function selectParentBlockFromChild() {
	cy.get('[aria-label^="Select parent block:"]').click();
}

function openFlexDisplayInBlockera() {
	cy.addNewTransition();
	cy.getByDataTest('style-tab').click();

	cy.getParentContainer('Display').within(() => {
		cy.getByAriaLabel('Flex').then(($flexButton) => {
			if ($flexButton.attr('aria-pressed') !== 'true') {
				cy.wrap($flexButton).click();
			}
		});
	});

	cy.waitForAssertValue();
}

function openFlexGroupInBlockera() {
	appendBlocks(FLEX_GROUP);

	cy.getBlock('core/paragraph').first().click();
	selectParentBlockFromChild();
	openFlexDisplayInBlockera();
}

function openFlexColumnsInBlockera() {
	appendBlocks(FLEX_COLUMNS);

	cy.getBlock('core/paragraph').first().click();
	selectParentBlockFromChild();
	selectParentBlockFromChild();
	openFlexDisplayInBlockera();
}

function openFlexColumnInBlockera() {
	appendBlocks(FLEX_COLUMNS);

	cy.getBlock('core/paragraph').first().click();
	selectParentBlockFromChild();
	openFlexDisplayInBlockera();
}

function assertSelectedBlockType(blockName) {
	cy.getSelectedBlock().should('have.attr', 'data-type', blockName);
}

function assertCoreLayoutSupportDisabled(blockName) {
	cy.window().then((win) => {
		const layoutSupport = win.wp.blocks.getBlockSupport(
			blockName,
			'layout'
		);

		expect(layoutSupport.allowJustification).to.equal(false);
		expect(layoutSupport.allowVerticalAlignment).to.equal(false);
	});
}

function assertCoreLayoutToolbarHidden() {
	cy.get('.block-editor-block-toolbar')
		.should('be.visible')
		.then(($toolbar) => {
			CORE_LAYOUT_TOOLBAR_ARIA_PATTERNS.forEach((pattern) => {
				const $visibleControls = $toolbar
					.find(`[aria-label*="${pattern}"]`)
					.filter(':visible')
					.filter(
						(index, element) =>
							Cypress.$(element).closest(TOOLBAR_SCOPE).length ===
							0
					);

				expect(
					$visibleControls.length,
					`core layout toolbar control "${pattern}" should be hidden`
				).to.equal(0);
			});
		});
}

function assertBlockeraLayoutToolbarVisible() {
	cy.get('.block-editor-block-toolbar')
		.should('be.visible')
		.within(() => {
			cy.get(`${TOOLBAR_SCOPE} .components-toolbar-group`)
				.filter(':visible')
				.should('have.length.at.least', 2);
		});
}

function clickHorizontalToolbarOption(optionIndex) {
	cy.get(`${TOOLBAR_SCOPE} .components-toolbar-group`)
		.filter(':visible')
		.eq(0)
		.find('button')
		.filter(':visible')
		.first()
		.click();

	cy.get('[role="menu"] button').filter(':visible').eq(optionIndex).click();
}

function clickVerticalToolbarOption(optionIndex) {
	cy.get(`${TOOLBAR_SCOPE} .components-toolbar-group`)
		.filter(':visible')
		.eq(1)
		.find('button')
		.filter(':visible')
		.first()
		.click();

	cy.get('[role="menu"] button').filter(':visible').eq(optionIndex).click();
}

function assertWpLayout(data, expected) {
	const layout = getSelectedBlock(data, 'layout');

	expect('flex').to.equal(layout?.type);
	expect(expected.orientation).to.equal(layout?.orientation);
	expect(expected.verticalAlignment).to.equal(layout?.verticalAlignment);
	expect(expected.justifyContent).to.equal(layout?.justifyContent);
}

function getMobileBreakpointFlexLayout(data) {
	const blockStates = getSelectedBlock(data, 'blockeraBlockStates');
	const raw =
		blockStates?.normal?.breakpoints?.mobile?.attributes
			?.blockeraFlexLayout;

	return raw?.value ?? raw;
}

describe('Blockera layout toolbar', () => {
	beforeEach(() => {
		createPost();
	});

	describe('core/group', () => {
		beforeEach(() => {
			openFlexGroupInBlockera();
		});

		it('disables core layout supports and shows Blockera toolbar', () => {
			assertCoreLayoutSupportDisabled('core/group');
			assertBlockeraLayoutToolbarVisible();
		});

		it('updates blockeraFlexLayout and WP layout from toolbar', () => {
			clickHorizontalToolbarOption(1);

			getWPDataObject().then((data) => {
				expect('center').to.equal(
					getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
				);

				assertWpLayout(data, {
					orientation: 'horizontal',
					justifyContent: 'center',
					verticalAlignment: undefined,
				});
			});

			clickVerticalToolbarOption(1);

			getWPDataObject().then((data) => {
				expect('center').to.equal(
					getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
				);

				assertWpLayout(data, {
					orientation: 'horizontal',
					justifyContent: 'center',
					verticalAlignment: 'center',
				});
			});
		});

		it('supports stretch on align and space-around on justify in row', () => {
			clickHorizontalToolbarOption(3);

			getWPDataObject().then((data) => {
				expect('space-around').to.equal(
					getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
				);
			});

			clickVerticalToolbarOption(3);

			getWPDataObject().then((data) => {
				expect('stretch').to.equal(
					getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
				);
			});
		});

		it('remaps toolbar values when flex direction is column', () => {
			cy.getParentContainer('Flex Layout').within(() => {
				cy.getByAriaLabel('flex-direction: column').click();
			});

			clickHorizontalToolbarOption(0);

			getWPDataObject().then((data) => {
				assertWpLayout(data, {
					orientation: 'vertical',
					justifyContent: 'left',
					verticalAlignment: undefined,
				});

				expect('flex-start').to.equal(
					getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
				);
			});

			assertBlockeraLayoutToolbarVisible();
		});

		it('supports space-between and space-around on vertical align when column', () => {
			cy.getParentContainer('Flex Layout').within(() => {
				cy.getByAriaLabel('flex-direction: column').click();
			});

			clickVerticalToolbarOption(4);

			getWPDataObject().then((data) => {
				expect('space-between').to.equal(
					getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
				);

				assertWpLayout(data, {
					orientation: 'vertical',
					verticalAlignment: 'space-between',
					justifyContent: undefined,
				});
			});

			clickVerticalToolbarOption(3);

			getWPDataObject().then((data) => {
				expect('space-around').to.equal(
					getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
				);

				assertWpLayout(data, {
					orientation: 'vertical',
					verticalAlignment: 'space-around',
					justifyContent: undefined,
				});
			});
		});

		it('stores different flex alignment per breakpoint from toolbar', () => {
			clickHorizontalToolbarOption(1);

			cy.waitForAssertValue();

			getWPDataObject().then((data) => {
				expect('center').to.equal(
					getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
				);
			});

			setDeviceType('Mobile Portrait');

			clickHorizontalToolbarOption(0);

			cy.waitForAssertValue();

			getWPDataObject().then((data) => {
				expect('flex-start').to.equal(
					getMobileBreakpointFlexLayout(data)?.justifyContent
				);
			});

			setDeviceType('Desktop');

			cy.waitForAssertValue();

			getWPDataObject().then((data) => {
				expect('center').to.equal(
					getSelectedBlock(data, 'blockeraFlexLayout')?.justifyContent
				);
			});
		});

		it('does not show toolbar when display is not flex', () => {
			cy.getParentContainer('Display').within(() => {
				cy.getByAriaLabel('Block').click();
			});

			cy.get('.block-editor-block-toolbar')
				.find(TOOLBAR_SCOPE)
				.should('not.exist');
		});
	});

	describe('core/columns', () => {
		beforeEach(() => {
			openFlexColumnsInBlockera();
		});

		it('hides hardcoded core toolbar and shows Blockera layout controls', () => {
			assertSelectedBlockType('core/columns');
			assertCoreLayoutToolbarHidden();
			assertBlockeraLayoutToolbarVisible();

			clickVerticalToolbarOption(1);

			getWPDataObject().then((data) => {
				expect('center').to.equal(
					getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
				);
			});
		});
	});

	describe('core/column', () => {
		beforeEach(() => {
			openFlexColumnInBlockera();
		});

		it('hides hardcoded core toolbar and shows Blockera layout controls', () => {
			assertSelectedBlockType('core/column');
			assertCoreLayoutToolbarHidden();
			assertBlockeraLayoutToolbarVisible();

			clickVerticalToolbarOption(1);

			getWPDataObject().then((data) => {
				expect('center').to.equal(
					getSelectedBlock(data, 'blockeraFlexLayout')?.alignItems
				);
			});
		});
	});
});
