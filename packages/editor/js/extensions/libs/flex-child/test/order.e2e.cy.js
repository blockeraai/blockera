import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	appendBlocks,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Flex Child → Order', () => {
	beforeEach(() => {
		createPost();
	});

	it('first and last options', () => {
		let code = `<!-- wp:group {"blockeraPropsId":"1025111558103","blockeraDisplay":{"value":"flex"},"className":"blockera-group","layout":{"type":"flex"}} -->
<div class="wp-block-group blockera-group"><!-- wp:paragraph {"blockeraPropsId":"102511163356","blockeraCompatId":"109181622258","blockeraFlexChildOrder":{"value":"first"},"className":"blockera-paragraph blockera-paragraph blockera-block blockera-block\u002d\u002dxzks83"} -->
<p class="blockera-paragraph blockera-paragraph blockera-block blockera-block--xzks83">This is a test text.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;
		appendBlocks(code);
		cy.getBlock('core/paragraph').click();
		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Self Order', 'base-control').should('exist');

		//
		// First
		//

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'order', '-1');

		//Check store
		getWPDataObject().then((data) => {
			expect('first').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexChildOrder')
			);
		});

		//
		// Last
		//

		code = `<!-- wp:group {"blockeraPropsId":"1025111558103","blockeraDisplay":{"value":"flex"},"className":"blockera-group","layout":{"type":"flex"}} -->
<div class="wp-block-group blockera-group"><!-- wp:paragraph {"blockeraPropsId":"102511163356","blockeraCompatId":"109181622258","blockeraFlexChildOrder":{"value":"last"},"className":"blockera-paragraph blockera-paragraph blockera-block blockera-block\u002d\u002dxzks83"} -->
<p class="blockera-paragraph blockera-paragraph blockera-block blockera-block--xzks83">This is a test text.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;
		appendBlocks(code);
		cy.getBlock('core/paragraph').click();
		cy.getByDataTest('style-tab').click();

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'order', '100');

		//Check store
		getWPDataObject().then((data) => {
			expect('last').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexChildOrder')
			);
		});

		//Check frontend
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-paragraph').should('have.css', 'order', '100');
	});

	it('should update correctly, when adding custom order', () => {
		const code = `<!-- wp:group {"blockeraPropsId":"1025111558103","blockeraDisplay":{"value":"flex"},"className":"blockera-group","layout":{"type":"flex"}} -->
<div class="wp-block-group blockera-group"><!-- wp:paragraph {"blockeraPropsId":"102511163356","blockeraCompatId":"109182048223","blockeraFlexChildOrder":{"value":"custom"},"blockeraFlexChildOrderCustom":{"value":"10"},"className":"blockera-paragraph blockera-paragraph blockera-block blockera-block\u002d\u002dzfnfd0"} -->
<p class="blockera-paragraph blockera-paragraph blockera-block blockera-block--zfnfd0">This is a test text.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`;
		appendBlocks(code);
		cy.getBlock('core/paragraph').click();
		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Self Order', 'base-control').should('exist');

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'order', '10');

		//Check store
		getWPDataObject().then((data) => {
			expect('10').to.be.equal(
				getSelectedBlock(data, 'blockeraFlexChildOrderCustom')
			);
		});

		//Check frontend
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-paragraph').should('have.css', 'order', '10');
	});
});
