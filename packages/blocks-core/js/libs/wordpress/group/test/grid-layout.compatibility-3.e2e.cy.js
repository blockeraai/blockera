/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	assertBlockData,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Group Block → Grid layout → WP data compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	it('maps WP layout grid minimumColumnWidth and columnCount into Blockera attrs', () => {
		appendBlocks(`<!-- wp:group {"layout":{"type":"grid","minimumColumnWidth":"15rem","columnCount":4}} -->
<div class="wp-block-group"><!-- wp:heading -->
<h2 class="wp-block-heading">Heading text</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>paragraph text</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
`);

		cy.getBlock('core/heading').first().click();
		cy.getByAriaLabel('Select parent block: Grid').click();
		cy.checkActiveBlockVariation('group-grid');
		cy.addNewTransition();

		assertBlockData((data) => {
			const layout = getSelectedBlock(data, 'layout');

			expect(layout?.type).to.equal('grid');
			expect(layout?.minimumColumnWidth).to.equal('15rem');
			expect(Number(layout?.columnCount)).to.equal(4);

			expect(getSelectedBlock(data, 'blockeraDisplay')).to.equal('grid');
			expect(
				getSelectedBlock(data, 'blockeraGridMinimumColumnWidth')
			).to.equal('15rem');
			expect(getSelectedBlock(data, 'blockeraGridColumnCount')).to.equal(
				4
			);
		});
	});

	it('writes Blockera grid fields into core layout for core/group', () => {
		appendBlocks(`<!-- wp:group {"layout":{"type":"grid","minimumColumnWidth":"15rem","columnCount":4}} -->
<div class="wp-block-group"><!-- wp:heading -->
<h2 class="wp-block-heading">Heading text</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>paragraph text</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
`);

		cy.getBlock('core/heading').first().click();
		cy.getByAriaLabel('Select parent block: Grid').click();
		cy.checkActiveBlockVariation('group-grid');
		cy.addNewTransition();

		cy.getByAriaControls('styles-view').click();

		cy.typeInInputByDataTest('layout-grid-minimum-column-width', '20rem');
		cy.waitForAssertValue();
		cy.typeInInputByDataTest('layout-grid-column-count', '2');
		cy.waitForAssertValue();

		assertBlockData((data) => {
			const layout = getSelectedBlock(data, 'layout');

			expect(layout?.type).to.equal('grid');
			expect(layout?.minimumColumnWidth).to.equal('20rem');
			expect(Number(layout?.columnCount)).to.equal(2);
		});
	});

	it('leaves Blockera grid attrs empty when WP only sets layout.type grid', () => {
		appendBlocks(`<!-- wp:group {"layout":{"type":"grid"}} -->
<div class="wp-block-group"><!-- wp:heading -->
<h2 class="wp-block-heading">Heading text</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>paragraph text</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
`);

		cy.getBlock('core/heading').first().click();
		cy.getByAriaLabel('Select parent block: Grid').click();
		cy.checkActiveBlockVariation('group-grid');
		cy.addNewTransition();

		assertBlockData((data) => {
			const layout = getSelectedBlock(data, 'layout');

			expect(layout?.type).to.equal('grid');
			expect(layout?.minimumColumnWidth).to.be.undefined;
			expect(layout?.columnCount).to.be.undefined;

			expect(getSelectedBlock(data, 'blockeraDisplay')).to.equal('grid');
			expect(
				getSelectedBlock(data, 'blockeraGridMinimumColumnWidth')
			).to.equal('');
			expect(getSelectedBlock(data, 'blockeraGridColumnCount')).to.equal(
				''
			);
		});
	});

	it('preserves WP grid min width and column count when toggling display flex then grid', () => {
		appendBlocks(`<!-- wp:group {"layout":{"type":"grid","minimumColumnWidth":"11rem","columnCount":3}} -->
<div class="wp-block-group"><!-- wp:heading -->
<h2 class="wp-block-heading">Heading text</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>paragraph text</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
`);

		cy.getBlock('core/heading').first().click();
		cy.getByAriaLabel('Select parent block: Grid').click();
		cy.checkActiveBlockVariation('group-grid');
		cy.addNewTransition();

		cy.getByAriaControls('styles-view').click();

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});
		cy.checkActiveBlockVariation('group-row');
		cy.waitForAssertValue();

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Grid').click();
		});
		cy.checkActiveBlockVariation('group-grid');
		cy.waitForAssertValue();

		assertBlockData((data) => {
			const layout = getSelectedBlock(data, 'layout');

			expect(layout?.type).to.equal('grid');
			expect(layout?.minimumColumnWidth).to.equal('11rem');
			expect(Number(layout?.columnCount)).to.equal(3);
		});
	});

	it('removes columnCount from layout when Blockera max. columns is cleared', () => {
		appendBlocks(`<!-- wp:group {"layout":{"type":"grid","columnCount":3}} -->
<div class="wp-block-group"><!-- wp:heading -->
<h2 class="wp-block-heading">Heading text</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>paragraph text</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
`);

		cy.getBlock('core/heading').first().click();
		cy.getByAriaLabel('Select parent block: Grid').click();
		cy.checkActiveBlockVariation('group-grid');
		cy.addNewTransition();

		cy.getByAriaControls('styles-view').click();
		cy.typeInInputByDataTest('layout-grid-column-count', '');
		cy.waitForAssertValue();

		assertBlockData((data) => {
			const layout = getSelectedBlock(data, 'layout');

			expect(layout?.type).to.equal('grid');
			expect(layout?.columnCount).to.be.undefined;
			expect(getSelectedBlock(data, 'blockeraGridColumnCount')).to.equal(
				''
			);
		});
	});
});
