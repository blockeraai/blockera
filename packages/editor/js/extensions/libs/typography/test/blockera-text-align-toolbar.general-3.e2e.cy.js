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

const TOOLBAR_SCOPE = '[data-test="data-blockera-text-align-toolbar"]';

function clickToolbarTextAlign(optionIndex) {
	cy.get(`${TOOLBAR_SCOPE} button[aria-label="Align text"]`).click();
	// Popover menu is portaled outside the toolbar wrapper.
	cy.get('div[aria-label="Align text"] button').eq(optionIndex).click();
}

function assertCoreTextAlignSupportDisabled(blockName) {
	cy.window().then((win) => {
		const typographySupport = win.wp.blocks.getBlockSupport(
			blockName,
			'typography'
		);

		expect(typographySupport.textAlign).to.equal(false);
	});
}

function assertBlockeraTextAlignToolbarVisible() {
	cy.get('.block-editor-block-toolbar')
		.should('be.visible')
		.within(() => {
			cy.get(`${TOOLBAR_SCOPE} button[aria-label="Align text"]`)
				.filter(':visible')
				.should('have.length', 1);
		});
}

function getMobileBreakpointTextAlign(data) {
	const blockStates = getSelectedBlock(data, 'blockeraBlockStates');
	const raw =
		blockStates?.normal?.breakpoints?.mobile?.attributes?.blockeraTextAlign;

	return raw?.value ?? raw;
}

describe('Blockera text-align toolbar', () => {
	beforeEach(() => {
		createPost();
	});

	describe('core/paragraph', () => {
		beforeEach(() => {
			appendBlocks(
				`<!-- wp:paragraph -->
<p>Test paragraph...</p>
<!-- /wp:paragraph -->`
			);

			cy.getBlock('core/paragraph').click();
			cy.addNewTransition();
		});

		it('disables core typography.textAlign and shows Blockera toolbar', () => {
			assertCoreTextAlignSupportDisabled('core/paragraph');
			assertBlockeraTextAlignToolbarVisible();
		});

		it('updates blockeraTextAlign and WP align from toolbar', () => {
			clickToolbarTextAlign(1);

			getWPDataObject().then((data) => {
				expect('center').to.equal(
					getSelectedBlock(data, 'blockeraTextAlign')
				);
				expect('center').to.equal(getSelectedBlock(data, 'align'));
			});

			clickToolbarTextAlign(2);

			getWPDataObject().then((data) => {
				expect('right').to.equal(
					getSelectedBlock(data, 'blockeraTextAlign')
				);
				expect('right').to.equal(getSelectedBlock(data, 'align'));
			});
		});

		it('keeps block wide/full align support separate from text align', () => {
			cy.window().then((win) => {
				const blockAlign = win.wp.blocks.getBlockSupport(
					'core/paragraph',
					'align'
				);

				expect(blockAlign).to.include('wide');
				expect(blockAlign).to.include('full');
			});

			assertBlockeraTextAlignToolbarVisible();
		});

		it('stores different text align per breakpoint from toolbar', () => {
			clickToolbarTextAlign(1);

			cy.waitForAssertValue();

			getWPDataObject().then((data) => {
				expect('center').to.equal(
					getSelectedBlock(data, 'blockeraTextAlign')
				);
			});

			setDeviceType('Mobile Portrait');

			clickToolbarTextAlign(0);

			cy.waitForAssertValue();

			getWPDataObject().then((data) => {
				expect('left').to.equal(getMobileBreakpointTextAlign(data));
			});

			setDeviceType('Desktop');

			cy.waitForAssertValue();

			getWPDataObject().then((data) => {
				expect('center').to.equal(
					getSelectedBlock(data, 'blockeraTextAlign')
				);
			});
		});
	});

	describe('core/heading', () => {
		beforeEach(() => {
			appendBlocks(
				`<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Heading</h2>
<!-- /wp:heading -->`
			);

			cy.getBlock('core/heading').click();
			cy.addNewTransition();
		});

		it('disables core typography.textAlign and syncs textAlign attribute', () => {
			assertCoreTextAlignSupportDisabled('core/heading');
			assertBlockeraTextAlignToolbarVisible();

			clickToolbarTextAlign(0);

			getWPDataObject().then((data) => {
				expect('left').to.equal(
					getSelectedBlock(data, 'blockeraTextAlign')
				);
				expect('left').to.equal(
					getSelectedBlock(data, 'style')?.typography?.textAlign
				);
			});
		});
	});

	describe('core/quote', () => {
		beforeEach(() => {
			appendBlocks(
				`<!-- wp:quote -->
<blockquote class="wp-block-quote">
<!-- wp:paragraph -->
<p>Quote text</p>
<!-- /wp:paragraph -->
</blockquote>
<!-- /wp:quote -->`
			);

			cy.getBlock('core/paragraph').click();
			cy.getByAriaLabel('Select Quote').click();
			cy.get('.blockera-extension-block-card').should('be.visible');
		});

		it('hides hardcoded core toolbar and shows Blockera text align', () => {
			cy.get('.block-editor-block-toolbar')
				.find('button[aria-label="Align text"]')
				.filter(':visible')
				.should('have.length', 1);

			assertBlockeraTextAlignToolbarVisible();

			clickToolbarTextAlign(1);

			getWPDataObject().then((data) => {
				expect('center').to.equal(
					getSelectedBlock(data, 'blockeraTextAlign')
				);
			});
		});
	});
});
