/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	getWPDataObject,
	getSelectedBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('Block Card', () => {
	beforeEach(() => {
		createPost();
	});

	it('Check block card to be sticky while scrolling', () => {
		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		cy.get('.editor-sidebar').scrollTo('bottom');

		cy.get('.blockera-block-card-wrapper').should('be.visible');
		cy.get('.blockera-block-card-wrapper').should('have.class', 'is-stuck');
	});

	it('Inline edit block name + variation', () => {
		//
		// 1. Block with custom name and default name
		//
		appendBlocks(`<!-- wp:paragraph {"metadata":{"name":"My custom name"}} -->
<p>Block with custom name</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Block with default name</p>
<!-- /wp:paragraph -->
			`);

		//
		// Switch to first block and check block card title
		//
		cy.getBlock('core/paragraph').first().click();

		cy.get('.blockera-extension-block-card__title__input').should(
			'have.class',
			'is-edited'
		);

		cy.get('.blockera-extension-block-card__title__input span').should(
			'have.text',
			'My custom name'
		);

		getWPDataObject().then((data) => {
			expect('My custom name').to.be.equal(
				getSelectedBlock(data, 'metadata')?.name
			);
		});

		//
		// Switch to second block and check block card title
		//
		cy.getBlock('core/paragraph').last().click();

		cy.get('.blockera-extension-block-card__title__input').should(
			'not.have.class',
			'is-edited'
		);

		cy.get('.blockera-extension-block-card__title__input span')
			.should('have.text', '')
			.should('have.attr', 'placeholder', 'Paragraph');

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'metadata')?.name
			);
		});

		//
		// 2. Rename block name
		//
		cy.getBlock('core/paragraph').last().click();

		cy.get('.blockera-extension-block-card__title__input span').click();

		cy.get('.blockera-extension-block-card__title__input span').type(
			'New custom name'
		);

		cy.get('.blockera-extension-block-card__title__input span').blur();

		cy.get('.blockera-extension-block-card__title__input').should(
			'have.class',
			'is-edited'
		);

		cy.get('.blockera-extension-block-card__title__input span').should(
			'have.text',
			'New custom name'
		);

		getWPDataObject().then((data) => {
			expect('New custom name').to.be.equal(
				getSelectedBlock(data, 'metadata')?.name
			);
		});

		//
		// 3. Rename block name with Escape key
		//
		cy.getBlock('core/paragraph').last().click();

		cy.get('.blockera-extension-block-card__title__input span').click();

		cy.get('.blockera-extension-block-card__title__input span').type(
			'{esc}'
		);

		cy.get('.blockera-extension-block-card__title__input').should(
			'not.have.class',
			'is-edited'
		);

		cy.get('.blockera-extension-block-card__title__input span')
			.should('have.text', '')
			.should('have.attr', 'placeholder', 'Paragraph');

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'metadata')?.name
			);
		});

		//
		// 4. check rename and block variation
		//
		appendBlocks(`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"style":{"color":{"background":"#ffd2d2"}}} -->
<p class="has-background" style="background-color:#ffd2d2">Paragraph 1</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"style":{"color":{"background":"#ffe3e3"}}} -->
<p class="has-background" style="background-color:#ffe3e3">Paragraph 2</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`);

		// Select target block
		cy.getBlock('core/paragraph').first().click();

		// Switch to parent block
		cy.getByAriaLabel('Select parent block: Group').click();

		//
		// 4.1. check block card title for default variation
		//
		cy.get('.blockera-extension-block-card__title__input').should(
			'not.have.class',
			'is-edited'
		);

		cy.get('.blockera-extension-block-card__title__input span')
			.should('have.text', '')
			.should('have.attr', 'placeholder', 'Group');

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'metadata')?.name
			);
		});

		//
		// 4.2. change to Row variation and check block card title
		//
		cy.setBlockVariation('group-row');

		cy.get('.blockera-extension-block-card__title__input').should(
			'not.have.class',
			'is-edited'
		);

		cy.get('.blockera-extension-block-card__title__input span')
			.should('have.text', '')
			.should('have.attr', 'placeholder', 'Row');

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'metadata')?.name
			);
		});

		//
		// 4.3. change to block name and check block card title
		//

		cy.get('.blockera-extension-block-card__title__input span').click();

		cy.get('.blockera-extension-block-card__title__input span').type(
			'New custom group name'
		);

		cy.get('.blockera-extension-block-card__title__input span').blur();

		cy.get('.blockera-extension-block-card__title__input').should(
			'have.class',
			'is-edited'
		);

		cy.get('.blockera-extension-block-card__title__input span').should(
			'have.text',
			'New custom group name'
		);

		getWPDataObject().then((data) => {
			expect('New custom group name').to.be.equal(
				getSelectedBlock(data, 'metadata')?.name
			);
		});

		//
		// 4.4. switch variation and check block card title
		//
		cy.setBlockVariation('group-stack');

		cy.get('.blockera-extension-block-card__title__input').should(
			'have.class',
			'is-edited'
		);

		cy.get('.blockera-extension-block-card__title__input span').should(
			'have.text',
			'New custom group name'
		);

		getWPDataObject().then((data) => {
			expect('New custom group name').to.be.equal(
				getSelectedBlock(data, 'metadata')?.name
			);
		});

		//
		// 4.5. remove block name and check block card title
		//
		cy.get('.blockera-extension-block-card__title__input span').click();

		cy.get('.blockera-extension-block-card__title__input span').type(
			'{esc}'
		);

		cy.get('.blockera-extension-block-card__title__input').should(
			'not.have.class',
			'is-edited'
		);

		cy.get('.blockera-extension-block-card__title__input span')
			.should('have.text', '')
			.should('have.attr', 'placeholder', 'Stack');

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'metadata')?.name
			);
		});

		//
		// 4.6. change variation and check block card title
		//
		cy.setBlockVariation('group-grid');

		cy.get('.blockera-extension-block-card__title__input').should(
			'not.have.class',
			'is-edited'
		);

		cy.get('.blockera-extension-block-card__title__input span')
			.should('have.text', '')
			.should('have.attr', 'placeholder', 'Grid');

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'metadata')?.name
			);
		});
	});
});
